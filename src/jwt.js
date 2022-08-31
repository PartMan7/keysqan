const jwt = require('jsonwebtoken');

const JWT_SECRET = Buffer.from(SECRETS.JWT_SECRET, 'base64');
const ACCESS_VALID_TIME = '300d';

const generateToken = payload => {
	return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_VALID_TIME });
};

const verifyToken = (token) => {
	if (typeof token !== 'string') throw new Error('Token is not a string');
	try { return jwt.verify(token, JWT_SECRET) } catch (err) { throw err }
};

module.exports = {
	generateToken,
	verifyToken
};
