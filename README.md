-   setup
    npm install

-   start project
    npm start

Docker image:

sudo docker run -p 80:3000 s3-presigned-url:latest

-   How to get Presigned url

        -   domain:port/get-presigned-url-for-upload

            Body: there are three params in body

            {
                "prefix": "avatar",
                "userId": "user123",
                "fileName": "image.jpg"
            }
