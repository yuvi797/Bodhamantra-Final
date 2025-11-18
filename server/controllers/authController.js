import jwt from 'jsonwebtoken';
import Student from '../models/student.model.js';
import Mentor from '../models/mentor.model.js';
import Admin from '../models/admin.model.js';

function signToken(id, type) {
    return jwt.sign({ id, type }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// Student register
export const registerStudent = async (req, res) => {
    try {
        const { name, email, password, phone, branch, course } = req.body;

        // Check for existing email
        const existingEmail = await Student.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Check for existing phone if provided
        if (phone) {
            const existingPhone = await Student.findOne({ phone });
            if (existingPhone) {
                return res.status(400).json({ message: 'Phone number already registered' });
            }
        }

        const student = await Student.create({
            name,
            email,
            password,
            phone,
            branch,
            course
        });

        const token = signToken(student._id, 'student');
        res.status(201).json({
            success: true,
            message: 'Registration successful! Please login to continue.',
            token,
            user: { id: student._id, name: student.name, email: student.email, type: 'student' }
        });
    } catch (error) {
        // Handle MongoDB duplicate key errors
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                message: `${field.charAt(0).toUpperCase() + field.slice(1)} already registered`
            });
        }
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// Mentor register (uploads idCardUrl)
export const registerMentor = async (req, res) => {
    try {
        const { name, email, password, phone, expertise, idCardUrl, bio, availableHours } = req.body;

        // Check for existing email
        const existingEmail = await Mentor.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Check for existing phone if provided
        if (phone) {
            const existingPhone = await Mentor.findOne({ phone });
            if (existingPhone) {
                return res.status(400).json({ message: 'Phone number already registered' });
            }
        }

        // create with verificationStatus pending by default
        const mentor = await Mentor.create({
            name,
            email,
            password,
            phone,
            expertise,
            idCardUrl,
            bio,
            availableHours: availableHours || '0', // Available hours per day
            verificationStatus: 'pending',
            isCurrentlyAvailable: false // Default to false until approved
        });

        const token = signToken(mentor._id, 'mentor');
        res.status(201).json({
            success: true,
            message: 'Registration successful! Your application is pending admin approval.',
            token,
            user: {
                id: mentor._id,
                name: mentor.name,
                email: mentor.email,
                type: 'mentor',
                verificationStatus: mentor.verificationStatus
            }
        });
    } catch (error) {
        // Handle MongoDB duplicate key errors
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                message: `${field.charAt(0).toUpperCase() + field.slice(1)} already registered`
            });
        }
        res.status(500).json({ message: 'Server error during registration' });
    }
};// Login for all types
export const login = async (req, res) => {
    const { email, password, type } = req.body; // type: 'student' | 'mentor' | 'admin'
    let Model = Student;
    if (type === 'mentor') Model = Mentor;
    if (type === 'admin') Model = Admin;
    const user = await Model.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
    // for mentor, optionally ensure approved? You may allow login but restrict actions if not approved.

    const token = signToken(user._id, type);
    res.json({
        token, user: {
            id: user._id,
            name: user.name,
            email: user.email,
            type,
        }
    });
};
