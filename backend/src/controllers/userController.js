const { User } = require('../models');
const { sendWelcomeEmail } = require('../utils/email');
const { Op } = require('sequelize');
const crypto = require('crypto');

// GET /api/users
const getUsers = async (req, res) => {
  try {
    const { search, role, page = 1, limit = 10 } = req.query;
    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }
    if (role) where.role = role;

    const offset = (page - 1) * limit;
    const { count, rows } = await User.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
    });

    res.json({
      users: rows,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    res.status(500).json({ errorCode: 'SERVER_ERROR', message: error.message });
  }
};

// GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ errorCode: 'NOT_FOUND', message: 'User not found' });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ errorCode: 'SERVER_ERROR', message: error.message });
  }
};

// POST /api/users
const createUser = async (req, res) => {
  try {
    const { name, email, role, password } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ errorCode: 'EMAIL_EXISTS', message: 'Email already in use' });
    }

    // Use provided password or generate a random fallback
    const finalPassword = password || crypto.randomBytes(8).toString('hex');

    const user = await User.create({
      name, email, role,
      password: finalPassword,
      mustResetPassword: false, // If specified/generated, let them log in directly
    });

    // Send welcome email (non-blocking)
    sendWelcomeEmail(email, name, finalPassword).catch(console.error);

    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(500).json({ errorCode: 'SERVER_ERROR', message: error.message });
  }
};

// PUT /api/users/:id
const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ errorCode: 'NOT_FOUND', message: 'User not found' });

    const { name, role, isActive } = req.body;
    if (name !== undefined) user.name = name;
    if (role !== undefined) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();
    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ errorCode: 'SERVER_ERROR', message: error.message });
  }
};

// DELETE /api/users/:id (deactivate)
const deactivateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ errorCode: 'NOT_FOUND', message: 'User not found' });

    user.isActive = false;
    await user.save();
    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    res.status(500).json({ errorCode: 'SERVER_ERROR', message: error.message });
  }
};

module.exports = { getUsers, getUserById, createUser, updateUser, deactivateUser };
