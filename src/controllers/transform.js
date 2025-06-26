const { StatusCodes } = require('http-status-codes');
const downloadImageBuffer = require('../services/image');
const internalErr = require('../middlewares/error');

async function transform(req, res) {
    const key = req.params.key
    try {
        const imgBuffer = await downloadImageBuffer(key);

        return res.status(StatusCodes.OK).send(imgBuffer);
    } catch (err) {
        return internalErr(err, req, res);
    }
}

module.exports = transform;