const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Attachment = sequelize.define('Attachment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fileName: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  filePath: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  fileType: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  fileSize: {
    type: DataTypes.INTEGER, // bytes
    allowNull: true,
  },
  taskId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'tasks', key: 'id' },
  },
  uploadedBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
}, {
  tableName: 'attachments',
  timestamps: true,
});

module.exports = Attachment;
