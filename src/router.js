const express = require('express');
const router = express.Router();

const { getUser, findUserByMobile } = require('../database/models/user.js');
const { checkKey, borrowKey, returnKey, transferKey } = require('../database/models/key.js');

const { generateToken, verifyToken } = require('./jwt.js');
const checkNonce = require('./nonce.js');
const { checkOTP, generateOTP } = require('./otp.js');
const SMS = require('./sms.js');

router.post('/login', async (req, res) => {
	// Login attempt; redirect to home if success, else send TOTP
	// { mobile: String }
	const { mobile } = req.body;
	if (typeof mobile !== 'string') return res.error(new Error('Missing mobile field'));
	const user = await findUserByMobile(mobile);
	if (!user) return res.error(new Error('Mobile number not found'));
	const otp = generateOTP(user._id.toString());
	SMS(mobile, otp).then(() => res.success('Your OTP has been sent via SMS and will be valid for 5 minutes.')).catch(res.error);
});

router.post('/otp', async (req, res) => {
	// Validates OTP:
	// { mobile: String, otp: String }
	const { mobile, otp } = req.body;
	if (typeof mobile !== 'string' || typeof otp !== 'string') return res.error(new Error('Missing mobile/OTP field'));
	const user = await findUserByMobile(mobile);
	if (!user) return res.error(new Error('Mobile number not found'));
	if (!checkOTP(otp, user._id.toString())) return res.error(new Error('Invalid OTP'));
	// Validated successfully
	const token = generateToken(user.toJSON());
	return res.success(token);
});

router.post('/update', (req, res) => {
	// Updates user profile picture
});


router.all('/api/key/:keyId', (req, res) => {
	// Fetches :keyId information
	checkKey(req.params.keyId).then(res.success).catch(res.error);
});

router.all('/api/user/:userId', (req, res) => {
	// Fetches :userId's profile info
	getUser(req.params.userId).then(res.success).catch(res.error);
});

router.all('/api/exchange/:keyId/:nonce', async (req, res) => {
	// Can do three things:
	// a) If key is available, req.user borrows :keyId
	// b) If key is unavailable and req.user._id === :keyId.with, req.user returns :keyId
	// c) If key is unavailable and req.user._id !== :keyId.with, error is shown with the current holder's info
	if (!checkNonce(req.params.nonce)) return res.error(new Error('Invalid/missing nonce'));
	const keyInfo = await checkKey(req.params.keyId);
	if (!keyInfo?.key) return res.error(new Error('Invalid key'));
	const key = keyInfo.key;
	if (!key.with) {
		try {
			const warnings = await borrowKey(req.params.keyId, req.user._id.toString());
			return res.success(warnings);
		} catch (err) {
			if (Array.isArray(err)) res.error(...err);
			else res.error(err);
		}
	} else if (key.with === req.user._id.toString()) {
		await returnKey(req.params.keyId, req.user._id.toString());
		return res.success(null);
	} else res.error(new Error(`Key is with ${keyInfo.with.name}`), keyInfo.with);
});

router.all('/api/transfer/:keyId/:userId', (req, res) => {
	// Transfer :keyId between :userId and req.user
	if (!req.params.keyId || !req.params.userId) return res.error(new Error('Missing keyId/userId'));
	transferKey(req.params.keyId, req.params.userId, req.user._id.toString()).then(res.success).catch(res.error);
});

router.all((req, res) => {
	res.status(404).send('Page not found');
});

module.exports = router;
