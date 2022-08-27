const mongoose = require('mongoose');
const DB = require('../connection.js');

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
		trim: true
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
		default: 'https://i.ibb.co/86dtnKG/rkh.jpg'
	},
	keys: {
		type: Map,
		of: String,
		required: true
	},
	admin: Boolean
});

const User = DB.model('User', UserSchema, 'users');

async function getUser (userId) {
	return User.findById(userId);
}

async function checkUser (userId) {
	return getUser(userId).lean();
}

module.exports = {
	getUser,
	checkUser
};
