const mongoose = require('mongoose');
mongoose.connect(SECRETS.MONGO_URL, {
	connectTimeoutMS: 5000
}).then(db => {
	const socket = db.connections[0];
	console.log(`Connected to the database at ${socket.host}:${socket.port}`);
}).catch(e => console.log(`Unable to connect to the database! ${e.message}`, e));
