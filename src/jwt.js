const jwt = require('jsonwebtoken');

const JWT_SECRET = Buffer.from(SECRETS.JWT_SECRET, 'base64');
const ACCESS_VALID_TIME = '300d';

const generateToken = (payload, options) => {
	return jwt.sign(payload, JWT_SECRET, { expiresIn: options?.expiresIn || ACCESS_VALID_TIME });
};

const verifyToken = (token) => {
	if (typeof token !== 'string') return { success: false, err: 'token not a string' };
	try {
		return { success: true, data: jwt.verify(token, JWT_SECRET) };
	} catch (err) {
		return { success: false, err: err.message };
	}
};

module.exports = {
	generateToken,
	verifyToken
};
