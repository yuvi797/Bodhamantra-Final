import express from 'express';
import { getApprovedMentors, getMentorProfile, getMyProfile, updateAvailability, updateProfile } from '../controllers/mentorController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// Public: list only approved mentors
router.get('/', getApprovedMentors);
router.get('/:mentorId', getMentorProfile);

// mentor-only actions (protected routes)
router.use(auth(['mentor']));
router.get('/me/profile', getMyProfile);
router.put('/me/availability', updateAvailability);
router.put('/me/profile', updateProfile);

export default router;
