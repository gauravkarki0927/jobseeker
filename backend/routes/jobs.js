const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const multer = require("multer");
const path = require("path");

const router = express.Router();
router.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Get all jobs with filters
router.get('/', async (req, res) => {
  try {
    const { jobType, employmentType, seniorityLevel, location, isRemote, minSalary, maxSalary, search, page = 1, limit = 20 } = req.query;

    let query = 'SELECT * FROM jobs WHERE isActive = true';
    const params = [];

    if (jobType) { query += ' AND jobType = ?'; params.push(jobType); }
    if (employmentType) { query += ' AND employmentType = ?'; params.push(employmentType); }
    if (seniorityLevel) { query += ' AND seniorityLevel = ?'; params.push(seniorityLevel); }
    if (location) { query += ' AND location LIKE ?'; params.push(`%${location}%`); }
    if (isRemote !== undefined) { query += ' AND isRemote = ?'; params.push(isRemote === 'true'); }
    if (minSalary) { query += ' AND salary >= ?'; params.push(parseInt(minSalary)); }
    if (maxSalary) { query += ' AND salary <= ?'; params.push(parseInt(maxSalary)); }
    if (search) { query += ' AND (title LIKE ? OR company LIKE ? OR description LIKE ?)'; params.push(`%${search}%`, `%${search}%`, `%${search}%`); }

    query += ' ORDER BY postedDate DESC LIMIT ? OFFSET ?';
    const offset = (page - 1) * limit;
    params.push(parseInt(limit), offset);

    const [jobs] = await db.execute(query, params);

    // Total count
    let countQuery = 'SELECT COUNT(*) as total FROM jobs WHERE isActive = true';
    const countParams = params.slice(0, -2);
    if (jobType) countQuery += ' AND jobType = ?';
    if (employmentType) countQuery += ' AND employmentType = ?';
    if (seniorityLevel) countQuery += ' AND seniorityLevel = ?';
    if (location) countQuery += ' AND location LIKE ?';
    if (isRemote !== undefined) countQuery += ' AND isRemote = ?';
    if (minSalary) countQuery += ' AND salary >= ?';
    if (maxSalary) countQuery += ' AND salary <= ?';
    if (search) countQuery += ' AND (title LIKE ? OR company LIKE ? OR description LIKE ?)';

    const [countResult] = await db.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({ jobs, pagination: { current: parseInt(page), total: Math.ceil(total / limit), totalJobs: total } });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ message: 'Server error fetching jobs' });
  }
});

// Get user's applications
router.get('/applications/my', authenticateToken, async (req, res) => {
  try {
    const [applications] = await db.execute(`
      SELECT ja.*, j.title as jobTitle, j.company, j.location, j.salary, j.imageUrl as companyLogo
      FROM job_applications ja
      JOIN jobs j ON ja.jobId = j.id
      WHERE ja.userId = ?
      ORDER BY ja.appliedDate DESC
    `, [req.user.id]);

    res.json(applications);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single job
router.get('/:id', async (req, res) => {
  try {
    const [jobs] = await db.execute('SELECT * FROM jobs WHERE id = ? AND isActive = true', [req.params.id]);
    if (jobs.length === 0) return res.status(404).json({ message: 'Job not found' });
    res.json(jobs[0]);
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files allowed"), false);
    }
  },
});

// Cancel (withdraw) an application
router.delete('/applications/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Only allow cancel if status is pending and belongs to logged-in user
    const [result] = await db.execute(
      `DELETE FROM job_applications 
       WHERE id = ? AND userId = ? AND status = 'pending'`,
      [id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: 'Application not found or cannot be cancelled' });
    }

    res.json({ message: 'Application cancelled successfully' });
  } catch (error) {
    console.error('Cancel application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Apply for job
router.post("/:id/apply", authenticateToken, upload.single("cv"), async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.id;
    const { name, email } = req.body;
    const cvFile = req.file ? req.file.filename : null;

    // Validate required fields
    if (!name || !email || !cvFile) {
      return res.status(400).json({ message: "Name, email, and CV are required" });
    }

    // Check if job exists and active
    const [jobs] = await db.execute(
      "SELECT id FROM jobs WHERE id = ? AND isActive = true",
      [jobId]
    );
    if (jobs.length === 0) return res.status(404).json({ message: "Job not found" });

    // Check if user already applied
    const [existing] = await db.execute(
      "SELECT id FROM job_applications WHERE jobId = ? AND userId = ?",
      [jobId, userId]
    );
    if (existing.length > 0) return res.status(400).json({ message: "Already applied" });

    // Insert into DB
    const [result] = await db.execute(
      `INSERT INTO job_applications (jobId, userId, name, email, cv, status, appliedDate) 
       VALUES (?, ?, ?, ?, ?, 'pending', NOW())`,
      [jobId, userId, name, email, cvFile]
    );

    res.status(201).json({
      message: "Application submitted",
      applicationId: result.insertId,
    });
  } catch (error) {
    console.error("Apply job error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
