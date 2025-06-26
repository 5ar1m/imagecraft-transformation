const sharp = require('sharp');

module.exports = function rotate(buffer, angle) {
    return sharp(buffer).rotate(angle);
};