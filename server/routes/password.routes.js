const express = require('express');
const router = express.Router();
const passport = require('passport');
const { Password } = require('../models');

// Middleware to authenticate JWT token
const authenticate = passport.authenticate('jwt', { session: false });

// Get all passwords for the authenticated user
router.get('/', authenticate, async (req, res) => {
  try {
    const passwords = await Password.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: passwords.length,
      data: passwords
    });
  } catch (error) {
    console.error('Error fetching passwords:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching passwords',
      error: error.message
    });
  }
});

// Get a single password by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const password = await Password.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!password) {
      return res.status(404).json({
        success: false,
        message: 'Password not found'
      });
    }

    res.status(200).json({
      success: true,
      data: password
    });
  } catch (error) {
    console.error('Error fetching password:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching password',
      error: error.message
    });
  }
});

// Create a new password
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, username, password, notes } = req.body;

    // Validate required fields
    if (!title || !username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, username, and password'
      });
    }

    // Create password entry
    const newPassword = await Password.create({
      userId: req.user.id,
      title,
      username,
      password,
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Password created successfully',
      data: newPassword
    });
  } catch (error) {
    console.error('Error creating password:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating password',
      error: error.message
    });
  }
});

// Update a password
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { title, username, password, notes } = req.body;

    // Find password by ID and user ID
    let passwordEntry = await Password.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!passwordEntry) {
      return res.status(404).json({
        success: false,
        message: 'Password not found'
      });
    }

    // Update password entry
    await passwordEntry.update({
      title: title || passwordEntry.title,
      username: username || passwordEntry.username,
      password: password || passwordEntry.password,
      notes: notes !== undefined ? notes : passwordEntry.notes
    });

    // Fetch updated entry
    passwordEntry = await Password.findByPk(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
      data: passwordEntry
    });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating password',
      error: error.message
    });
  }
});

// Delete a password
router.delete('/:id', authenticate, async (req, res) => {
  try {
    // Find password by ID and user ID
    const passwordEntry = await Password.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!passwordEntry) {
      return res.status(404).json({
        success: false,
        message: 'Password not found'
      });
    }

    // Delete password entry
    await passwordEntry.destroy();

    res.status(200).json({
      success: true,
      message: 'Password deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting password:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting password',
      error: error.message
    });
  }
});

module.exports = router;