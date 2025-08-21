// Student Grade Management System - Frontend JavaScript
// Complete implementation for GitHub repository

// Global variables
let students = [];
let grades = [];
let filteredStudents = [];
let filteredGrades = [];
const API_BASE_URL = 'http://localhost:3000/api';

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎓 Student Grade Management System loaded');
    initializeApp();
});

// Initialize application
async function initializeApp() {
    try {
        setupEventListeners();
        await loadStudents();
        await loadGrades();
        updateStats();
        showNotification('Application loaded successfully!', 'success');
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Failed to initialize application. Please check if the server is running.', 'error');
    }
}

// Set up all event listeners
function setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const tabName = e.target.getAttribute('data-tab') || e.target.textContent.toLowerCase().replace(/[^a-z]/g, '');
            showTab(tabName);
        });
    });

    // Student form submission
    const studentForm = document.getElementById('student-form');
    if (studentForm) {
        studentForm.addEventListener('submit', handleStudentSubmit);
    }

    // Grade form submission
    const gradeForm = document.getElementById('grade-form');
    if (gradeForm) {
        gradeForm.addEventListener('submit', handleGradeSubmit);
    }

    // Search functionality
    const searchInput = document.getElementById('student-search');
    if (searchInput) {
        searchInput.addEventListener('input', handleStudentSearch);
    }

    // Grade filters
    const studentFilter = document.getElementById('grade-student-filter');
    const subjectFilter = document.getElementById('grade-subject-filter');

    if (studentFilter) {
        studentFilter.addEventListener('change', handleGradeFilter);
    }

    if (subjectFilter) {
        subjectFilter.addEventListener('change', handleGradeFilter);
    }
}

// Tab Management
function showTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });

    // Show selected tab content
    const targetTab = document.getElementById(tabName);
    if (targetTab) {
        targetTab.classList.add('active');
    }

    // Add active class to clicked button
    document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');

    // Load data when switching to certain tabs
    switch(tabName) {
        case 'students':
            displayStudents();
            break;
        case 'grades':
            displayGrades();
            updateGradeFilters();
            break;
        case 'add-grade':
            loadStudentOptions();
            break;
    }
}

