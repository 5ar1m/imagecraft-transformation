require('dotenv').config();
const {StatusCodes} = require('http-status-codes');

module.exports = function auth(req, res, next) {
    const clientKey = req.header('x-api-key');
    const serverKey = process.env.API_ACCESS_KEY;

    if (!clientKey || clientKey !== serverKey) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Unauthorized: Invalid API key' });
    }

    next();
};
