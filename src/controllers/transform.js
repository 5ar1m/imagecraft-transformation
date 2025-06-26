const { StatusCodes } = require('http-status-codes');

async function transform(req, res) {
    return res.status(StatusCodes.OK).json({
        message: 'transformed image'
    });
}

module.exports = transform;