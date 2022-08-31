const config = require('./config.js');
const express = require('express');
const semver = require('semver');
const { generateToken, verifyToken } = require('./jwt.js');

exports.init = function initialize (app) {

	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	app.get('/version-check', (req, res) => {
		res.send(process.env.npm_package_version);
	});

	app.use((req, res, next) => {
		const clientVersion = req.headers?.['version'] || req.body?.['version'] || req.cookies?.['version'];
		if (semver.satisfies(clientVersion, config.version)) next();
		else return res.status(400).send({ success: false, data: `Client version is outdated; please use ${config.version}` });
	});

	app.use((req, res, next) => {
		res.success = data => res.send(JSON.stringify({ success: true, data }));
		res.error = (err, data) => res.status(400).send({ success: false, error: err.message, data });
		next();
	});

	app.use(async (req, res, next) => {
		const token = req.headers?.['x-auth-token'] || req.body?.['x-auth-token'] || req.cookies?.['x-auth-token'];
		if (!token) return next();
		try {
			const parsed = verifyToken(token);
			req.user = parsed;
		} catch (err) {
			// console.log(err);
		} finally {
			next();
		}
	});

	app.use('/api', (req, res, next) => {
		if (!req.user) return res.status(401).send('Please log in');
		next();
	});

	app.use((err, req, res, next) => {
		console.error(err);
		res.status(500).send('Something broke!');
	});
}
