const s3Client = require('../config/s3');
const { promisify } = require('util');
require('dotenv').config();

const getObject = promisify(s3Client.getObject.bind(s3Client));

async function downloadImageBuffer(key) {
    const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
    };

    const data = await getObject({ Bucket: AWS_S3_BUCKET, Key: key });
    return data.Body;
}

module.exports = downloadImageBuffer;