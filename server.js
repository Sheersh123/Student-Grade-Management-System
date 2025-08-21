const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the frontend folder
app.use(express.static(path.join(__dirname, 'frontend')));

// MySQL Database Configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',  // Change this to your MySQL username
    password: '',  // Change this to your MySQL password
    database: 'student_management',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Create MySQL connection pool
let pool;

async function initializeDatabase() {
    try {
        // Create connection pool
        pool = mysql.createPool(dbConfig);

        // Test the connection
        const connection = await pool.getConnection();
        console.log('✅ Connected to MySQL database successfully!');

        // Create database if it doesn't exist
        await connection.execute('CREATE DATABASE IF NOT EXISTS student_management');
        await connection.execute('USE student_management');

        // Create students table
        const createStudentsTable = `
            CREATE TABLE IF NOT EXISTS students (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                phone VARCHAR(15),
                class VARCHAR(50) NOT NULL,
                enrollment_date DATE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `;

        await connection.execute(createStudentsTable);
        console.log('✅ Students table created/verified');

        // Create grades table
        const createGradesTable = `
            CREATE TABLE IF NOT EXISTS grades (
                id INT PRIMARY KEY AUTO_INCREMENT,
                student_id INT NOT NULL,
                subject VARCHAR(100) NOT NULL,
                marks DECIMAL(5,2) NOT NULL,
                max_marks DECIMAL(5,2) DEFAULT 100.00,
                grade_date DATE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
            )
        `;

        await connection.execute(createGradesTable);
        console.log('✅ Grades table created/verified');

        // Insert sample data if tables are empty
        await insertSampleData(connection);

        connection.release();
        console.log('🚀 Database initialized successfully!');

    } catch (error) {
        console.error('❌ Database initialization failed:', error.message);
        console.log('📝 Please make sure MySQL is running and credentials are correct');
        process.exit(1);
    }
}

async function insertSampleData(connection) {
    try {
        // Check if students table has data
        const [students] = await connection.execute('SELECT COUNT(*) as count FROM students');

        if (students[0].count === 0) {
            console.log('📊 Inserting sample students...');

            const sampleStudents = [
                ['John Doe', 'john.doe@email.com', '123-456-7890', 'Computer Science', '2024-01-15'],
                ['Jane Smith', 'jane.smith@email.com', '234-567-8901', 'Mathematics', '2024-01-16'],
                ['Mike Johnson', 'mike.johnson@email.com', '345-678-9012', 'Physics', '2024-01-17'],
                ['Sarah Wilson', 'sarah.wilson@email.com', '456-789-0123', 'Chemistry', '2024-01-18'],
                ['Alex Brown', 'alex.brown@email.com', '567-890-1234', 'Biology', '2024-01-19'],
                ['Emily Davis', 'emily.davis@email.com', '678-901-2345', 'English', '2024-01-20'],
                ['David Lee', 'david.lee@email.com', '789-012-3456', 'History', '2024-01-21'],
                ['Lisa Garcia', 'lisa.garcia@email.com', '890-123-4567', 'Art', '2024-01-22'],
                ['Tom Anderson', 'tom.anderson@email.com', '901-234-5678', 'Music', '2024-01-23'],
                ['Anna Martinez', 'anna.martinez@email.com', '012-345-6789', 'Psychology', '2024-01-24']
            ];

            for (const student of sampleStudents) {
                await connection.execute(
                    'INSERT INTO students (name, email, phone, class, enrollment_date) VALUES (?, ?, ?, ?, ?)',
                    student
                );
            }

            console.log('✅ Sample students inserted');

            // Insert sample grades
            console.log('📊 Inserting sample grades...');

            const sampleGrades = [
                [1, 'Mathematics', 85.5, 100, '2024-02-15'],
                [1, 'Science', 92.0, 100, '2024-02-16'],
                [2, 'Mathematics', 78.5, 100, '2024-02-15'],
                [2, 'English', 88.0, 100, '2024-02-17'],
                [3, 'Physics', 95.0, 100, '2024-02-18'],
                [3, 'Chemistry', 89.5, 100, '2024-02-19'],
                [4, 'Chemistry', 93.0, 100, '2024-02-20'],
                [4, 'Biology', 87.5, 100, '2024-02-21'],
                [5, 'Biology', 91.0, 100, '2024-02-22'],
                [5, 'Mathematics', 84.0, 100, '2024-02-23'],
                [6, 'English', 96.5, 100, '2024-02-24'],
                [6, 'Literature', 88.5, 100, '2024-02-25'],
                [7, 'History', 82.0, 100, '2024-02-26'],
                [7, 'Geography', 79.5, 100, '2024-02-27'],
                [8, 'Art', 94.5, 100, '2024-02-28'],
                [8, 'Design', 91.0, 100, '2024-03-01'],
                [9, 'Music Theory', 87.0, 100, '2024-03-02'],
                [9, 'Performance', 93.5, 100, '2024-03-03'],
                [10, 'Psychology', 90.0, 100, '2024-03-04'],
                [10, 'Statistics', 85.5, 100, '2024-03-05']
            ];

            for (const grade of sampleGrades) {
                await connection.execute(
                    'INSERT INTO grades (student_id, subject, marks, max_marks, grade_date) VALUES (?, ?, ?, ?, ?)',
                    grade
                );
            }

            console.log('✅ Sample grades inserted');
        }
    } catch (error) {
        console.error('❌ Error inserting sample data:', error.message);
    }
}

