const sharp = require('sharp');

module.exports = function compress(buffer, quality = 80) {
    const image = sharp(buffer);

    return image.metadata().then(metadata => {
        const outputFormat = metadata.format;

        switch (outputFormat) {
            case 'jpeg':
                return image.jpeg({ quality });
            case 'png':
                return image.png({ compressionLevel: 9 });
            case 'webp':
                return image.webp({ quality });
            default:
                return image;
        }
    });
};