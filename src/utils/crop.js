const sharp = require('sharp');

module.exports = function crop(buffer, { width, height, x, y }) {
    return sharp(buffer)
        .extract({ width, height, x, y });
};
