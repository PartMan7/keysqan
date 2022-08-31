const axios = require('axios');

const cooldowns = {};

module.exports = function SMS (mobile, otp, ip) {
	// Ratelimit this!
	if (ip && cooldowns[ip]) return Promise.reject(new Error('Ratelimited'));
	mobile = mobile.replace(/\D/g, '');
	return axios.get(`https://api.authkey.io/request`, {
		params: {
			authkey: SECRETS.SMS_API_TOKEN,
			mobile,
			country_code: '+91',
			sid: '5698',
			otp,
			company: 'Keysqan'
		}
	}).then(res => {
		if (ip) {
			cooldowns[ip] = true;
			setTimeout(() => {
				delete cooldowns[ip];
			}, 60_000);
		}
		return Promise.resolve(res);
	});
}
