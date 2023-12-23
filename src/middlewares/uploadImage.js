const multer = require('multer');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

async function handleUpload(file) {

    const allowedFormats = ['jpg', 'jpeg', 'png', 'gif'];

    const res = await cloudinary.uploader.upload(file, {
        resource_type: "auto",
        folder: "images",
    });
    return res;
}

const storage = multer.memoryStorage();
const upload = multer({
    storage,
});

module.exports = { upload, handleUpload };