// API Functions for Students
async function loadStudents() {
    try {
        showLoading('students-table');
        const response = await fetch(`${API_BASE_URL}/students`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        students = await response.json();
        filteredStudents = [...students];
        displayStudents();
        updateStats();

    } catch (error) {
        console.error('Error loading students:', error);
        displayError('students-table', 'Failed to load students. Please check if the server is running.');
    }
}

async function addStudent(studentData) {
    try {
        const response = await fetch(`${API_BASE_URL}/students`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(studentData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to add student');
        }

        const result = await response.json();
        showNotification('Student added successfully!', 'success');

        // Reload students list
        await loadStudents();
        return result;

    } catch (error) {
        console.error('Error adding student:', error);
        showNotification(error.message, 'error');
        throw error;
    }
}

async function updateStudent(studentId, studentData) {
    try {
        const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(studentData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update student');
        }

        const result = await response.json();
        showNotification('Student updated successfully!', 'success');

        // Reload students list
        await loadStudents();
        return result;

    } catch (error) {
        console.error('Error updating student:', error);
        showNotification(error.message, 'error');
        throw error;
    }
}

async function deleteStudent(studentId) {
    if (!confirm('Are you sure you want to delete this student? This will also delete all their grades.')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete student');
        }

        showNotification('Student deleted successfully!', 'success');

        // Reload students list and grades
        await loadStudents();
        await loadGrades();

    } catch (error) {
        console.error('Error deleting student:', error);
        showNotification(error.message, 'error');
    }
}

// API Functions for Grades
async function loadGrades() {
    try {
        showLoading('grades-table');
        const response = await fetch(`${API_BASE_URL}/grades`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        grades = await response.json();
        filteredGrades = [...grades];
        displayGrades();

    } catch (error) {
        console.error('Error loading grades:', error);
        displayError('grades-table', 'Failed to load grades. Please check if the server is running.');
    }
}

async function addGrade(gradeData) {
    try {
        const response = await fetch(`${API_BASE_URL}/grades`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(gradeData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to add grade');
        }

        const result = await response.json();
        showNotification('Grade added successfully!', 'success');

        // Reload grades list
        await loadGrades();
        await loadStudents(); // Reload to update averages
        return result;

    } catch (error) {
        console.error('Error adding grade:', error);
        showNotification(error.message, 'error');
        throw error;
    }
}

async function deleteGrade(gradeId) {
    if (!confirm('Are you sure you want to delete this grade?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/grades/${gradeId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete grade');
        }

        showNotification('Grade deleted successfully!', 'success');

        // Reload grades list and students (for updated averages)
        await loadGrades();
        await loadStudents();

    } catch (error) {
        console.error('Error deleting grade:', error);
        showNotification(error.message, 'error');
    }
}

// Form Handlers
async function handleStudentSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const studentData = {
        name: formData.get('name')?.trim(),
        email: formData.get('email')?.trim(),
        phone: formData.get('phone')?.trim(),
        class: formData.get('class')?.trim(),
        enrollment_date: formData.get('enrollment_date') || new Date().toISOString().split('T')[0]
    };

    // Validation
    if (!studentData.name || !studentData.email || !studentData.class) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    try {
        await addStudent(studentData);
        e.target.reset(); // Clear form
    } catch (error) {
        // Error already handled in addStudent function
    }
}

async function handleGradeSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const gradeData = {
        student_id: parseInt(formData.get('student_id')),
        subject: formData.get('subject')?.trim(),
        marks: parseFloat(formData.get('marks')),
        max_marks: parseFloat(formData.get('max_marks')) || 100,
        grade_date: formData.get('grade_date') || new Date().toISOString().split('T')[0]
    };

    // Validation
    if (!gradeData.student_id || !gradeData.subject || gradeData.marks === undefined) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    if (gradeData.marks < 0 || gradeData.marks > gradeData.max_marks) {
        showNotification('Marks must be between 0 and maximum marks', 'error');
        return;
    }

    try {
        await addGrade(gradeData);
        e.target.reset(); // Clear form
    } catch (error) {
        // Error already handled in addGrade function
    }
}

// Search and Filter Functions
function handleStudentSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();

    if (!searchTerm) {
        filteredStudents = [...students];
    } else {
        filteredStudents = students.filter(student => 
            student.name.toLowerCase().includes(searchTerm) ||
            student.email.toLowerCase().includes(searchTerm) ||
            student.class.toLowerCase().includes(searchTerm)
        );
    }

    displayStudents();
}

function handleGradeFilter() {
    const studentFilter = document.getElementById('grade-student-filter')?.value;
    const subjectFilter = document.getElementById('grade-subject-filter')?.value;

    filteredGrades = grades.filter(grade => {
        const studentMatch = !studentFilter || grade.student_id.toString() === studentFilter;
        const subjectMatch = !subjectFilter || grade.subject.toLowerCase().includes(subjectFilter.toLowerCase());
        return studentMatch && subjectMatch;
    });

    displayGrades();
}

