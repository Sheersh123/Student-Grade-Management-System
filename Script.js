// Global variables
let students = [];
let grades = [];
const API_BASE_URL = 'http://localhost:3000/api';

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Student Grade Management System loaded');
    loadStudents();
    loadGrades();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    // Student form submission
    document.getElementById('student-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addStudent();
    });

    // Grade form submission
    document.getElementById('grade-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addGrade();
    });
}

// Tab Management
function showTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });

    // Show selected tab content
    document.getElementById(tabName).classList.add('active');

    // Add active class to clicked button
    event.target.classList.add('active');

    // Load data when switching to certain tabs
    if (tabName === 'students') {
        loadStudents();
    } else if (tabName === 'grades') {
        loadGrades();
    } else if (tabName === 'add-grade') {
        loadStudentOptions();
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

        const data = await response.json();
        students = data;
        displayStudents(students);
        updateGradeF
