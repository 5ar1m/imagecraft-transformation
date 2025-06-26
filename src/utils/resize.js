const sharp = require('sharp');

module.exports = function resize(buffer, { width, height }) {
    return sharp(buffer).resize(width, height);
};