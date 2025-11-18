import express from 'express';
import { registerStudent, registerMentor, login } from '../controllers/authController.js';

const router = express.Router();

router.post('/student/register', registerStudent);
router.post('/mentor/register', registerMentor);
router.post('/login', login); // body: {email,password,type}

export default router;
