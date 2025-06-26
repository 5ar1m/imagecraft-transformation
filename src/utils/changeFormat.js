const sharp = require('sharp');

module.exports = function changeFormat(buffer, format) {
    return sharp(buffer).toFormat(format);
};