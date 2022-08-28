const express = require('express');
const router = express.Router();
const { checkUser } = require('../database/models/user.js');
const { checkKey, borrowKey, returnKey, transferKey } = require('../database/models/key.js');

router.post('/login', (req, res) => {
	// Login attempt; redirect to home if success, else send TOTP
	// { mobile: String }
	// { email: String }
});

router.post('/otp', (req, res) => {
	// Validates OTP:
	// { mobile: String, otp: String }
	// { email: String, otp: String }
});

router.all('/logout', (req, res) => {
	// Logs out
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
	checkUser(req.params.userId).then(res.success).catch(res.error);
});

router.all('/api/exchange/:keyId', async (req, res) => {
	// Can do three things:
	// a) If key is available, req.user borrows :keyId
	// b) If key is unavailable and req.user._id === :keyId.with, req.user returns :keyId
	// c) If key is unavailable and req.user._id !== :keyId.with, error is shown with the current holder's info
	const key = await checkKey(req.params.keyId);
	if (!key) return res.error(new Error('Invalid key'));
	if (!key.with) {
		const warnings = await borrowKey(req.params.keyId, req.user._id);
		return res.success(warnings);
	} else if (key.with === req.user._id) {
		await returnKey(req.params.keyId, req.user._id);
		return res.success(true);
	} else checkUser(key.with).then(user => res.error(new Error(`Key is with ${user.name}`), user));
});

router.all('/api/transfer/:keyId/:userId', (req, res) => {
	// Transfer :keyId between :userId and req.user
	if (!req.params.keyId || !req.params.userId) return res.status(422).send('Missing keyId/userId');
	transferKey(req.params.keyId, req.params.userId, req.user._id).then(res.success).catch(res.error);
});

module.exports = router;
