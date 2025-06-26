const sharp = require('sharp');

module.exports = function crop(buffer, { left = 0, top = 0, width, height }) {
    return sharp(buffer)
        .extract({ left, top, width, height });
};
