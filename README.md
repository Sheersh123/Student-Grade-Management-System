# Student Grade Management System

A beginner-friendly web application built with **JavaScript**, **Node.js**, **Express.js**, and **MySQL** for managing student records and their grades.

## 🎯 Project Overview

This project is designed to help beginners learn full-stack web development by building a practical application that demonstrates:

- Frontend development with HTML, CSS, and JavaScript
- Backend API development with Node.js and Express.js
- Database design and operations with MySQL
- CRUD (Create, Read, Update, Delete) operations
- RESTful API design
- Responsive web design

## ✨ Features

### Student Management
- ➕ Add new students with personal information
- 👀 View all students in a searchable table
- ✏️ Edit student information
- 🗑️ Delete student records
- 🔍 Search students by name or email

### Grade Management
- 📝 Add grades for existing students
- 📊 View all grades with filtering options
- ✏️ Edit existing grades
- 🗑️ Delete grade records
- 🎯 Automatic grade calculation (percentage and letter grades)

### Analytics & Reporting
- 📈 View student averages and statistics
- 📋 Filter grades by student or subject
- 🏆 Display top-performing students
- 📊 Grade distribution analysis

### User Interface
- 📱 Responsive design for mobile and desktop
- 🎨 Modern, clean interface with smooth animations
- 🔔 Real-time notifications for user actions
- 📑 Tabbed navigation for easy access to features

## 🛠️ Technologies Used

### Frontend
- **HTML5** - Structure and markup
- **CSS3** - Styling with modern features (Grid, Flexbox, Gradients)
- **JavaScript (ES6+)** - Interactive functionality and API communication

### Backend
- **Node.js** - JavaScript runtime for server-side development
- **Express.js** - Web framework for building REST APIs
- **mysql2** - MySQL client for Node.js with Promise support

### Database
- **MySQL** - Relational database for data storage
- **Database Design** - Normalized tables with foreign key relationships

## 📋 Prerequisites

Before running this project, make sure you have:

1. **Node.js** (version 14 or higher) - [Download here](https://nodejs.org/)
2. **MySQL** (version 5.7 or higher) - [Download here](https://www.mysql.com/downloads/)
3. **Git** (optional) - [Download here](https://git-scm.com/)

## 🚀 Installation & Setup

### Step 1: Clone or Download the Project
```bash
# If using Git
git clone <repository-url>
cd student-grade-management-system

# Or download and extract the ZIP file
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Set Up MySQL Database

1. **Start MySQL service** on your computer
2. **Create the database** using one of these methods:

   **Option A: Using MySQL Command Line**
   ```bash
   mysql -u root -p
   ```
   Then run the setup.sql file:
   ```sql
   source setup.sql
   ```

   **Option B: Using phpMyAdmin or MySQL Workbench**
   - Import the `setup.sql` file through the interface

### Step 4: Configure Database Connection

Edit `server.js` and update the database configuration:

```javascript
const dbConfig = {
    host: 'localhost',
    user: 'your_mysql_username',    // Change this (default: 'root')
    password: 'your_mysql_password', // Change this
    database: 'student_management',
    // ... other settings
};
```

### Step 5: Start the Server
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

### Step 6: Access the Application

Open your browser and go to:
- **Application**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api

## 📁 Project Structure

```
student-grade-management-system/
├── server.js              # Main server file with Express.js setup
├── package.json           # Node.js dependencies and scripts
├── setup.sql             # Database schema and sample data
├── README.md             # This file
├── frontend/             # Frontend files (served by Express)
│   ├── index.html        # Main HTML file
│   ├── style.css         # CSS styles
│   └── script.js         # Frontend JavaScript
└── docs/                 # Additional documentation
    └── API.md            # API endpoint documentation
```

## 🔌 API Endpoints

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Add new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Grades
- `GET /api/grades` - Get all grades
- `GET /api/students/:id/grades` - Get grades for specific student
- `POST /api/grades` - Add new grade
- `PUT /api/grades/:id` - Update grade
- `DELETE /api/grades/:id` - Delete grade

### Analytics
- `GET /api/analytics` - Get system statistics and analytics

## 📚 Learning Objectives

By working on this project, you will learn:

### Frontend Development
- HTML form handling and validation
- CSS Grid and Flexbox layouts
- Responsive design principles
- JavaScript DOM manipulation
- Async/await and Fetch API
- Event handling and user interactions

### Backend Development
- Setting up Express.js server
- Creating RESTful API endpoints
- Request and response handling
- Middleware usage (CORS, body-parser)
- Error handling and validation

### Database Operations
- MySQL database design
- Creating tables with relationships
- CRUD operations with SQL
- Using prepared statements
- Database connection pooling

### Full-Stack Integration
- Connecting frontend to backend APIs
- JSON data exchange
- Error handling across layers
- User feedback and notifications

## 🎓 Beginner-Friendly Features

This project is specifically designed for beginners:

### Code Organization
- **Clear comments** explaining each section
- **Modular structure** for easy understanding
- **Consistent naming** conventions
- **Error handling** with helpful messages

### Learning Support
- **Step-by-step setup** instructions
- **Sample data** included for immediate testing
- **API documentation** with examples
- **Troubleshooting guide** for common issues

### Progressive Complexity
- **Basic CRUD operations** to start with
- **Advanced features** like search and filtering
- **Analytics and reporting** for enhanced learning
- **Responsive design** for modern web standards

## 🔧 Troubleshooting

### Common Issues and Solutions

**1. "ECONNREFUSED" Database Connection Error**
- Make sure MySQL is running
- Check database credentials in `server.js`
- Verify the database `student_management` exists

**2. "Cannot GET /" Error**
- Make sure you're accessing http://localhost:3000
- Check if the server started successfully
- Look for any error messages in the console

**3. "Students not loading" in Frontend**
- Check browser console for JavaScript errors
- Verify the API endpoints are working: http://localhost:3000/api/students
- Make sure CORS is properly configured

**4. "npm install" Fails**
- Make sure Node.js is properly installed
- Try clearing npm cache: `npm cache clean --force`
- Delete `node_modules` folder and run `npm install` again




