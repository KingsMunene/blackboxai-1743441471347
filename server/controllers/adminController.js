const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');
const { UPLOAD_DIR } = process.env;

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Configure multer for file uploads
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
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
}).single('excelFile');

module.exports = {
    dashboard: (req, res) => {
        // TODO: Fetch actual stats from database
        const stats = {
            totalUploads: 42,
            processedFiles: 38,
            activeUsers: 15
        };

        // TODO: Fetch actual activity from database
        const recentActivity = [
            { user: 'john.doe', file: 'serials-2023.xlsx', status: 'Processed', date: '2023-11-15' },
            { user: 'jane.smith', file: 'inventory-list.xlsx', status: 'Pending', date: '2023-11-14' }
        ];

        res.render('admin/dashboard', { stats, recentActivity });
    },

    showUploadForm: (req, res) => {
        res.render('admin/upload-main');
    },

    handleMainUpload: (req, res, next) => {
        upload(req, res, (err) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            // Store the main file path in session
            req.session.mainFilePath = req.file.path;
            res.json({ 
                success: true, 
                filename: req.file.originalname,
                path: req.file.path 
            });
        });
    },

    triggerAutomation: async (req, res) => {
        try {
            if (!req.session.mainFilePath) {
                return res.status(400).json({ error: 'No main Excel file uploaded' });
            }

            // TODO: Implement actual automation logic
            // This would involve:
            // 1. Reading the main Excel file
            // 2. Processing user uploads
            // 3. Generating results

            res.json({ 
                success: true,
                message: 'Automation process started successfully'
            });
        } catch (err) {
            console.error('Automation error:', err);
            res.status(500).json({ error: 'Automation process failed' });
        }
    }
};