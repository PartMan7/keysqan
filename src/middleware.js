const express = require('express');
const { generateToken, verifyToken } = require('./jwt.js');

exports.init = function initialize (app) {

	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	app.use((req, res, next) => {
		const token = req.headers?.['x-auth-token'] || req.body?.['x-auth-token'] || req.cookies?.['x-auth-token'];
		const parsed = verifyToken(token);
		if (parsed.success) req.user = parsed.data;
		next();
	});

	app.use('/api', (req, res, next) => {
		if (!req.user) return res.status(401).send('Please log in');
		next();
	});

	app.use('/api', (req, res, next) => {
		res.success = data => res.send(JSON.stringify({ success: true, data }));
		res.error = (err, data) => res.status(400).send({ success: false, error: err, data });
		next();
	});
}
