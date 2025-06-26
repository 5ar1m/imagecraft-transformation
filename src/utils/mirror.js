const sharp = require('sharp');

module.exports = function mirror(buffer) {
    return sharp(buffer).flop();
};