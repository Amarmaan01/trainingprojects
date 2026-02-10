const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;
let complaints = [];
let nextId = 1;
app.use(express.json());
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/complaints', (req, res) => {
    res.json({
        success: true,
        count: complaints.length,
        data: complaints
    });
});

app.get('/complaints/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const complaint = complaints.find(c => c.id === id);
    
    if (!complaint) {
        return res.status(404).json({
            success: false,
            message: `Complaint with id ${id} not found`
        });
    }
    
    res.json({
        success: true,
        data: complaint
    });
});

app.post('/complaints', (req, res) => {
    const { fullName, email, subject, description } = req.body;
    
    if (!fullName || !email || !subject || !description) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        });
    }
    
    const newComplaint = {
        id: nextId++,
        fullName,
        email,
        subject,
        description,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    complaints.push(newComplaint);
    
    res.status(201).json({
        success: true,
        message: 'Complaint submitted successfully',
        data: newComplaint
    });
});
app.put('/complaints/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    
    const complaint = complaints.find(c => c.id === id);
    
    if (!complaint) {
        return res.status(404).json({
            success: false,
            message: `Complaint with id ${id} not found`
        });
    }
    
    if (!['pending', 'resolved', 'rejected'].includes(status)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid status. Must be pending, resolved, or rejected'
        });
    }
    
    complaint.status = status;
    complaint.updatedAt = new Date().toISOString();
    
    res.json({
        success: true,
        message: 'Complaint status updated successfully',
        data: complaint
    });
});


app.delete('/complaints/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = complaints.findIndex(c => c.id === id);
    
    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: `Complaint with id ${id} not found`
        });
    }
    
    const deletedComplaint = complaints.splice(index, 1)[0];
    
    res.json({
        success: true,
        message: 'Complaint deleted successfully',
        data: deletedComplaint
    });
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});