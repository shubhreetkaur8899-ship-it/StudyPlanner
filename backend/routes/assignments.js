const express = require('express');
const { query } = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// @route   GET /api/courses/:id/assignments
// @desc    Get all assignments for a specific course
// @access  Private
router.get('/courses/:id/assignments', async (req, res) => {
  try {
    const { id } = req.params;

    // Verify course belongs to user
    const courseCheck = await query(
      'SELECT * FROM courses WHERE course_id = $1 AND user_id = $2',
      [id, req.user.userId]
    );

    if (courseCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const result = await query(
      `SELECT a.*, c.course_name, c.course_code 
       FROM assignments a 
       JOIN courses c ON a.course_id = c.course_id 
       WHERE a.course_id = $1 
       ORDER BY a.due_date ASC`,
      [id]
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });

  } catch (error) {
    console.error('Get course assignments error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving assignments'
    });
  }
});

// @route   GET /api/assignments
// @desc    Get all assignments for logged-in user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const result = await query(
      `SELECT a.*, c.course_name, c.course_code 
       FROM assignments a 
       JOIN courses c ON a.course_id = c.course_id 
       WHERE c.user_id = $1 
       ORDER BY a.due_date ASC`,
      [req.user.userId]
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });

  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving assignments'
    });
  }
});

// @route   GET /api/assignments/:id
// @desc    Get a single assignment by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT a.*, c.course_name, c.course_code, c.user_id 
       FROM assignments a 
       JOIN courses c ON a.course_id = c.course_id 
       WHERE a.assignment_id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    // Check if assignment belongs to user
    if (result.rows[0].user_id !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this assignment'
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Get assignment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving assignment'
    });
  }
});

// @route   POST /api/assignments
// @desc    Create a new assignment
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { course_id, title, description, due_date, status } = req.body;

    // Validation
    if (!course_id || !title || !due_date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide course_id, title, and due_date'
      });
    }

    // Verify course belongs to user
    const courseCheck = await query(
      'SELECT * FROM courses WHERE course_id = $1 AND user_id = $2',
      [course_id, req.user.userId]
    );

    if (courseCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Validate status if provided
    const assignmentStatus = status || 'Pending';
    if (!['Pending', 'Completed'].includes(assignmentStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either Pending or Completed'
      });
    }

    const result = await query(
      'INSERT INTO assignments (course_id, title, description, due_date, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [course_id, title, description || null, due_date, assignmentStatus]
    );

    res.status(201).json({
      success: true,
      message: 'Assignment created successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Create assignment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating assignment'
    });
  }
});

// @route   PUT /api/assignments/:id
// @desc    Update an assignment
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, due_date, status } = req.body;

    // Verify assignment exists and belongs to user
    const assignmentCheck = await query(
      `SELECT a.*, c.user_id 
       FROM assignments a 
       JOIN courses c ON a.course_id = c.course_id 
       WHERE a.assignment_id = $1`,
      [id]
    );

    if (assignmentCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    if (assignmentCheck.rows[0].user_id !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this assignment'
      });
    }

    // Validate status if provided
    if (status && !['Pending', 'Completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either Pending or Completed'
      });
    }

    // Build update query dynamically
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (title) {
      updates.push(`title = $${paramCount}`);
      values.push(title);
      paramCount++;
    }

    if (description !== undefined) {
      updates.push(`description = $${paramCount}`);
      values.push(description);
      paramCount++;
    }

    if (due_date) {
      updates.push(`due_date = $${paramCount}`);
      values.push(due_date);
      paramCount++;
    }

    if (status) {
      updates.push(`status = $${paramCount}`);
      values.push(status);
      paramCount++;
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    values.push(id);

    const result = await query(
      `UPDATE assignments SET ${updates.join(', ')} WHERE assignment_id = $${paramCount} RETURNING *`,
      values
    );

    res.status(200).json({
      success: true,
      message: 'Assignment updated successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Update assignment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating assignment'
    });
  }
});

// @route   DELETE /api/assignments/:id
// @desc    Delete an assignment
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Verify assignment exists and belongs to user
    const assignmentCheck = await query(
      `SELECT a.*, c.user_id 
       FROM assignments a 
       JOIN courses c ON a.course_id = c.course_id 
       WHERE a.assignment_id = $1`,
      [id]
    );

    if (assignmentCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    if (assignmentCheck.rows[0].user_id !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this assignment'
      });
    }

    const result = await query(
      'DELETE FROM assignments WHERE assignment_id = $1 RETURNING *',
      [id]
    );

    res.status(200).json({
      success: true,
      message: 'Assignment deleted successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Delete assignment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting assignment'
    });
  }
});

module.exports = router;
