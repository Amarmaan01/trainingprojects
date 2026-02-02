# Student Management API

A simple REST API for managing student records using Node.js, Express, and file-based storage.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
# or for development with auto-restart:
npm run dev
```

Server runs on http://localhost:3000

## API Endpoints

### GET /students
Get all students
```
GET http://localhost:3000/students
```

### GET /students/:id
Get a specific student by ID
```
GET http://localhost:3000/students/1
```

### POST /students
Create a new student
```
POST http://localhost:3000/students
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "course": "Computer Science"
}
```

### PUT /students/:id
Update an existing student
```
PUT http://localhost:3000/students/1
Content-Type: application/json

{
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "course": "Software Engineering"
}
```

### DELETE /students/:id
Delete a student
```
DELETE http://localhost:3000/students/1
```

## Testing with Postman

1. Import the collection or manually create requests for each endpoint
2. Use the examples above for request format
3. Student data is stored in `students.json` file

## Student Data Structure

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "course": "Computer Science",
  "createdAt": "2026-02-02T10:30:00.000Z"
}
```