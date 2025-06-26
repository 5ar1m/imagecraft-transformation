const sharp = require('sharp');

module.exports = function watermark(buffer, text) {
    const image = sharp(buffer);

    return image.metadata().then(({ width, height }) => {
        const fontSize = Math.floor(Math.min(width, height) / 6);

        const svgImage = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <style>
                text {
                    font-family: sans-serif;
                    font-size: ${fontSize}px;
                    fill: rgba(255, 255, 255, 0.25);
                }
            </style>
            <g transform="translate(${width / 2}, ${height / 2}) rotate(-45)">
            <text x="0" y="0" text-anchor="middle" dominant-baseline="middle">${text}</text>
            </g>
        </svg>
        `;

        return sharp(bufferOrImage).composite([
            { input: Buffer.from(svgImage), top: 0, left: 0 }
        ]);
    });
};