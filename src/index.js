global.SECRETS = require('./secrets.json');

const config = require('./config.js');
const database = require('../database/connection.js');
const express = require('express');
const middleware = require('./middleware.js');
const router = require('./router.js');

const app = express();

middleware.init(app);
app.use(router);

app.listen(config.port, () => console.log('App is running on port ' + config.port));
