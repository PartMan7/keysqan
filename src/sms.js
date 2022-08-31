const axios = require('axios');

const cooldowns = {};

module.exports = function SMS (mobile, otp) {
	// Ratelimit this!
	if (cooldowns[mobile]) return Promise.reject(new Error('Ratelimited'));
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
		cooldowns[mobile] = true;
		setTimeout(() => {
			delete cooldowns[mobile];
		}, 60_000);
		return Promise.resolve(res);
	});
}
