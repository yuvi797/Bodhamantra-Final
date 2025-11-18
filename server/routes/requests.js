import express from 'express';
import {
    createRequest,
    getMyRequests,
    getMentorRequests,
    updateRequestStatusByMentor,
    completeRequestAndReview
} from '../controllers/requestController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

// student creates request
router.post('/', auth(['student']), createRequest);

// student lists his requests
router.get('/me', auth(['student']), getMyRequests);

// mentor lists assigned requests
router.get('/mentor/me', auth(['mentor']), getMentorRequests);

// mentor updates status
router.patch('/:requestId/status', auth(['mentor']), updateRequestStatusByMentor);

// student completes & reviews
router.post('/:requestId/complete', auth(['student']), completeRequestAndReview);

export default router;
