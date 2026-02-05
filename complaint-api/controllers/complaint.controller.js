let complaints = [];
let nextId = 1;
export const getAllComplaints = (req, res) => {
  console.log('[Controller] Fetching all complaints');
  
  res.status(200).json({
    success: true,
    count: complaints.length,
    data: complaints
  });
};
export const createComplaint = (req, res) => {
  console.log('[Controller] Creating new complaint');
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({
      success: false,
      message: 'Title and description are required'
    });
  }
  const newComplaint = {
    id: nextId++,
    title,
    description,
    status: 'open'
  };
  
  complaints.push(newComplaint);
  
  res.status(201).json({
    success: true,
    message: 'Complaint created successfully',
    data: newComplaint
  });
};
export const resolveComplaint = (req, res) => {
  console.log('[Controller] Resolving complaint');
  
  const id = parseInt(req.params.id);
  
  const complaint = complaints.find(c => c.id === id);
  
  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: `Complaint with id ${id} not found`
    });
  }
  
  if (complaint.status === 'resolved') {
    return res.status(400).json({
      success: false,
      message: 'Complaint is already resolved'
    });
  }
  
  complaint.status = 'resolved';
  
  res.status(200).json({
    success: true,
    message: 'Complaint resolved successfully',
    data: complaint
  });
};
export const deleteComplaint = (req, res) => {
  console.log('[Controller] Deleting complaint');
  
  const id = parseInt(req.params.id);
  
  const index = complaints.findIndex(c => c.id === id);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: `Complaint with id ${id} not found`
    });
  }
  
  const deletedComplaint = complaints.splice(index, 1)[0];
  
  res.status(200).json({
    success: true,
    message: 'Complaint deleted successfully',
    data: deletedComplaint
  });
};