// Helper function to calculate letter grade
function calculateLetterGrade(percentage) {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
}

// API Routes

// Get all students
app.get('/api/students', async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT s.*, 
                   COUNT(g.id) as total_grades,
                   ROUND(AVG(g.marks * 100 / g.max_marks), 2) as average_percentage
            FROM students s
            LEFT JOIN grades g ON s.id = g.student_id
            GROUP BY s.id
            ORDER BY s.name
        `);

        res.json(rows);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: 'Failed to fetch students' });
    }
});

// Get student by ID
app.get('/api/students/:id', async (req, res) => {
    try {
        const studentId = req.params.id;
        const [rows] = await pool.execute('SELECT * FROM students WHERE id = ?', [studentId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({ error: 'Failed to fetch student' });
    }
});

// Add new student
app.post('/api/students', async (req, res) => {
    try {
        const { name, email, phone, class: studentClass, enrollment_date } = req.body;

        // Validation
        if (!name || !email || !studentClass) {
            return res.status(400).json({ error: 'Name, email, and class are required' });
        }

        const enrollmentDate = enrollment_date || new Date().toISOString().split('T')[0];

        const [result] = await pool.execute(
            'INSERT INTO students (name, email, phone, class, enrollment_date) VALUES (?, ?, ?, ?, ?)',
            [name, email, phone || null, studentClass, enrollmentDate]
        );

        // Fetch the created student
        const [newStudent] = await pool.execute('SELECT * FROM students WHERE id = ?', [result.insertId]);

        res.status(201).json({
            message: 'Student added successfully',
            student: newStudent[0]
        });
    } catch (error) {
        console.error('Error adding student:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ error: 'Email already exists' });
        } else {
            res.status(500).json({ error: 'Failed to add student' });
        }
    }
});

// Update student
app.put('/api/students/:id', async (req, res) => {
    try {
        const studentId = req.params.id;
        const { name, email, phone, class: studentClass } = req.body;

        // Validation
        if (!name || !email || !studentClass) {
            return res.status(400).json({ error: 'Name, email, and class are required' });
        }

        const [result] = await pool.execute(
            'UPDATE students SET name = ?, email = ?, phone = ?, class = ? WHERE id = ?',
            [name, email, phone || null, studentClass, studentId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Fetch the updated student
        const [updatedStudent] = await pool.execute('SELECT * FROM students WHERE id = ?', [studentId]);

        res.json({
            message: 'Student updated successfully',
            student: updatedStudent[0]
        });
    } catch (error) {
        console.error('Error updating student:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ error: 'Email already exists' });
        } else {
            res.status(500).json({ error: 'Failed to update student' });
        }
    }
});

// Delete student
app.delete('/api/students/:id', async (req, res) => {
    try {
        const studentId = req.params.id;

        const [result] = await pool.execute('DELETE FROM students WHERE id = ?', [studentId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ error: 'Failed to delete student' });
    }
});

// Get all grades
app.get('/api/grades', async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT g.*, s.name as student_name, s.class as student_class,
                   ROUND((g.marks * 100 / g.max_marks), 2) as percentage
            FROM grades g
            JOIN students s ON g.student_id = s.id
            ORDER BY g.grade_date DESC, s.name
        `);

        // Add letter grades
        const gradesWithLetters = rows.map(grade => ({
            ...grade,
            letter_grade: calculateLetterGrade(grade.percentage)
        }));

        res.json(gradesWithLetters);
    } catch (error) {
        console.error('Error fetching grades:', error);
        res.status(500).json({ error: 'Failed to fetch grades' });
    }
});

