const crypto = require('crypto');
const seed = SECRETS.OTP_SEED;

function inputToOTP (input) {
	const hash = crypto.createHash('sha256').update(input).digest('hex');
	const otp = String(parseInt(hash.slice(-5), 16)).padStart(6, '0').slice(-6);
	return otp;
}

exports.generateOTP = function (id) {
	const time = Math.floor(Date.now() / (5 * 60_000));
	const otp = inputToOTP(seed + id + time);
	return otp;
};

exports.checkOTP = function (otp, id) {
	const time = Math.floor(Date.now() / (5 * 60_000));
	const currentOTP = inputToOTP(seed + id + time);
	if (otp === currentOTP) return true;
	const lastOTP = inputToOTP(seed + id + (time - 1));
	if (otp === lastOTP) return true;
	return false;
};

console.log(exports.generateOTP('6309ca8bbf2d8e014e058245'));
