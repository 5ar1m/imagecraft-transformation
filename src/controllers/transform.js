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
        const metadata = await image.metadata();

        if (transformations.resize) {
            const { width, height } = transformations.resize;
            if (
                typeof width === 'number' && width > 0 &&
                typeof height === 'number' && height > 0
            ) {
                image = resize(image, transformations.resize);
            } else {
                return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid resize dimensions' });
            }
        }

        if (transformations.crop) {
            const { width, height, x = 0, y = 0 } = transformations.crop;
            if (
                typeof width === 'number' && width > 0 &&
                typeof height === 'number' && height > 0 &&
                typeof x === 'number' && x >= 0 &&
                typeof y === 'number' && y >= 0 &&
                x + width <= metadata.width &&
                y + height <= metadata.height
            ) {
                image = crop(image, transformations.crop);
            } else {
                return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid crop dimensions or coordinates' });
            }
        }

        if (transformations.rotate) {
            const angle = transformations.rotate;
            if (typeof angle === 'number' && angle < 360 && angle > -360) {
                image = rotate(image, angle);
            } else {
                return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid rotate angle' });
            }
        }

        if (transformations.filters) {
            const filters = transformations.filters;
            const allowedFilters = ['greyscale', 'blur', 'sharpen', 'invert', 'sepia'];

            if (!Array.isArray(filters)) {
                return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Filters should be an array' });
            }

            for (const filterType of filters) {
                if (!allowedFilters.includes(filterType)) {
                    return res.status(StatusCodes.BAD_REQUEST).json({ error: `Invalid filter: ${filterType}` });
                }
            }

            for (const filterType of filters) {
                image = filter(image, filterType);
            }
        }

        if (transformations.watermark) {
            const text = transformations.watermark;
            if (typeof text === 'string' && text.trim() !== '') {
                image = watermark(image, text);
            } else {
                return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid watermark text' });
            }
        }

        if (transformations.compress) {
            const quality = transformations.compress;
            if (typeof quality === 'number' && quality >= 1 && quality <= 100) {
                image = compress(image, quality);
            } else {
                return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid compress quality (1-100)' });
            }
        }

        if (transformations.mirror) {
            image = mirror(image);
        }

        if (transformations.format) {
            const format = transformations.format;
            const validFormats = ['jpeg', 'png', 'webp', 'bmp'];
            if (typeof format === 'string' && validFormats.includes(format)) {
                image = changeFormat(image, format);
            } else {
                return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid format type' });
            }
        }

        const outputBuffer = await image.toBuffer();
        res.set('Content-Type', 'image/*');
        return res.status(StatusCodes.OK).send(outputBuffer);

    } catch (err) {
        return internalErr(err, req, res);
    }
}

module.exports = transform;