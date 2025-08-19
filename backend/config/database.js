const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'jobseeker_db',
  port: process.env.DB_PORT || 3306
});

const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

const initializeDatabase = async () => {
  try {
    const connection = await pool.getConnection();

    // Users table with firstName & lastName
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        firstName VARCHAR(50) NOT NULL,
        lastName VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') DEFAULT 'user',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Jobs table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS jobs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        company VARCHAR(100) NOT NULL,
        jobType VARCHAR(50) NOT NULL,
        employmentType VARCHAR(50) NOT NULL,
        seniorityLevel VARCHAR(50) NOT NULL,
        location VARCHAR(100) NOT NULL,
        isRemote BOOLEAN DEFAULT FALSE,
        salary INT NOT NULL,
        description TEXT NOT NULL,
        imageUrl TEXT,
        postedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        isActive BOOLEAN DEFAULT TRUE,
        createdBy INT,
        FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Job applications table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS job_applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        jobId INT NOT NULL,
        userId INT NOT NULL,
        status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
        appliedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (jobId) REFERENCES jobs(id) ON DELETE CASCADE,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_application (jobId, userId)
      )
    `);

    // Default admin user
    const [adminExists] = await connection.execute(
      'SELECT id FROM users WHERE email = ? AND role = ?',
      ['admin@jobseeker.com', 'admin']
    );
    if (adminExists.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await connection.execute(
        `INSERT INTO users (firstName, lastName, email, password, role) VALUES (?, ?, ?, ?, ?)`,
        ['Admin', 'User', 'admin@jobseeker.com', hashedPassword, 'admin']
      );
      console.log('✅ Default admin user created (admin@jobseeker.com / admin123)');
    }

    connection.release();
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  }
};

testConnection().then(() => initializeDatabase());

module.exports = pool;
