const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json());
const DATA_FILE = path.join(__dirname, 'students.json');
const initializeDataFile = () => {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
    }
};
const readStudents = () => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};
const writeStudents = (students) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(students, null, 2));
};
const generateId = (students) => {
    return students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
};
const validateStudent = (student) => {
    const { name, email, course } = student;
    if (!name || !email || !course) {
        return { isValid: false, message: 'Name, email, and course are required' };
    }
    if (!email.includes('@')) {
        return { isValid: false, message: 'Invalid email format' };
    }
    return { isValid: true };
};
app.get('/students', (req, res) => {
    try {
        const students = readStudents();
        res.json({
            success: true,
            count: students.length,
            data: students
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error reading students data',
            error: error.message
        });
    }
});
app.get('/students/:id', (req, res) => {
    try {
        const students = readStudents();
        const student = students.find(s => s.id === parseInt(req.params.id));
        
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }
        
        res.json({
            success: true,
            data: student
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error reading student data',
            error: error.message
        });
    }
});
app.post('/students', (req, res) => {
    try {
        const validation = validateStudent(req.body);
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                message: validation.message
            });
        }

        const students = readStudents();
        
        // Check for duplicate email
        const existingStudent = students.find(s => s.email === req.body.email);
        if (existingStudent) {
            return res.status(400).json({
                success: false,
                message: 'Student with this email already exists'
            });
        }

        const newStudent = {
            id: generateId(students),
            name: req.body.name,
            email: req.body.email,
            course: req.body.course,
            createdAt: new Date().toISOString()
        };

        students.push(newStudent);
        writeStudents(students);

        res.status(201).json({
            success: true,
            message: 'Student created successfully',
            data: newStudent
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating student',
            error: error.message
        });
    }
});
app.put('/students/:id', (req, res) => {
    try {
        const validation = validateStudent(req.body);
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                message: validation.message
            });
        }

        const students = readStudents();
        const studentIndex = students.findIndex(s => s.id === parseInt(req.params.id));
        
        if (studentIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }
        const existingStudent = students.find(s => s.email === req.body.email && s.id !== parseInt(req.params.id));
        if (existingStudent) {
            return res.status(400).json({
                success: false,
                message: 'Student with this email already exists'
            });
        }

        const updatedStudent = {
            ...students[studentIndex],
            name: req.body.name,
            email: req.body.email,
            course: req.body.course,
            updatedAt: new Date().toISOString()
        };

        students[studentIndex] = updatedStudent;
        writeStudents(students);

        res.json({
            success: true,
            message: 'Student updated successfully',
            data: updatedStudent
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating student',
            error: error.message
        });
    }
});
app.delete('/students/:id', (req, res) => {
    try {
        const students = readStudents();
        const studentIndex = students.findIndex(s => s.id === parseInt(req.params.id));
        
        if (studentIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        const deletedStudent = students[studentIndex];
        students.splice(studentIndex, 1);
        writeStudents(students);

        res.json({
            success: true,
            message: 'Student deleted successfully',
            data: deletedStudent
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting student',
            error: error.message
        });
    }
});
initializeDataFile();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Student Management API running on port ${PORT}`);
    console.log(`Data stored in: ${DATA_FILE}`);
    console.log('\nAPI Endpoints:');
    console.log('GET    /students      - Get all students');
    console.log('GET    /students/:id  - Get student by ID');
    console.log('POST   /students      - Create new student');
    console.log('PUT    /students/:id  - Update student');
    console.log('DELETE /students/:id  - Delete student');
});

module.exports = app;
