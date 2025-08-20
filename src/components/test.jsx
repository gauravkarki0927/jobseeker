import express from "express";
import multer from "multer";
import path from "path";
import db from "../db.js"; 
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Configure multer for CV uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/cv/"); // save CVs here
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

// Apply job route
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

export default router;
