const express = require('express');
const app = express();
const port = 3000;
const AWS = require('aws-sdk');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

app.use(express.urlencoded({ extended: true }));

const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
    Bucket: process.env.BUCKET_NAME,
    signatureVersion: process.env.SIGNATUREVERSION,
    region: process.env.REGION,
});

app.post('/get-presigned-url-for-upload', async (req, res) => {
    const params = {
        Bucket: 's3.stripical.xyz',
        Key: `${req.body.prefix}/${req.body.userId}/${uuidv4()}.jpg`,
        Expires: 60 * 5,
        ContentType: 'image/jpg',
    };
    try {
        const url = await new Promise((resolve, reject) => {
            s3.getSignedUrl('putObject', params, (err, url) => {
                err ? reject(err) : resolve(url);
            });
        });

        res.send({
            url: url,
            userId: req.body.userId,
            prefix: req.body.prefix,
        });
    } catch (err) {
        if (err) {
            console.log(err);
        }
    }
});

// app.get('/get-url-image-access', (req, res) => {
//     var params = {
//         Bucket: process.env.BUCKET_NAME,
//         Key: 'avatar/USER001/95a8ee4f-651b-451a-ad10-eb41feb4a680.jpg',
//     };
//     s3.getSignedUrl('getObject', params, (error, data) => {
//         console.log(error);
//         console.log(data);
//         res.send(data);
//     });
// });

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
