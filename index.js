const express = require('express');
const app = express();
const port = 3000;
const AWS = require('aws-sdk');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
    Bucket: process.env.BUCKET_NAME,
    signatureVersion: process.env.SIGNATUREVERSION,
    region: process.env.REGION,
});

app.get('/get-presigned-url-for-upload', async (req, res) => {
    const params = {
        Bucket: 's3.stripical.xyz',
        Key: `${uuidv4()}.jpg`,
        Expires: 60 * 5,
        ContentType: 'image/jpg',
    };
    try {
        const url = await new Promise((resolve, reject) => {
            s3.getSignedUrl('putObject', params, (err, url) => {
                err ? reject(err) : resolve(url);
            });
        });
        console.log(url);
        res.send({ url: url });
    } catch (err) {
        if (err) {
            console.log(err);
        }
    }
});

app.get('/get-url-image-access', (req, res) => {
    var params = {
        Bucket: process.env.BUCKET_NAME,
        Key: 'audi2.jpg',
    };
    s3.getSignedUrl('getObject', params, (error, data) => {
        console.log(error);
        console.log(data);
        res.send(data);
    });
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
