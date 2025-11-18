import Mentor from '../models/mentor.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/Asynchandler.js';

// Get all approved mentors for students to view
export const getApprovedMentors = asyncHandler(async (req, res) => {
    const mentors = await Mentor.find({ verificationStatus: 'approved' })
        .select('-password')
        .sort('-ratings');

    res.status(200).json(
        new ApiResponse(200, { mentors }, 'Approved mentors fetched successfully')
    );
});

// Get specific mentor profile
export const getMentorProfile = asyncHandler(async (req, res) => {
    const { mentorId } = req.params;
    const mentor = await Mentor.findById(mentorId).select('-password');

    if (!mentor || mentor.verificationStatus !== 'approved') {
        throw new ApiError(404, 'Mentor not found');
    }

    res.status(200).json(
        new ApiResponse(200, { mentor }, 'Mentor profile fetched successfully')
    );
});

// Get current logged-in mentor's profile
export const getMyProfile = asyncHandler(async (req, res) => {
    const mentorId = req.user._id;
    const mentor = await Mentor.findById(mentorId).select('-password');

    if (!mentor) {
        throw new ApiError(404, 'Mentor not found');
    }

    res.status(200).json(
        new ApiResponse(200, { mentor }, 'Profile fetched successfully')
    );
});

// Update mentor availability (hours and status)
export const updateAvailability = asyncHandler(async (req, res) => {
    const mentorId = req.user._id;
    const { availableHours, isCurrentlyAvailable } = req.body;

    const updateData = {};
    if (availableHours !== undefined) updateData.availableHours = availableHours;
    if (isCurrentlyAvailable !== undefined) updateData.isCurrentlyAvailable = isCurrentlyAvailable;

    const mentor = await Mentor.findByIdAndUpdate(
        mentorId,
        updateData,
        { new: true, runValidators: true }
    ).select('-password');

    if (!mentor) {
        throw new ApiError(404, 'Mentor not found');
    }

    res.status(200).json(
        new ApiResponse(200, { mentor }, 'Availability updated successfully')
    );
});

// Update mentor profile
export const updateProfile = asyncHandler(async (req, res) => {
    const mentorId = req.user._id;
    const { name, phone, bio, expertise, service, availableHours, isCurrentlyAvailable } = req.body;

    // Only allow updating specific fields
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (bio) updateData.bio = bio;
    if (expertise) updateData.expertise = expertise;
    if (service) updateData.service = service;
    if (availableHours !== undefined) updateData.availableHours = availableHours;
    if (isCurrentlyAvailable !== undefined) updateData.isCurrentlyAvailable = isCurrentlyAvailable;

    const mentor = await Mentor.findByIdAndUpdate(
        mentorId,
        updateData,
        { new: true, runValidators: true }
    ).select('-password');

    if (!mentor) {
        throw new ApiError(404, 'Mentor not found');
    }

    res.status(200).json(
        new ApiResponse(200, { mentor }, 'Profile updated successfully')
    );
});
