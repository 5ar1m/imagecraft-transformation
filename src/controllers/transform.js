const sharp = require('sharp');
const {StatusCodes} = require('http-status-codes');
const downloadImageBuffer = require('../services/image');
const { internalErr } = require('../middlewares/error');
const mirror = require('../utils/mirror');
const resize = require('../utils/resize');
const crop = require('../utils/crop');
const rotate = require('../utils/rotate');
const changeFormat = require('../utils/changeFormat');
const filter = require('../utils/filter');
const compress = require('../utils/compress');
const watermark = require('../utils/watermark');

async function transform(req, res) {
    const key = req.params.key;

    try {
        const imgBuffer = await downloadImageBuffer(key);
        const { transformations = {} } = req.body;

        let image = sharp(imgBuffer);

        if (transformations.resize) {
            image = resize(image, transformations.resize);
        }

        if (transformations.crop) {
            image = crop(image, transformations.crop);
        }

        if (transformations.rotate) {
            image = rotate(image, transformations.rotate);
        }

        if (transformations.filters) {
            image = filter(image, transformations.filters);
        }

        if (transformations.watermark) {
            image = watermark(image, transformations.watermark);
        }

        if (transformations.compress) {
            image = compress(image, transformations.compress);
        }

        if (transformations.format) {
            image = changeFormat(image, transformations.format);
        }

        const outputBuffer = await image.toBuffer();
        res.set('Content-Type', 'image/*');
        return res.status(StatusCodes.OK).send(outputBuffer);

    } catch (err) {
        return internalErr(err, req, res);
    }
}

module.exports = transform;