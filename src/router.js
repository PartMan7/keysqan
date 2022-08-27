const express = require('express');
const router = express.Router();
const { checkUser } = 
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
	checkKey(req.params.keyId).then(key => {
		res.success(key);
	});
});

router.all('/api/user/:userId', (req, res) => {
	// Fetches :userId's profile info
	checkUser(req.params.userId).then(user => {
		res.success(user);
	});
});

router.all('/api/exchange/:keyId', (req, res) => {
	// Can do three things:
	// a) If key is available, req.user borrows :keyId
	// b) If key is unavailable and req.user._id === :keyId.with, req.user returns :keyId
	// c) If key is unavailable and req.user._id !== :keyId.with, error is shown with the current holder's info
});

router.all('/api/transfer/:keyId/:userId', (req, res) => {
	// Transfer :keyId between :userId and req.user
});

module.exports = router;
