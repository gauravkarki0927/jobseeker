const express = require('express');
const Joi = require('joi');
const db = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();
router.use(authenticateToken);
router.use(requireAdmin);

// Job schema
const jobSchema = Joi.object({
  title: Joi.string().min(2).max(200).required(),
  company: Joi.string().min(2).max(100).required(),
  jobType: Joi.string().valid('Developer','Designer','Marketing','Engineer','Architect','Manager').required(),
  employmentType: Joi.string().valid('Full-time','Part-time','Contract','Freelance').required(),
  seniorityLevel: Joi.string().valid('Intern','Junior','Mid-Level','Senior').required(),
  location: Joi.string().min(2).max(100).required(),
  isRemote: Joi.boolean().default(false),
  salary: Joi.number().positive().required(),
  description: Joi.string().min(10).required(),
  imageUrl: Joi.string().uri().optional().allow('')
});

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    // Get total jobs
    const [totalJobs] = await db.execute('SELECT COUNT(*) as count FROM jobs');
    
    // Get total users
    const [totalUsers] = await db.execute('SELECT COUNT(*) as count FROM users WHERE role = "user"');
    
    // Get total applications
    const [totalApplications] = await db.execute('SELECT COUNT(*) as count FROM job_applications');
    
    // Get recent jobs (last 30 days)
    const [recentJobs] = await db.execute(
      'SELECT COUNT(*) as count FROM jobs WHERE postedDate >= DATE_SUB(NOW(), INTERVAL 30 DAY)'
    );

    // Get applications by status
    const [applicationsByStatus] = await db.execute(`
      SELECT status, COUNT(*) as count 
      FROM job_applications 
      GROUP BY status
    `);

    res.json({
      totalJobs: totalJobs[0].count,
      totalUsers: totalUsers[0].count,
      totalApplications: totalApplications[0].count,
      recentJobs: recentJobs[0].count,
      applicationsByStatus
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error fetching statistics' });
  }
});

// Get all jobs (for admin management)
router.get('/jobs', async (req, res) => {
  try {
    const [jobs] = await db.execute(`
      SELECT j.*, u.firstName, u.lastName 
      FROM jobs j
      LEFT JOIN users u ON j.createdBy = u.id
      ORDER BY j.postedDate DESC
    `);

    res.json(jobs);
  } catch (error) {
    console.error('Get admin jobs error:', error);
    res.status(500).json({ message: 'Server error fetching jobs' });
  }
});

// Create new job
router.post('/jobs', async (req, res) => {
  try {
    // Validate request body
    const { error } = jobSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const {
      title,
      company,
      jobType,
      employmentType,
      seniorityLevel,
      location,
      isRemote,
      salary,
      description,
      imageUrl
    } = req.body;

    const [result] = await db.execute(`
      INSERT INTO jobs (
        title, company, jobType, employmentType, seniorityLevel,
        location, isRemote, salary, description, imageUrl, createdBy
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      title, company, jobType, employmentType, seniorityLevel,
      location, isRemote, salary, description, imageUrl, req.user.id
    ]);

    // Get created job
    const [newJob] = await db.execute('SELECT * FROM jobs WHERE id = ?', [result.insertId]);

    res.status(201).json({
      message: 'Job created successfully',
      job: newJob[0]
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ message: 'Server error creating job' });
  }
});

// Update job
router.put('/jobs/:id', async (req, res) => {
  try {
    const jobId = req.params.id;

    // Validate request body
    const { error } = jobSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const {
      title,
      company,
      jobType,
      employmentType,
      seniorityLevel,
      location,
      isRemote,
      salary,
      description,
      imageUrl
    } = req.body;

    // Check if job exists
    const [existingJobs] = await db.execute('SELECT id FROM jobs WHERE id = ?', [jobId]);
    if (existingJobs.length === 0) {
      return res.status(404).json({ message: 'Job not found' });
    }

    await db.execute(`
      UPDATE jobs SET
        title = ?, company = ?, jobType = ?, employmentType = ?,
        seniorityLevel = ?, location = ?, isRemote = ?, salary = ?,
        description = ?, imageUrl = ?
      WHERE id = ?
    `, [
      title, company, jobType, employmentType, seniorityLevel,
      location, isRemote, salary, description, imageUrl, jobId
    ]);

    // Get updated job
    const [updatedJob] = await db.execute('SELECT * FROM jobs WHERE id = ?', [jobId]);

    res.json({
      message: 'Job updated successfully',
      job: updatedJob[0]
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ message: 'Server error updating job' });
  }
});

// Delete job
router.delete('/jobs/:id', async (req, res) => {
  try {
    const jobId = req.params.id;

    // Check if job exists
    const [existingJobs] = await db.execute('SELECT id FROM jobs WHERE id = ?', [jobId]);
    if (existingJobs.length === 0) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Soft delete (mark as inactive) instead of hard delete to preserve data integrity
    await db.execute('UPDATE jobs SET isActive = false WHERE id = ?', [jobId]);

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ message: 'Server error deleting job' });
  }
});

// Get all users (for admin management)
router.get('/users', async (req, res) => {
  try {
    const [users] = await db.execute(`
      SELECT id, firstName, lastName, email, role, createdAt,
             (SELECT COUNT(*) FROM job_applications WHERE userId = users.id) as applicationCount
      FROM users
      ORDER BY createdAt DESC
    `);

    res.json(users);
  } catch (error) {
    console.error('Get admin users error:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

// Update user role
router.put('/users/:id/role', async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Check if user exists
    const [existingUsers] = await db.execute('SELECT id FROM users WHERE id = ?', [userId]);
    if (existingUsers.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    await db.execute('UPDATE users SET role = ? WHERE id = ?', [role, userId]);

    res.json({ message: 'User role updated successfully' });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Server error updating user role' });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // Prevent admin from deleting themselves
    if (parseInt(userId) === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    // Check if user exists
    const [existingUsers] = await db.execute('SELECT id FROM users WHERE id = ?', [userId]);
    if (existingUsers.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete user (cascade will handle related records)
    await db.execute('DELETE FROM users WHERE id = ?', [userId]);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error deleting user' });
  }
});

// Get all job applications (for admin management)
router.get('/applications', async (req, res) => {
  try {
    const [applications] = await db.execute(`
      SELECT 
        ja.*,
        u.firstName, u.lastName, u.email,
        j.title as jobTitle, j.company
      FROM job_applications ja
      JOIN users u ON ja.userId = u.id
      JOIN jobs j ON ja.jobId = j.id
      ORDER BY ja.appliedDate DESC
    `);

    res.json(applications);
  } catch (error) {
    console.error('Get admin applications error:', error);
    res.status(500).json({ message: 'Server error fetching applications' });
  }
});

// Update application status
router.put('/applications/:id/status', async (req, res) => {
  try {
    const applicationId = req.params.id;
    const { status } = req.body;

    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Check if application exists
    const [existingApplications] = await db.execute(
      'SELECT id FROM job_applications WHERE id = ?',
      [applicationId]
    );

    if (existingApplications.length === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }

    await db.execute(
      'UPDATE job_applications SET status = ? WHERE id = ?',
      [status, applicationId]
    );

    res.json({ message: 'Application status updated successfully' });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ message: 'Server error updating application status' });
  }
});

module.exports = router;