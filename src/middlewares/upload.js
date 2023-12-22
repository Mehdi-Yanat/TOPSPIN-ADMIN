const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    dest: path.join(__dirname, 'uploads'), // Specify the destination folder
});

// Middleware function to handle Excel file upload
const excelUploadMiddleware = upload.single('file');

// Middleware function to process the uploaded Excel file and add groups
const processExcelMiddleware = async (req, res, next) => {
    try {
        const identifierGroup = req.body && req.body.identifierGroup;
        const hasExcelFile = req.file;

        if (!identifierGroup && !hasExcelFile) {
            return res.status(400).json({ error: 'Either identifierGroup or Excel file is required.' });
        }

        if (hasExcelFile) {
            // Access the uploaded file from req.file.buffer
            const buffer = req.file.buffer;

            // Check if the file is an Excel file (xlsx or xls)
            if (!isExcelFile(req.file.originalname)) {
                return res.status(400).json({ error: 'Invalid file type. Please upload an Excel file.' });
            }

            // Parse the Excel file
            const workbook = xlsx.read(buffer, { type: 'buffer' });

            // Process the Excel data and add groups
            req.body.workbook = workbook;  // Attach the parsed workbook to the request object
        }

        next();
    } catch (error) {
        console.error('Error processing file upload:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Function to check if a file has an Excel extension
const isExcelFile = (filename) => {
    const allowedExtensions = ['.xlsx', '.xls', '.ods'];
    const fileExtension = path.extname(filename).toLowerCase();
    return allowedExtensions.includes(fileExtension);
};

module.exports = {
    excelUploadMiddleware,
    processExcelMiddleware,
};
