
let complaints = [];
const complaintForm = document.getElementById('complaintForm');
const successModal = document.getElementById('successModal');
const detailModal = document.getElementById('detailModal');
const complaintsTable = document.getElementById('complaintsTable');
const complaintsBody = document.getElementById('complaintsBody');
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

function initializePage() {
    if (window.location.pathname === '/admin' || window.location.pathname.includes('admin.html')) {
        loadComplaints();
        setupAdminEventListeners();
    } else {
        setupUserEventListeners();
    }
    
    setupModalEventListeners();
}
function setupUserEventListeners() {
    if (complaintForm) {
        complaintForm.addEventListener('submit', handleComplaintSubmission);
    }
}

async function handleComplaintSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(complaintForm);
    const complaintData = {
        fullName: formData.get('fullName').trim(),
        email: formData.get('email').trim(),
        subject: formData.get('subject').trim(),
        description: formData.get('description').trim()
    };
    
    if (!complaintData.fullName || !complaintData.email || !complaintData.subject || !complaintData.description) {
        alert('Please fill in all required fields.');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(complaintData.email)) {
        alert('Please enter a valid email address.');
        return;
    }
    
    try {
        const submitBtn = document.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        
        const response = await fetch('/complaints', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(complaintData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            document.getElementById('complaintId').textContent = result.data.id;
            successModal.style.display = 'block';

            complaintForm.reset();
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        console.error('Error submitting complaint:', error);
        alert('An error occurred while submitting your complaint. Please try again.');
    } finally {
        const submitBtn = document.querySelector('.submit-btn');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Complaint';
    }
}
function setupAdminEventListeners() {
    setInterval(loadComplaints, 30000);
}

async function loadComplaints() {
    try {
        const response = await fetch('/complaints');
        const result = await response.json();
        
        if (result.success) {
            complaints = result.data;
            displayComplaints();
            updateStats();
        } else {
            console.error('Failed to load complaints:', result.message);
        }
    } catch (error) {
        console.error('Error loading complaints:', error);
    }
}

function displayComplaints() {
    if (!complaintsBody) return;
    
    complaintsBody.innerHTML = '';
    
    if (complaints.length === 0) {
        complaintsBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2rem; color: #666;">
                    No complaints found
                </td>
            </tr>
        `;
        return;
    }
    
    complaints.forEach(complaint => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${complaint.id}</td>
            <td>${escapeHtml(complaint.fullName)}</td>
            <td>${escapeHtml(complaint.email)}</td>
            <td>${escapeHtml(complaint.subject)}</td>
            <td>
                <span class="status-badge status-${complaint.status}">
                    ${complaint.status}
                </span>
            </td>
            <td>${formatDate(complaint.createdAt)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-sm btn-view" onclick="viewComplaint(${complaint.id})">View</button>
                    <button class="btn-sm btn-edit" onclick="updateStatus(${complaint.id})">Edit</button>
                    <button class="btn-sm btn-delete" onclick="deleteComplaint(${complaint.id})">Delete</button>
                </div>
            </td>
        `;
        complaintsBody.appendChild(row);
    });
}

function updateStats() {
    const total = complaints.length;
    const pending = complaints.filter(c => c.status === 'pending').length;
    const resolved = complaints.filter(c => c.status === 'resolved').length;
    const rejected = complaints.filter(c => c.status === 'rejected').length;
    
    updateStatElement('totalComplaints', total);
    updateStatElement('pendingComplaints', pending);
    updateStatElement('resolvedComplaints', resolved);
    updateStatElement('rejectedComplaints', rejected);
}

function updateStatElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

function viewComplaint(id) {
    const complaint = complaints.find(c => c.id === id);
    if (!complaint) return;
    
    const detailsHtml = `
        <div style="margin-bottom: 1rem;">
            <strong>Complaint ID:</strong> ${complaint.id}
        </div>
        <div style="margin-bottom: 1rem;">
            <strong>Name:</strong> ${escapeHtml(complaint.fullName)}
        </div>
        <div style="margin-bottom: 1rem;">
            <strong>Email:</strong> ${escapeHtml(complaint.email)}
        </div>
        <div style="margin-bottom: 1rem;">
            <strong>Subject:</strong> ${escapeHtml(complaint.subject)}
        </div>
        <div style="margin-bottom: 1rem;">
            <strong>Description:</strong><br>
            <div style="background: #f8f9fa; padding: 1rem; border-radius: 4px; margin-top: 0.5rem;">
                ${escapeHtml(complaint.description)}
            </div>
        </div>
        <div style="margin-bottom: 1rem;">
            <strong>Status:</strong> 
            <span class="status-badge status-${complaint.status}">${complaint.status}</span>
        </div>
        <div style="margin-bottom: 1rem;">
            <strong>Created:</strong> ${formatDate(complaint.createdAt)}
        </div>
        ${complaint.updatedAt ? `
            <div>
                <strong>Last Updated:</strong> ${formatDate(complaint.updatedAt)}
            </div>
        ` : ''}
    `;
    
    document.getElementById('complaintDetails').innerHTML = detailsHtml;
    detailModal.style.display = 'block';
}

function updateStatus(id) {
    const complaint = complaints.find(c => c.id === id);
    if (!complaint) return;
    
    const newStatus = prompt(
        `Current status: ${complaint.status}\n\nEnter new status (pending/resolved/rejected):`,
        complaint.status
    );
    
    if (!newStatus || !['pending', 'resolved', 'rejected'].includes(newStatus.toLowerCase())) {
        alert('Invalid status. Please enter: pending, resolved, or rejected');
        return;
    }
    
    updateComplaintStatus(id, newStatus.toLowerCase());
}

async function updateComplaintStatus(id, status) {
    try {
        const response = await fetch(`/complaints/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('Status updated successfully!');
            loadComplaints(); // Reload to show updated data
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        console.error('Error updating status:', error);
        alert('An error occurred while updating the status.');
    }
}

async function deleteComplaint(id) {
    if (!confirm('Are you sure you want to delete this complaint?')) {
        return;
    }
    
    try {
        const response = await fetch(`/complaints/${id}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('Complaint deleted successfully!');
            loadComplaints(); // Reload to show updated data
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        console.error('Error deleting complaint:', error);
        alert('An error occurred while deleting the complaint.');
    }
}
function setupModalEventListeners() {
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
        }
    });
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });
}