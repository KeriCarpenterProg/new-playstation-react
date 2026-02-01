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

// 3. Define function to upload file to S3
async function downloadImage(url) {
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'arraybuffer'
    });
    return response.data;
}

// 4. Define function to upload file to S3
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
    const baseUrl = process.env.CLOUDFRONT_URL || `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com`;    
    return `${baseUrl}/${filename}`;
}


// 5. Main function:  download from IGDB and upload to S3
async function uploadGameImageToS3(igdbUrl,gameId, imageType = 'cover') {
    try {
        // Download the image from IGDB
        console.log(`Downloading image from IGDB: ${igdbUrl}`);
        const imageBuffer = await downloadImage(igdbUrl);
        console.log(`Image downloaded successfully`);

        // Generate a filename based on game ID and date Now
        const filename = `games/${gameId}/${imageType}_${Date.now()}.jpg`;
        console.log(`Generating filename: ${filename}`);

        // Upload the image to S3
        console.log(`Uploading image to S3: ${filename}`);
        const imageUrl = await uploadToS3(imageBuffer, filename);
        console.log(`✅ Upload successful: ${imageUrl}`);
        return imageUrl;
    } catch (error) {
        console.error('❌ Upload failed:', error);
        throw error;
    }
}


module.exports = {
    uploadGameImageToS3,
    downloadImage,
    uploadToS3,
};