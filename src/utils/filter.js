const sharp = require('sharp');

module.exports = function filter(buffer, type) {
    const image = sharp(buffer);

    switch (type) {
        case 'greyscale':
            image.greyscale();
            break;
        case 'blur':
            image.blur();
            break;
        case 'sharpen':
            image.sharpen();
            break;
        case 'invert':
            image.negate();
            break
        case 'sepia':
            image
                .modulate({ saturation: 0.3 })
                .tint('#704214');
            break;
        default:
            break;
    }

    return image;
};