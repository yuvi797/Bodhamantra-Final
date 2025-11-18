import express from 'express';
import { adminLogin, getAllStudents, getAllMentors, getAllRequests, getStats, approveMentor, rejectMentor } from '../controllers/adminController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// Public routes (no auth required)
router.post('/login', adminLogin);

// Protected routes (admin auth required)
router.use(auth(['admin']));

router.get('/students', getAllStudents);
router.get('/mentors', getAllMentors);
router.get('/requests', getAllRequests);
router.get('/stats', getStats);
router.put('/mentors/:mentorId/approve', approveMentor);
router.put('/mentors/:mentorId/reject', rejectMentor);

export default router;
