const mongoose = require('mongoose');
const DB = require('../connection.js');

const LogSchema = new mongoose.Schema({
	action: {
		type: String,
		required: true,
		enum: ['borrow', 'return', 'transfer']
	},
	from: {
		type: String,
		required: function () { return this.action !== 'borrow'; }
	},
	to: {
		type: String,
		required: function () { return this.action !== 'return'; }
	},
	at: {
		type: Date,
		required: true,
		default: Date.now
	}
});

const Log = DB.model('Log', LogSchema, 'logs');

async function countLogs () {
	return Log.countDocuments();
}

async function getLogs (page, perPage) {
	return Log.find({}, {
		action: true,
		from: true,
		to: true,
		at: true
	}, { skip: page * perPage, limit: perPage });
}

async function log (obj) {
	const newLog = new Log({
		action: obj.action,
		from: obj.from,
		to: obj.to
	});
	return newLog.save();
}

module.exports = {
	countLogs,
	getLogs,
	log
};
