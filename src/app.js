const express = require('express');
const transformRoute = require('./routes/transform');
const auth = require('./middlewares/auth');

const app = express();

app.use(auth);
app.use(express.json());
app.use('/v1/', transformRoute);

module.exports = app;