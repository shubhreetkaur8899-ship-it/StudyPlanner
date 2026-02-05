const express = require('express');
const { query } = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// @route   GET /api/courses
// @desc    Get all courses for logged-in user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM courses WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.userId]
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });

  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving courses'
    });
  }
});

// @route   GET /api/courses/:id
// @desc    Get a single course by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'SELECT * FROM courses WHERE course_id = $1 AND user_id = $2',
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving course'
    });
  }
});

// @route   POST /api/courses
// @desc    Create a new course
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { course_name, course_code, semester } = req.body;

    // Validation
    if (!course_name || !course_code) {
      return res.status(400).json({
        success: false,
        message: 'Please provide course_name and course_code'
      });
    }

    const result = await query(
      'INSERT INTO courses (user_id, course_name, course_code, semester) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.userId, course_name, course_code, semester || null]
    );

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating course'
    });
  }
});

// @route   PUT /api/courses/:id
// @desc    Update a course
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { course_name, course_code, semester } = req.body;

    // Check if course exists and belongs to user
    const existingCourse = await query(
      'SELECT * FROM courses WHERE course_id = $1 AND user_id = $2',
      [id, req.user.userId]
    );

    if (existingCourse.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Build update query dynamically
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (course_name) {
      updates.push(`course_name = $${paramCount}`);
      values.push(course_name);
      paramCount++;
    }

    if (course_code) {
      updates.push(`course_code = $${paramCount}`);
      values.push(course_code);
      paramCount++;
    }

    if (semester !== undefined) {
      updates.push(`semester = $${paramCount}`);
      values.push(semester);
      paramCount++;
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    values.push(id, req.user.userId);

    const result = await query(
      `UPDATE courses SET ${updates.join(', ')} WHERE course_id = $${paramCount} AND user_id = $${paramCount + 1} RETURNING *`,
      values
    );

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating course'
    });
  }
});

// @route   DELETE /api/courses/:id
// @desc    Delete a course
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM courses WHERE course_id = $1 AND user_id = $2 RETURNING *',
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting course'
    });
  }
});

module.exports = router;
