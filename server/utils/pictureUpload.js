// 1. Import required modules
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const axios = require('axios');

// 2. Initialize S3 client
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// 3. Download an image from a URL
async function downloadImage(url) {
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'arraybuffer'
    });
    return response.data;
}

// 4. Upload file to S3
async function uploadToS3(imageBuffer, filename, contentType='image/jpeg') {
    const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: filename,
        Body: imageBuffer,
        ContentType: contentType,
//        ACL: 'public-read', // Makes the image publicly accessible
    });

    await s3Client.send(command);

    // Return the public URL
    return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`;
}


// 5. Upload a user picture from URL
async function uploadUserPictureFromUrl(pictureUrl, userId) {
    try {
        console.log(`Downloading user picture: ${pictureUrl}`);
        const imageBuffer = await downloadImage(pictureUrl);
        const filename = `users/${userId}/picture_${Date.now()}.jpg`;
        console.log(`Uploading to S3: ${filename}`);
        const imageUrl = await uploadToS3(imageBuffer, filename);
        console.log(`✅ Upload successful: ${imageUrl}`);
        return imageUrl;
    } catch (error) {
        console.error('❌ User picture upload failed:', error);
        throw error;
    }
}

// 6. Upload a user picture from raw file buffer
async function uploadUserPictureFromBuffer(fileBuffer, userId, contentType='image/jpeg') {
    try {
        const filename = `users/${userId}/picture_${Date.now()}.jpg`;
        console.log(`Uploading to S3: ${filename}`);
        const imageUrl = await uploadToS3(fileBuffer, filename, contentType);
        console.log(`✅ Upload successful: ${imageUrl}`);
        return imageUrl;
    } catch (error) {
        console.error('❌ User picture upload failed:', error);
        throw error;
    }
}


module.exports = {
    downloadImage,
    uploadToS3,
    uploadUserPictureFromUrl,
    uploadUserPictureFromBuffer
};