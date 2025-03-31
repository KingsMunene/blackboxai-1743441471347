const path = require('path');
const fs = require('fs');
const { UPLOAD_DIR } = process.env;

// Configure multer for user uploads
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(UPLOAD_DIR, 'user-uploads'));
    },
    filename: (req, file, cb) => {
        const userId = req.session.user.id;
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `user-${userId}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (path.extname(file.originalname) !== '.xlsx') {
            return cb(new Error('Only Excel files are allowed'));
        }
        cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
}).single('userExcelFile');

module.exports = {
    showUploadForm: (req, res) => {
        res.render('user/upload-serials');
    },

    handleUserUpload: (req, res) => {
        upload(req, res, (err) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            // TODO: Store upload record in database
            res.json({ 
                success: true, 
                filename: req.file.originalname,
                path: req.file.path 
            });
        });
    },

    viewUploadStatus: (req, res) => {
        // TODO: Fetch user's upload history from database
        const uploads = [
            { filename: 'serials-2023.xlsx', status: 'Processed', date: '2023-11-15' },
            { filename: 'inventory-list.xlsx', status: 'Pending', date: '2023-11-16' }
        ];

        res.render('user/status', { uploads });
    }
};