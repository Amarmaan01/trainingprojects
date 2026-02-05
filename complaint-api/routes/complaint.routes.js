import express from 'express';
import {getAllComplaints,createComplaint,resolveComplaint,deleteComplaint} from '../controllers/complaint.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
const router = express.Router();
router.get('/complaints', getAllComplaints);
router.post('/complaints', createComplaint);
router.put('/complaints/:id/resolve', authMiddleware, resolveComplaint);
router.delete('/complaints/:id', authMiddleware, deleteComplaint);

export default router;