// Get grades by student ID
app.get('/api/students/:id/grades', async (req, res) => {
    try {
        const studentId = req.params.id;

        const [rows] = await pool.execute(`
            SELECT g.*, ROUND((g.marks * 100 / g.max_marks), 2) as percentage
            FROM grades g
            WHERE g.student_id = ?
            ORDER BY g.grade_date DESC
        `, [studentId]);

        // Add letter grades
        const gradesWithLetters = rows.map(grade => ({
            ...grade,
            letter_grade: calculateLetterGrade(grade.percentage)
        }));

        res.json(gradesWithLetters);
    } catch (error) {
        console.error('Error fetching student grades:', error);
        res.status(500).json({ error: 'Failed to fetch student grades' });
    }
});

// Add new grade
app.post('/api/grades', async (req, res) => {
    try {
        const { student_id, subject, marks, max_marks, grade_date } = req.body;

        // Validation
        if (!student_id || !subject || marks === undefined || marks === null) {
            return res.status(400).json({ error: 'Student ID, subject, and marks are required' });
        }

        if (marks < 0 || marks > (max_marks || 100)) {
            return res.status(400).json({ error: 'Marks must be between 0 and maximum marks' });
        }

        const maxMarks = max_marks || 100;
        const gradeDate = grade_date || new Date().toISOString().split('T')[0];

        // Check if student exists
        const [student] = await pool.execute('SELECT id FROM students WHERE id = ?', [student_id]);
        if (student.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const [result] = await pool.execute(
            'INSERT INTO grades (student_id, subject, marks, max_marks, grade_date) VALUES (?, ?, ?, ?, ?)',
            [student_id, subject, marks, maxMarks, gradeDate]
        );

        // Fetch the created grade with student info
        const [newGrade] = await pool.execute(`
            SELECT g.*, s.name as student_name, s.class as student_class,
                   ROUND((g.marks * 100 / g.max_marks), 2) as percentage
            FROM grades g
            JOIN students s ON g.student_id = s.id
            WHERE g.id = ?
        `, [result.insertId]);

        const gradeWithLetter = {
            ...newGrade[0],
            letter_grade: calculateLetterGrade(newGrade[0].percentage)
        };

        res.status(201).json({
            message: 'Grade added successfully',
            grade: gradeWithLetter
        });
    } catch (error) {
        console.error('Error adding grade:', error);
        res.status(500).json({ error: 'Failed to add grade' });
    }
});

// Update grade
app.put('/api/grades/:id', async (req, res) => {
    try {
        const gradeId = req.params.id;
        const { subject, marks, max_marks } = req.body;

        // Validation
        if (!subject || marks === undefined || marks === null) {
            return res.status(400).json({ error: 'Subject and marks are required' });
        }

        const maxMarks = max_marks || 100;

        if (marks < 0 || marks > maxMarks) {
            return res.status(400).json({ error: 'Marks must be between 0 and maximum marks' });
        }

        const [result] = await pool.execute(
            'UPDATE grades SET subject = ?, marks = ?, max_marks = ? WHERE id = ?',
            [subject, marks, maxMarks, gradeId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Grade not found' });
        }

        // Fetch the updated grade
        const [updatedGrade] = await pool.execute(`
            SELECT g.*, s.name as student_name, s.class as student_class,
                   ROUND((g.marks * 100 / g.max_marks), 2) as percentage
            FROM grades g
            JOIN students s ON g.student_id = s.id
            WHERE g.id = ?
        `, [gradeId]);

        const gradeWithLetter = {
            ...updatedGrade[0],
            letter_grade: calculateLetterGrade(updatedGrade[0].percentage)
        };

        res.json({
            message: 'Grade updated successfully',
            grade: gradeWithLetter
        });
    } catch (error) {
        console.error('Error updating grade:', error);
        res.status(500).json({ error: 'Failed to update grade' });
    }
});

// Delete grade
app.delete('/api/grades/:id', async (req, res) => {
    try {
        const gradeId = req.params.id;

        const [result] = await pool.execute('DELETE FROM grades WHERE id = ?', [gradeId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Grade not found' });
        }

        res.json({ message: 'Grade deleted successfully' });
    } catch (error) {
        console.error('Error deleting grade:', error);
        res.status(500).json({ error: 'Failed to delete grade' });
    }
});

// Get analytics/statistics
app.get('/api/analytics', async (req, res) => {
    try {
        // Get total students
        const [totalStudents] = await pool.execute('SELECT COUNT(*) as count FROM students');

        // Get total grades
        const [totalGrades] = await pool.execute('SELECT COUNT(*) as count FROM grades');

        // Get average grades by subject
        const [subjectAverages] = await pool.execute(`
            SELECT subject, 
                   COUNT(*) as total_grades,
                   ROUND(AVG(marks * 100 / max_marks), 2) as average_percentage
            FROM grades 
            GROUP BY subject 
            ORDER BY average_percentage DESC
        `);

        // Get grade distribution
        const [gradeDistribution] = await pool.execute(`
            SELECT 
                CASE 
                    WHEN (marks * 100 / max_marks) >= 90 THEN 'A'
                    WHEN (marks * 100 / max_marks) >= 80 THEN 'B'
                    WHEN (marks * 100 / max_marks) >= 70 THEN 'C'
                    WHEN (marks * 100 / max_marks) >= 60 THEN 'D'
                    ELSE 'F'
                END as letter_grade,
                COUNT(*) as count
            FROM grades
            GROUP BY letter_grade
            ORDER BY letter_grade
        `);

        // Get top performing students
        const [topStudents] = await pool.execute(`
            SELECT s.name, s.class,
                   ROUND(AVG(g.marks * 100 / g.max_marks), 2) as average_percentage,
                   COUNT(g.id) as total_grades
            FROM students s
            JOIN grades g ON s.id = g.student_id
            GROUP BY s.id
            HAVING total_grades >= 2
            ORDER BY average_percentage DESC
            LIMIT 5
        `);

        res.json({
            totals: {
                students: totalStudents[0].count,
                grades: totalGrades[0].count
            },
            subject_averages: subjectAverages,
            grade_distribution: gradeDistribution,
            top_students: topStudents
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

// Serve the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Handle 404 for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
});

// Start server
async function startServer() {
    try {
        await initializeDatabase();

        app.listen(PORT, () => {
            console.log(`\n🚀 Server running on http://localhost:${PORT}`);
            console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
            console.log(`🌐 Frontend available at http://localhost:${PORT}`);
            console.log(`\n📝 Available API endpoints:`);
            console.log(`   GET    /api/students - Get all students`);
            console.log(`   POST   /api/students - Add new student`);
            console.log(`   GET    /api/students/:id - Get student by ID`);
            console.log(`   PUT    /api/students/:id - Update student`);
            console.log(`   DELETE /api/students/:id - Delete student`);
            console.log(`   GET    /api/grades - Get all grades`);
            console.log(`   POST   /api/grades - Add new grade`);
            console.log(`   GET    /api/students/:id/grades - Get grades for student`);
            console.log(`   PUT    /api/grades/:id - Update grade`);
            console.log(`   DELETE /api/grades/:id - Delete grade`);
            console.log(`   GET    /api/analytics - Get system analytics`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down server...');
    if (pool) {
        await pool.end();
        console.log('✅ Database connections closed');
    }
    process.exit(0);
});

startServer();
