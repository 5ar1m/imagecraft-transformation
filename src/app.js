const express = require('express');
const transformRoute = require('./routes/transform');

const app = express();

app.use('v1/', transformRoute);

module.exports = app;