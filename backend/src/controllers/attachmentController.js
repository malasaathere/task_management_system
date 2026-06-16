const { Attachment, Task, User } = require('../models');
const fs = require('fs');
const path = require('path');

// POST /api/tasks/:id/attachments
const uploadAttachment = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ errorCode: 'NOT_FOUND', message: 'Task not found' });

    if (!req.file) {
      return res.status(400).json({ errorCode: 'NO_FILE', message: 'No file uploaded' });
    }

    // Permission check: collaborators can only attach to their assigned tasks
    if (req.user.role === 'Collaborator' && task.assignedTo !== req.user.id) {
      fs.unlinkSync(req.file.path); // remove uploaded file
      return res.status(403).json({ errorCode: 'FORBIDDEN', message: 'Access denied' });
    }

    const attachment = await Attachment.create({
      fileName: req.file.originalname,
      filePath: req.file.filename, // store only the generated filename
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      taskId: task.id,
      uploadedBy: req.user.id,
    });

    res.status(201).json({ message: 'File uploaded successfully', attachment });
  } catch (error) {
    res.status(500).json({ errorCode: 'SERVER_ERROR', message: error.message });
  }
};

// GET /api/tasks/:id/attachments
const getAttachments = async (req, res) => {
  try {
    const attachments = await Attachment.findAll({
      where: { taskId: req.params.id },
      include: [{ model: User, as: 'uploader', attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json({ attachments });
  } catch (error) {
    res.status(500).json({ errorCode: 'SERVER_ERROR', message: error.message });
  }
};

// GET /api/attachments/:id/download
const downloadAttachment = async (req, res) => {
  try {
    const attachment = await Attachment.findByPk(req.params.id);
    if (!attachment) return res.status(404).json({ errorCode: 'NOT_FOUND', message: 'File not found' });

    const filePath = path.join(__dirname, '../../uploads', attachment.filePath);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ errorCode: 'NOT_FOUND', message: 'File no longer exists on server' });
    }

    res.download(filePath, attachment.fileName);
  } catch (error) {
    res.status(500).json({ errorCode: 'SERVER_ERROR', message: error.message });
  }
};

// DELETE /api/attachments/:id
const deleteAttachment = async (req, res) => {
  try {
    const attachment = await Attachment.findByPk(req.params.id);
    if (!attachment) return res.status(404).json({ errorCode: 'NOT_FOUND', message: 'File not found' });

    // Only uploader, PM, or Admin can delete
    const canDelete = attachment.uploadedBy === req.user.id ||
      ['Admin', 'Project Manager'].includes(req.user.role);
    if (!canDelete) {
      return res.status(403).json({ errorCode: 'FORBIDDEN', message: 'Access denied' });
    }

    const filePath = path.join(__dirname, '../../uploads', attachment.filePath);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await attachment.destroy();
    res.json({ message: 'Attachment deleted' });
  } catch (error) {
    res.status(500).json({ errorCode: 'SERVER_ERROR', message: error.message });
  }
};

module.exports = { uploadAttachment, getAttachments, downloadAttachment, deleteAttachment };