// Display Functions
function displayStudents() {
    const container = document.getElementById('students-table');
    if (!container) return;

    if (filteredStudents.length === 0) {
        container.innerHTML = '<p class="no-data">No students found.</p>';
        return;
    }

    const table = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Class</th>
                    <th>Enrollment Date</th>
                    <th>Average</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${filteredStudents.map(student => `
                    <tr>
                        <td>${student.id}</td>
                        <td>${escapeHtml(student.name)}</td>
                        <td>${escapeHtml(student.email)}</td>
                        <td>${escapeHtml(student.phone || 'N/A')}</td>
                        <td>${escapeHtml(student.class)}</td>
                        <td>${formatDate(student.enrollment_date)}</td>
                        <td>
                            ${student.average_percentage ? 
                                `<span class="grade-badge grade-${getGradeLetter(student.average_percentage).toLowerCase()}">${student.average_percentage}%</span>` : 
                                'No grades'
                            }
                        </td>
                        <td>
                            <button class="action-btn edit-btn" onclick="editStudent(${student.id})">Edit</button>
                            <button class="action-btn delete-btn" onclick="deleteStudent(${student.id})">Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    container.innerHTML = table;
    updateStats();
}

function displayGrades() {
    const container = document.getElementById('grades-table');
    if (!container) return;

    if (filteredGrades.length === 0) {
        container.innerHTML = '<p class="no-data">No grades found.</p>';
        return;
    }

    const table = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Student</th>
                    <th>Subject</th>
                    <th>Marks</th>
                    <th>Max Marks</th>
                    <th>Percentage</th>
                    <th>Grade</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${filteredGrades.map(grade => `
                    <tr>
                        <td>${escapeHtml(grade.student_name)}</td>
                        <td>${escapeHtml(grade.subject)}</td>
                        <td>${grade.marks}</td>
                        <td>${grade.max_marks}</td>
                        <td>${grade.percentage}%</td>
                        <td><span class="grade-badge grade-${grade.letter_grade.toLowerCase()}">${grade.letter_grade}</span></td>
                        <td>${formatDate(grade.grade_date)}</td>
                        <td>
                            <button class="action-btn delete-btn" onclick="deleteGrade(${grade.id})">Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    container.innerHTML = table;
}

// Utility Functions
function updateStats() {
    const totalStudentsElement = document.getElementById('total-students');
    if (totalStudentsElement) {
        totalStudentsElement.textContent = students.length;
    }
}

function updateGradeFilters() {
    // Update student filter dropdown
    const studentFilter = document.getElementById('grade-student-filter');
    if (studentFilter) {
        studentFilter.innerHTML = '<option value="">All Students</option>' +
            students.map(student => 
                `<option value="${student.id}">${escapeHtml(student.name)}</option>`
            ).join('');
    }

    // Update subject filter dropdown
    const subjectFilter = document.getElementById('grade-subject-filter');
    if (subjectFilter) {
        const uniqueSubjects = [...new Set(grades.map(grade => grade.subject))];
        subjectFilter.innerHTML = '<option value="">All Subjects</option>' +
            uniqueSubjects.map(subject => 
                `<option value="${subject}">${escapeHtml(subject)}</option>`
            ).join('');
    }
}

function loadStudentOptions() {
    const select = document.getElementById('grade-student');
    if (select) {
        select.innerHTML = '<option value="">Choose a student...</option>' +
            students.map(student => 
                `<option value="${student.id}">${escapeHtml(student.name)}</option>`
            ).join('');
    }
}

function getGradeLetter(percentage) {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = '<div class="loading">Loading...</div>';
    }
}

function displayError(containerId, message) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `<div class="error">${escapeHtml(message)}</div>`;
    }
}

function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }

    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Edit functionality (basic implementation)
function editStudent(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const newName = prompt('Enter new name:', student.name);
    const newEmail = prompt('Enter new email:', student.email);
    const newPhone = prompt('Enter new phone:', student.phone || '');
    const newClass = prompt('Enter new class:', student.class);

    if (newName && newEmail && newClass) {
        updateStudent(studentId, {
            name: newName.trim(),
            email: newEmail.trim(),
            phone: newPhone.trim(),
            class: newClass.trim()
        });
    }
}

// Global function exports for HTML onclick handlers
window.showTab = showTab;
window.editStudent = editStudent;
window.deleteStudent = deleteStudent;
window.deleteGrade = deleteGrade;

console.log('✅ Student Grade Management System JavaScript loaded successfully');