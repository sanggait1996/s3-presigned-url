const express = require('express');
const app = express();
const port = 3000;
const AWS = require('aws-sdk');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
    Bucket: process.env.BUCKET_NAME,
    signatureVersion: process.env.SIGNATUREVERSION,
    region: process.env.REGION,
});

app.post('/get-presigned-url-for-upload', async (req, res) => {
    const fileName = req.body.fileName;
    const userId = req.body.userId;
    const prefix = req.body.prefix;
    let extension = '';

    // validation data
    try {
        if (userId === undefined) throw 'userId is required.';
        if (prefix === undefined) throw 'prefix is required.';
        if (fileName === undefined) {
            throw 'fileName is required.';
        } else {
            extension = fileName.split('.')[1];
            const validImageExtensions = [
                'jpg',
                'jpeg',
                'bmp',
                'gif',
                'png',
                'jpg',
            ];
            if (!validImageExtensions.includes(extension))
                throw `${fileName} is not an image.`;
        }
    } catch (err) {
        console.log(err);
        return res.status(400).send({
            success: false,
            message: err,
        });
    }

    const newFileName = `${uuidv4()}.${extension}`;
    const params = {
        Bucket: 's3.stripical.xyz',
        Key: `${req.body.prefix}/${req.body.userId}/${newFileName}`,
        Expires: 60 * 5,
        ContentType: `image/${extension}`,
    };
    try {
        const url = await new Promise((resolve, reject) => {
            s3.getSignedUrl('putObject', params, (err, url) => {
                err ? reject(err) : resolve(url);
            });
        });
        console.log(`Genarated an url: ${url}`);
        console.log(`Generated an url with filename: ${newFileName}`);
        console.log(`generated an pre-signed url at: ${new Date()}`);

        res.status(200).send({
            success: true,
            url: url,
            userId: userId,
            prefix: prefix,
            fileName: fileName,
        });
    } catch (err) {
        if (err) {
            console.log(err);
            return res.send(500).send({
                success: false,
                message: err,
            });
        }
    }
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
