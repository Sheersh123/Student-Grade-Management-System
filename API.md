# Student Grade Management System - API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Currently, no authentication is required. This is a basic educational project.

---

## Students Endpoints

### GET /api/students
Get all students with their average grades.

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@email.com",
    "phone": "123-456-7890",
    "class": "Computer Science",
    "enrollment_date": "2024-01-15",
    "total_grades": 2,
    "average_percentage": 88.75,
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
]
```

### GET /api/students/:id
Get a specific student by ID.

**Parameters:**
- `id` (integer): Student ID

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@email.com",
  "phone": "123-456-7890",
  "class": "Computer Science",
  "enrollment_date": "2024-01-15",
  "created_at": "2024-01-15T10:30:00.000Z",
  "updated_at": "2024-01-15T10:30:00.000Z"
}
```

### POST /api/students
Add a new student.

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane.smith@email.com",
  "phone": "234-567-8901",
  "class": "Mathematics",
  "enrollment_date": "2024-01-16"
}
```

**Response:**
```json
{
  "message": "Student added successfully",
  "student": {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane.smith@email.com",
    "phone": "234-567-8901",
    "class": "Mathematics",
    "enrollment_date": "2024-01-16",
    "created_at": "2024-01-16T10:30:00.000Z",
    "updated_at": "2024-01-16T10:30:00.000Z"
  }
}
```

### PUT /api/students/:id
Update an existing student.

**Parameters:**
- `id` (integer): Student ID

**Request Body:**
```json
{
  "name": "Jane Smith Updated",
  "email": "jane.smith.updated@email.com",
  "phone": "234-567-8901",
  "class": "Advanced Mathematics"
}
```

**Response:**
```json
{
  "message": "Student updated successfully",
  "student": {
    "id": 2,
    "name": "Jane Smith Updated",
    "email": "jane.smith.updated@email.com",
    "phone": "234-567-8901",
    "class": "Advanced Mathematics",
    "enrollment_date": "2024-01-16",
    "created_at": "2024-01-16T10:30:00.000Z",
    "updated_at": "2024-08-22T14:30:00.000Z"
  }
}
```

### DELETE /api/students/:id
Delete a student and all their grades.

**Parameters:**
- `id` (integer): Student ID

**Response:**
```json
{
  "message": "Student deleted successfully"
}
```

---

## Grades Endpoints

### GET /api/grades
Get all grades with student information.

**Response:**
```json
[
  {
    "id": 1,
    "student_id": 1,
    "student_name": "John Doe",
    "student_class": "Computer Science",
    "subject": "Mathematics",
    "marks": 85.5,
    "max_marks": 100,
    "percentage": 85.5,
    "letter_grade": "B",
    "grade_date": "2024-02-15",
    "created_at": "2024-02-15T10:30:00.000Z",
    "updated_at": "2024-02-15T10:30:00.000Z"
  }
]
```

### GET /api/students/:id/grades
Get all grades for a specific student.

**Parameters:**
- `id` (integer): Student ID

**Response:**
```json
[
  {
    "id": 1,
    "student_id": 1,
    "subject": "Mathematics",
    "marks": 85.5,
    "max_marks": 100,
    "percentage": 85.5,
    "letter_grade": "B",
    "grade_date": "2024-02-15",
    "created_at": "2024-02-15T10:30:00.000Z",
    "updated_at": "2024-02-15T10:30:00.000Z"
  }
]
```

### POST /api/grades
Add a new grade.

**Request Body:**
```json
{
  "student_id": 1,
  "subject": "Science",
  "marks": 92.0,
  "max_marks": 100,
  "grade_date": "2024-02-16"
}
```

**Response:**
```json
{
  "message": "Grade added successfully",
  "grade": {
    "id": 2,
    "student_id": 1,
    "student_name": "John Doe",
    "student_class": "Computer Science",
    "subject": "Science",
    "marks": 92.0,
    "max_marks": 100,
    "percentage": 92.0,
    "letter_grade": "A",
    "grade_date": "2024-02-16",
    "created_at": "2024-02-16T10:30:00.000Z",
    "updated_at": "2024-02-16T10:30:00.000Z"
  }
}
```

### PUT /api/grades/:id
Update an existing grade.

**Parameters:**
- `id` (integer): Grade ID

**Request Body:**
```json
{
  "subject": "Advanced Science",
  "marks": 94.0,
  "max_marks": 100
}
```

**Response:**
```json
{
  "message": "Grade updated successfully",
  "grade": {
    "id": 2,
    "student_id": 1,
    "student_name": "John Doe",
    "student_class": "Computer Science",
    "subject": "Advanced Science",
    "marks": 94.0,
    "max_marks": 100,
    "percentage": 94.0,
    "letter_grade": "A",
    "grade_date": "2024-02-16",
    "created_at": "2024-02-16T10:30:00.000Z",
    "updated_at": "2024-08-22T14:30:00.000Z"
  }
}
```

### DELETE /api/grades/:id
Delete a grade.

**Parameters:**
- `id` (integer): Grade ID

**Response:**
```json
{
  "message": "Grade deleted successfully"
}
```

---

## Analytics Endpoint

### GET /api/analytics
Get system analytics and statistics.

**Response:**
```json
{
  "totals": {
    "students": 10,
    "grades": 20
  },
  "subject_averages": [
    {
      "subject": "Mathematics",
      "total_grades": 3,
      "average_percentage": 82.67
    }
  ],
  "grade_distribution": [
    {
      "letter_grade": "A",
      "count": 8
    },
    {
      "letter_grade": "B",
      "count": 7
    }
  ],
  "top_students": [
    {
      "name": "John Doe",
      "class": "Computer Science",
      "average_percentage": 88.75,
      "total_grades": 2
    }
  ]
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Validation error message"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error message"
}
```

---

## Grade Calculation

### Letter Grades
- A: 90-100%
- B: 80-89%
- C: 70-79%
- D: 60-69%
- F: Below 60%

### Percentage Calculation
```
Percentage = (marks / max_marks) * 100
```

---

## Testing the API

You can test the API using tools like:
- [Postman](https://www.postman.com/)
- [Insomnia](https://insomnia.rest/)
- cURL commands
- Browser developer tools

### Example cURL Commands

```bash
# Get all students
curl -X GET http://localhost:3000/api/students

# Add a new student
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Student",
    "email": "test@email.com",
    "class": "Test Class"
  }'

# Add a grade
curl -X POST http://localhost:3000/api/grades \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": 1,
    "subject": "Test Subject",
    "marks": 95,
    "max_marks": 100
  }'
```
