import jwt from 'jsonwebtoken';
import Mentor from '../models/mentor.model.js';
import Student from '../models/student.model.js';
import Request from '../models/request.model.js';
import Admin from '../models/admin.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/Asynchandler.js';

// Admin Login
export const adminLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    console.log("Admin login attempt:", { email, password });

    // Validation
    if (!email || !password) {
        throw new ApiError(400, 'Email and password are required');
    }

    // Find admin
    const admin = await Admin.findOne({ email });
    console.log("Admin found:", admin ? "YES" : "NO");
    if (!admin) {
        throw new ApiError(401, 'Invalid credentials - admin not found');
    }

    // Check password
    console.log("Checking password...");
    const isPasswordValid = await admin.comparePassword(password);
    console.log("Password valid:", isPasswordValid);
    if (!isPasswordValid) {
        throw new ApiError(401, 'Invalid credentials - wrong password');
    }

    // Generate token
    const token = jwt.sign(
        {
            id: admin._id,
            email: admin.email,
            role: admin.role
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
    );

    // Return response
    res.status(200).json(
        new ApiResponse(200, {
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            },
            token
        }, 'Login successful')
    );
});



// Get all users (students and mentors combined)
export const getAllUsers = asyncHandler(async (req, res) => {
    const [students, mentors] = await Promise.all([
        Student.find().select('-password').sort('-createdAt'),
        Mentor.find().select('-password').sort('-createdAt')
    ]);

    // Combine and format users
    const users = [
        ...students.map(s => ({
            _id: s._id,
            name: s.name,
            email: s.email,
            role: 'student',
            createdAt: s.createdAt
        })),
        ...mentors.map(m => ({
            _id: m._id,
            name: m.name,
            email: m.email,
            role: 'mentor',
            createdAt: m.createdAt
        }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json(
        new ApiResponse(200, { users }, 'Users fetched successfully')
    );
});

// Get all students
export const getAllStudents = asyncHandler(async (req, res) => {
    const students = await Student.find()
        .select('-password')
        .sort('-createdAt');

    res.status(200).json(
        new ApiResponse(200, { students }, 'Students fetched successfully')
    );
});

// Get all mentors with optional status filter
export const getAllMentors = asyncHandler(async (req, res) => {
    const { status } = req.query; // pending, approved, rejected

    let query = {};
    if (status) {
        query.verificationStatus = status;
    }

    const mentors = await Mentor.find(query)
        .select('-password')
        .sort('-createdAt');

    res.status(200).json(
        new ApiResponse(200, { mentors }, 'Mentors fetched successfully')
    );
});

// Get all requests
export const getAllRequests = asyncHandler(async (req, res) => {
    const requests = await Request.find()
        .populate('student', 'name email')
        .populate('mentor', 'name email')
        .sort('-createdAt');

    res.status(200).json(
        new ApiResponse(200, { requests }, 'Requests fetched successfully')
    );
});

// Approve mentor
export const approveMentor = asyncHandler(async (req, res) => {
    const { mentorId } = req.params;

    const mentor = await Mentor.findByIdAndUpdate(
        mentorId,
        { verificationStatus: 'approved' },
        { new: true }
    ).select('-password');

    if (!mentor) {
        throw new ApiError(404, 'Mentor not found');
    }

    res.status(200).json(
        new ApiResponse(200, { mentor }, 'Mentor approved successfully')
    );
});

// Reject mentor
export const rejectMentor = asyncHandler(async (req, res) => {
    const { mentorId } = req.params;

    const mentor = await Mentor.findByIdAndUpdate(
        mentorId,
        { verificationStatus: 'rejected' },
        { new: true }
    ).select('-password');

    if (!mentor) {
        throw new ApiError(404, 'Mentor not found');
    }

    res.status(200).json(
        new ApiResponse(200, { mentor }, 'Mentor rejected successfully')
    );
});

// Get platform statistics
export const getStats = asyncHandler(async (req, res) => {
    const [totalStudents, totalMentors, approvedMentors, pendingMentors, totalRequests] = await Promise.all([
        Student.countDocuments(),
        Mentor.countDocuments(),
        Mentor.countDocuments({ verificationStatus: 'approved' }),
        Mentor.countDocuments({ verificationStatus: 'pending' }),
        Request.countDocuments()
    ]);

    const stats = {
        totalUsers: totalStudents + totalMentors,
        totalStudents,
        totalMentors,
        approvedMentors,
        pendingMentors,
        totalRequests
    };

    res.status(200).json(
        new ApiResponse(200, stats, 'Statistics fetched successfully')
    );
});
