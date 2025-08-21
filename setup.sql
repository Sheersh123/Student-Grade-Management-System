-- Student Grade Management System - Database Setup
-- Run this script to create the database and initial data

-- Create database
CREATE DATABASE IF NOT EXISTS student_management;
USE student_management;

-- Create students table
CREATE TABLE IF NOT EXISTS students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    class VARCHAR(50) NOT NULL,
    enrollment_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create grades table
CREATE TABLE IF NOT EXISTS grades (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    subject VARCHAR(100) NOT NULL,
    marks DECIMAL(5,2) NOT NULL,
    max_marks DECIMAL(5,2) DEFAULT 100.00,
    grade_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    INDEX idx_student_subject (student_id, subject),
    INDEX idx_grade_date (grade_date)
);

-- Insert sample students
INSERT INTO students (name, email, phone, class, enrollment_date) VALUES
('John Doe', 'john.doe@email.com', '123-456-7890', 'Computer Science', '2024-01-15'),
('Jane Smith', 'jane.smith@email.com', '234-567-8901', 'Mathematics', '2024-01-16'),
('Mike Johnson', 'mike.johnson@email.com', '345-678-9012', 'Physics', '2024-01-17'),
('Sarah Wilson', 'sarah.wilson@email.com', '456-789-0123', 'Chemistry', '2024-01-18'),
('Alex Brown', 'alex.brown@email.com', '567-890-1234', 'Biology', '2024-01-19'),
('Emily Davis', 'emily.davis@email.com', '678-901-2345', 'English', '2024-01-20'),
('David Lee', 'david.lee@email.com', '789-012-3456', 'History', '2024-01-21'),
('Lisa Garcia', 'lisa.garcia@email.com', '890-123-4567', 'Art', '2024-01-22'),
('Tom Anderson', 'tom.anderson@email.com', '901-234-5678', 'Music', '2024-01-23'),
('Anna Martinez', 'anna.martinez@email.com', '012-345-6789', 'Psychology', '2024-01-24');

-- Insert sample grades
INSERT INTO grades (student_id, subject, marks, max_marks, grade_date) VALUES
(1, 'Mathematics', 85.5, 100, '2024-02-15'),
(1, 'Science', 92.0, 100, '2024-02-16'),
(2, 'Mathematics', 78.5, 100, '2024-02-15'),
(2, 'English', 88.0, 100, '2024-02-17'),
(3, 'Physics', 95.0, 100, '2024-02-18'),
(3, 'Chemistry', 89.5, 100, '2024-02-19'),
(4, 'Chemistry', 93.0, 100, '2024-02-20'),
(4, 'Biology', 87.5, 100, '2024-02-21'),
(5, 'Biology', 91.0, 100, '2024-02-22'),
(5, 'Mathematics', 84.0, 100, '2024-02-23'),
(6, 'English', 96.5, 100, '2024-02-24'),
(6, 'Literature', 88.5, 100, '2024-02-25'),
(7, 'History', 82.0, 100, '2024-02-26'),
(7, 'Geography', 79.5, 100, '2024-02-27'),
(8, 'Art', 94.5, 100, '2024-02-28'),
(8, 'Design', 91.0, 100, '2024-03-01'),
(9, 'Music Theory', 87.0, 100, '2024-03-02'),
(9, 'Performance', 93.5, 100, '2024-03-03'),
(10, 'Psychology', 90.0, 100, '2024-03-04'),
(10, 'Statistics', 85.5, 100, '2024-03-05');

-- Create some useful views for reporting
CREATE VIEW student_summary AS
SELECT 
    s.id,
    s.name,
    s.email,
    s.class,
    s.enrollment_date,
    COUNT(g.id) as total_grades,
    ROUND(AVG(g.marks * 100 / g.max_marks), 2) as average_percentage,
    CASE 
        WHEN AVG(g.marks * 100 / g.max_marks) >= 90 THEN 'A'
        WHEN AVG(g.marks * 100 / g.max_marks) >= 80 THEN 'B'
        WHEN AVG(g.marks * 100 / g.max_marks) >= 70 THEN 'C'
        WHEN AVG(g.marks * 100 / g.max_marks) >= 60 THEN 'D'
        ELSE 'F'
    END as overall_grade
FROM students s
LEFT JOIN grades g ON s.id = g.student_id
GROUP BY s.id;

CREATE VIEW grade_summary AS
SELECT 
    g.id,
    g.student_id,
    s.name as student_name,
    s.class as student_class,
    g.subject,
    g.marks,
    g.max_marks,
    ROUND(g.marks * 100 / g.max_marks, 2) as percentage,
    CASE 
        WHEN (g.marks * 100 / g.max_marks) >= 90 THEN 'A'
        WHEN (g.marks * 100 / g.max_marks) >= 80 THEN 'B'
        WHEN (g.marks * 100 / g.max_marks) >= 70 THEN 'C'
        WHEN (g.marks * 100 / g.max_marks) >= 60 THEN 'D'
        ELSE 'F'
    END as letter_grade,
    g.grade_date
FROM grades g
JOIN students s ON g.student_id = s.id;

-- Show sample data
SELECT 'Students Table:' as Info;
SELECT * FROM students LIMIT 5;

SELECT 'Grades Table:' as Info;
SELECT * FROM grades LIMIT 10;

SELECT 'Student Summary View:' as Info;
SELECT * FROM student_summary LIMIT 5;

SHOW TABLES;
