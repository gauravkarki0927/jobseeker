# JobSeeker - Full-Stack Job Portal Application

A comprehensive job portal web application built with React.js, Node.js, Express.js, MySQL, and JWT authentication. This platform connects job seekers with employers and provides administrative tools for job and user management.

## 🚀 Features

### For Job Seekers
- **User Registration & Authentication**: Secure JWT-based authentication system
- **Advanced Job Search**: Filter by job type, location, salary, employment type, seniority level, and remote/on-site options
- **Job Applications**: Apply for jobs and track application status
- **User Dashboard**: View application history and status
- **Profile Management**: Update personal and professional information

### For Employers/Admins
- **Admin Dashboard**: Analytics and overview of platform activity
- **Job Management**: Create, update, and delete job postings
- **User Management**: Manage user accounts and roles
- **Application Management**: Review and update application statuses
- **Analytics**: Charts and graphs showing platform metrics

### Technical Features
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time Updates**: Dynamic content updates without page refresh
- **Advanced Filtering**: Multiple filter options for job search
- **Data Visualization**: Interactive charts for admin analytics
- **Secure API**: Protected routes with JWT authentication
- **Input Validation**: Client and server-side validation using Joi
- **Error Handling**: Comprehensive error handling and user feedback

## 🛠 Technology Stack

### Frontend
- **React.js** - Modern JavaScript library for building user interfaces
- **TypeScript** - Type-safe JavaScript development
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Lucide React** - Beautiful and customizable icons
- **React Router DOM** - Client-side routing
- **Recharts** - Composable charting library for analytics
- **Vite** - Fast build tool and development server

### Backend
- **Node.js** - JavaScript runtime for server-side development
- **Express.js** - Web framework for Node.js
- **MySQL** - Relational database for data storage
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing library
- **Joi** - Data validation library
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Express Rate Limit** - Request rate limiting

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v5.7 or higher)
- npm or yarn package manager

### Frontend Setup
1. Clone the repository and navigate to the project root:
```bash
git clone <repository-url>
cd jobseeker-app
```

2. Install frontend dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup
1. Navigate to the backend directory:
```bash
cd backend
```

2. Install backend dependencies:
```bash
npm install
```

3. Create a MySQL database:
```sql
CREATE DATABASE jobseeker_db;
```

4. Configure environment variables:
```bash
cp .env.example .env
```

Edit the `.env` file with your database credentials:
```env
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=jobseeker_db
DB_PORT=3306

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

5. Start the backend server:
```bash
npm run dev
```

The backend API will be available at `http://localhost:5000`

### Database Initialization
The database tables and sample data will be automatically created when you first start the backend server. The system includes:

- **Default Admin Account**: 
  - Email: `admin@jobseeker.com`
  - Password: `admin123`

- **Default Test User**:
  - Email: `user@jobseeker.com`  
  - Password: `user123`

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
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
);
```

### Jobs Table
```sql
CREATE TABLE jobs (
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
);
```

### Job Applications Table
```sql
CREATE TABLE job_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  jobId INT NOT NULL,
  userId INT NOT NULL,
  status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
  appliedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (jobId) REFERENCES jobs(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_application (jobId, userId)
);
```

## 🔗 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `GET /me` - Get current user profile
- `PUT /profile` - Update user profile

### Job Routes (`/api/jobs`)
- `GET /` - Get all jobs with filtering and pagination
- `GET /:id` - Get single job by ID
- `POST /:id/apply` - Apply for a job (authenticated)
- `GET /applications/my` - Get user's applications (authenticated)

### Admin Routes (`/api/admin`)
- `GET /stats` - Get dashboard statistics
- `GET /jobs` - Get all jobs for admin management
- `POST /jobs` - Create new job
- `PUT /jobs/:id` - Update job
- `DELETE /jobs/:id` - Delete job
- `GET /users` - Get all users
- `PUT /users/:id/role` - Update user role
- `DELETE /users/:id` - Delete user
- `GET /applications` - Get all applications
- `PUT /applications/:id/status` - Update application status

## 🎨 UI/UX Features

### Design System
- **Color Palette**: Professional blue (#2563eb) primary, green (#10b981) success, red (#ef4444) error
- **Typography**: Modern, readable fonts with proper hierarchy
- **Spacing**: Consistent 8px spacing system
- **Components**: Reusable, accessible components

### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: Tailored layouts for different screen sizes
- **Touch Friendly**: Large touch targets for mobile interaction

### Interactive Elements
- **Smooth Animations**: CSS transitions and hover effects
- **Loading States**: Spinner animations for async operations
- **Form Validation**: Real-time validation feedback
- **Toast Notifications**: User feedback for actions

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Input Validation**: Server and client-side validation
- **Rate Limiting**: Request rate limiting to prevent abuse
- **CORS Configuration**: Proper cross-origin resource sharing
- **Helmet Middleware**: Security headers and protection
- **SQL Injection Protection**: Parameterized queries

## 📈 Performance Optimizations

- **Connection Pooling**: MySQL connection pooling for better performance
- **Pagination**: Efficient data loading with pagination
- **Image Optimization**: Optimized image loading from external sources
- **Code Splitting**: Efficient bundle loading with Vite
- **Caching**: Browser caching for static assets

## 🧪 Testing

The application includes comprehensive error handling and validation. To test the application:

1. **Authentication**: Test login/registration with valid and invalid data
2. **Job Search**: Test filtering and search functionality
3. **Applications**: Test job application workflow
4. **Admin Features**: Test job and user management (admin account required)
5. **Responsive Design**: Test on different screen sizes

## 🚀 Deployment

### Frontend Deployment
The frontend can be deployed to platforms like Netlify, Vercel, or any static hosting service:

```bash
npm run build
```

### Backend Deployment
The backend can be deployed to platforms like Heroku, DigitalOcean, or AWS:

1. Set up environment variables on your hosting platform
2. Configure database connection for production
3. Update CORS settings for production frontend URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support, please contact the development team or create an issue in the repository.

## 🔄 Future Enhancements

- **Email Notifications**: Notify users of application status changes
- **Advanced Filtering**: More sophisticated search and filtering options
- **File Upload**: Resume upload functionality
- **Real-time Chat**: Communication between employers and candidates
- **Advanced Analytics**: More detailed analytics and reporting
- **Social Login**: OAuth integration with Google, LinkedIn, etc.
- **Mobile App**: React Native mobile application
- **API Documentation**: Comprehensive API documentation with Swagger
