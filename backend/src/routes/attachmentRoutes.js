const router = require('express').Router();
const { uploadAttachment, getAttachments, downloadAttachment, deleteAttachment } = require('../controllers/attachmentController');
const { authenticate, checkPasswordReset } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(authenticate, checkPasswordReset);

// Nested under tasks: /api/tasks/:id/attachments
router.post('/tasks/:id/attachments', upload.single('file'), uploadAttachment);
router.get('/tasks/:id/attachments', getAttachments);

// Standalone: /api/attachments/:id/download
router.get('/attachments/:id/download', downloadAttachment);
router.delete('/attachments/:id', deleteAttachment);

module.exports = router;
