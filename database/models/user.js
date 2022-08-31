const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true
	},
	roll: {
		type: String,
		required: true,
		unique: true,
		minLength: 9,
		maxLength: 9,
		uppercase: true,
		trim: true
	},
	mobile: {
		type: String,
		required: true,
		trim: true,
		minLength: 10
	},
	room: {
		type: String,
		required: true,
		trim: true,
		uppercase: true
	},
	email: {
		type: String,
		required: true,
		trim: true,
		lowercase: true
	},
	image: {
		type: String,
		required: true,
		trim: true,
		default: 'https://i.ibb.co/nf6C3JH/xdtgfhcjgvbhkjnl.jpg'
	},
	keys: {
		type: Map,
		of: String,
		required: true,
		default: new Map()
	},
	admin: Boolean
});

const User = mongoose.model('User', UserSchema, 'users');

async function getUser (userId) {
	return User.findById(userId);
}

async function findUserByMobile (mobile) {
	mobile = mobile.replace(/\D/g, '');
	const user = await User.findOne({ mobile });
	return user;
}

module.exports = {
	getUser,
	findUserByMobile
};
