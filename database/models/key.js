const mongoose = require('mongoose');
const DB = require('../connection.js');

const KeySchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	with: {
		type: String,
		required: false
	}
});

const Key = DB.model('Key', KeySchema, 'keys');

const { log } = require('./log.js');
const { getUser } = require('./user.js');

async function getKey (keyId) {
	return Key.findById(keyId);
}

async function checkKey (keyId) {
	const key = await getKey(keyId);
	if (!key.with) return { key };
	const user = await getUser(key.with);
	return { key, user };
}

async function borrowKey (keyId, to) {
	const key = await getKey(keyId);
	if (!key) return Promise.reject(new Error('Invalid key ID'));
	const user = await getUser(to);
	if (!user) return Promise.reject(new Error('Invalid user ID'));
	if (key.with) {
		const isWith = await getUser(key.with).lean();
		return Promise.reject([new Error(`Key is currently with ${user.name} (${user.room})`), { isWith }]);
	}
	const warnings = [];
	if (user.keys.size) warnings.push(`User already has keys ${[...user.keys()].join(', ')}`);
	user.keys.set(keyId, key.name);
	key.with = user._id;
	await user.save();
	await key.save();
	await log({ action: 'borrow', to });
	return warnings;
}

async function returnKey (keyId, to) {
	const key = await getKey(keyId);
	if (!key) return Promise.reject(new Error('Invalid key ID'));
	if (!key.with) return Promise.reject(new Error('Key is currently with security!'));
	const user = await getUser(to);
	if (!user) return Promise.reject(new Error('Invalid user ID'));
	if (user._id !== key.with) return Promise.reject(new Error('The key is not with this user'));
	user.keys.delete(keyId);
	key.with = undefined;
	await.user.save();
	await key.save();
	await log({ action: 'return', from: to });
	return;
}

async function transferKey (keyId, from, to) {
	const key = await getKey(keyId);
	if (!key) return Promise.reject(new Error('Invalid key ID'));
	if (from === to) return Promise.reject(new Error('Keys cannot be transferred between the same person'));
	if (key.with !== from && key.with !== to) return Promise.reject(new Error('Transferrer does not have the key'))
	const fromUser = await getUser(key.with), toUser = await getUser(from === key.with ? to : from);
	if (!fromUser || !toUser) return Promise.reject(new Error('Invalid user ID(s)'));
	const fromId = fromUser._id, toId = toUser._id;
	key.with = toId;
	fromUser.keys.delete(keyId);
	toUser.keys.set(keyId, key.name);
	await fromUser.save();
	await toUser.save();
	await key.save();
	await log({ action: 'transfer', from: fromId, to: toId });
}

module.exports = {
	getKey,
	checkKey,
	borrowKey,
	returnKey,
	transferKey
};
