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
    
    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        firstName VARCHAR(50) NOT NULL,
        lastName VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') DEFAULT 'user',
        phone VARCHAR(20),
        location VARCHAR(100),
        bio TEXT,
        experience TEXT,
        skills TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create jobs table
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

    // Create job applications table
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

    // Create default admin user
    const [adminExists] = await connection.execute(
      'SELECT id FROM users WHERE email = ? AND role = ?',
      ['admin@jobseeker.com', 'admin']
    );

    if (adminExists.length === 0) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await connection.execute(`
        INSERT INTO users (firstName, lastName, email, password, role) 
        VALUES (?, ?, ?, ?, ?)
      `, ['Admin', 'User', 'admin@jobseeker.com', hashedPassword, 'admin']);
      
      console.log('✅ Default admin user created (admin@jobseeker.com / admin123)');
    }

    // Create default test user
    const [userExists] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      ['user@jobseeker.com']
    );

    if (userExists.length === 0) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('user123', 10);
      
      await connection.execute(`
        INSERT INTO users (firstName, lastName, email, password, role) 
        VALUES (?, ?, ?, ?, ?)
      `, ['Test', 'User', 'user@jobseeker.com', hashedPassword, 'user']);
      
      console.log('✅ Default test user created (user@jobseeker.com / user123)');
    }

    // Insert sample jobs
    const [jobsCount] = await connection.execute('SELECT COUNT(*) as count FROM jobs');
    if (jobsCount[0].count === 0) {
      const sampleJobs = [
        {
          title: 'Senior Frontend Developer',
          company: 'Tech Innovation Corp',
          jobType: 'Developer',
          employmentType: 'Full-time',
          seniorityLevel: 'Senior',
          location: 'San Francisco, CA',
          isRemote: true,
          salary: 120000,
          description: 'We are seeking a Senior Frontend Developer to join our dynamic team. You will be responsible for developing user-facing applications using React.js and modern JavaScript frameworks.',
          imageUrl: 'https://images.pexels.com/photos/3184639/pexels-photo-3184639.jpeg'
        },
        {
          title: 'UX/UI Designer',
          company: 'Creative Design Studio',
          jobType: 'Designer',
          employmentType: 'Full-time',
          seniorityLevel: 'Mid-Level',
          location: 'New York, NY',
          isRemote: false,
          salary: 85000,
          description: 'Join our creative team as a UX/UI Designer. You will design intuitive and engaging user interfaces for web and mobile applications.',
          imageUrl: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg'
        },
        {
          title: 'Full Stack Engineer',
          company: 'StartupXYZ',
          jobType: 'Developer',
          employmentType: 'Full-time',
          seniorityLevel: 'Mid-Level',
          location: 'Austin, TX',
          isRemote: true,
          salary: 95000,
          description: 'We are looking for a Full Stack Engineer to help build and maintain our web applications using Node.js, React, and PostgreSQL.',
          imageUrl: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg'
        },
        {
          title: 'Marketing Manager',
          company: 'Growth Marketing Inc',
          jobType: 'Marketing',
          employmentType: 'Full-time',
          seniorityLevel: 'Senior',
          location: 'Los Angeles, CA',
          isRemote: false,
          salary: 90000,
          description: 'Lead our marketing efforts and develop strategies to drive customer acquisition and retention. Experience with digital marketing required.',
          imageUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg'
        },
        {
          title: 'DevOps Engineer',
          company: 'Cloud Solutions Ltd',
          jobType: 'Engineer',
          employmentType: 'Full-time',
          seniorityLevel: 'Senior',
          location: 'Seattle, WA',
          isRemote: true,
          salary: 110000,
          description: 'Join our DevOps team to manage cloud infrastructure, CI/CD pipelines, and ensure scalable, reliable deployments.',
          imageUrl: 'https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg'
        },
        {
          title: 'Junior Frontend Developer',
          company: 'Web Dev Agency',
          jobType: 'Developer',
          employmentType: 'Full-time',
          seniorityLevel: 'Junior',
          location: 'Chicago, IL',
          isRemote: false,
          salary: 65000,
          description: 'Perfect opportunity for a Junior Frontend Developer to grow their skills. You will work on client projects using HTML, CSS, JavaScript, and React.',
          imageUrl: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg'
        }
      ];

      for (const job of sampleJobs) {
        await connection.execute(`
          INSERT INTO jobs (title, company, jobType, employmentType, seniorityLevel, location, isRemote, salary, description, imageUrl)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          job.title, job.company, job.jobType, job.employmentType,
          job.seniorityLevel, job.location, job.isRemote, job.salary,
          job.description, job.imageUrl
        ]);
      }

      console.log('✅ Sample jobs inserted successfully');
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
