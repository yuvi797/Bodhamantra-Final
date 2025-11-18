import Request from '../models/request.model.js';
import Mentor from '../models/mentor.model.js';
import Review from '../models/review.model.js';

// Student gets their own requests
export const getMyRequests = async (req, res) => {
    try {
        const requests = await Request.find({ student: req.user._id })
            .populate('mentor', 'name email phone')
            .populate('review')
            .sort('-createdAt');
        res.json({ success: true, data: { requests } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Student creates request to a mentor
export const createRequest = async (req, res) => {
    try {
        const studentId = req.user._id;
        const { mentorId, title, description, scheduledAt } = req.body;

        console.log('Creating request - mentorId:', mentorId);
        const mentor = await Mentor.findById(mentorId);
        console.log('Found mentor:', mentor ? {
            id: mentor._id,
            name: mentor.name,
            verificationStatus: mentor.verificationStatus,
            isCurrentlyAvailable: mentor.isCurrentlyAvailable
        } : 'NULL');

        if (!mentor || mentor.verificationStatus !== 'approved') {
            console.log('Validation failed - mentor exists:', !!mentor, 'verificationStatus:', mentor?.verificationStatus);
            return res.status(400).json({ message: 'Mentor not available' });
        }

        const request = await Request.create({ student: studentId, mentor: mentorId, title, description, scheduledAt });
        console.log('Request created successfully:', request._id);
        // optionally notify mentor
        res.json(request);
    } catch (error) {
        console.error('Error in createRequest:', error);
        res.status(500).json({ message: error.message });
    }
};

// Mentor lists requests assigned to them
export const getMentorRequests = async (req, res) => {
    try {
        const mentorId = req.user._id;
        const requests = await Request.find({ mentor: mentorId })
            .populate('student', 'name email phone')
            .sort('-createdAt');
        res.json({ success: true, data: { requests } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mentor approves/declines
export const updateRequestStatusByMentor = async (req, res) => {
    const mentorId = req.user._id;
    const { requestId } = req.params;
    const { status } = req.body; // ACCEPTED or DECLINED or COMPLETED (COMPLETED maybe set after session)
    const request = await Request.findOne({ _id: requestId, mentor: mentorId });
    if (!request) return res.status(404).json({ message: 'Request not found' });
    request.status = status;
    await request.save();
    res.json(request);
};

// Student marks request completed and adds review
export const completeRequestAndReview = async (req, res) => {
    const studentId = req.user._id;
    const { requestId } = req.params;
    const { rating, comment } = req.body;
    const request = await Request.findOne({ _id: requestId, student: studentId }).populate('mentor');
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.status !== 'ACCEPTED' && request.status !== 'PENDING') {
        // you may allow only accepted
    }
    request.status = 'COMPLETED';
    const review = await Review.create({ request: request._id, student: studentId, mentor: request.mentor._id, rating, comment });
    request.review = review._id;
    await request.save();

    // update mentor's ratings aggregate
    const mentorId = request.mentor._id;
    const agg = await Review.aggregate([
        { $match: { mentor: mentorId } },
        { $group: { _id: '$mentor', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);
    const stats = agg[0] || { avgRating: rating, count: 1 };

    // Count unique students mentored (not just completed requests)
    const uniqueStudents = await Request.distinct('student', {
        mentor: mentorId,
        status: 'COMPLETED'
    });

    await Mentor.findByIdAndUpdate(mentorId, {
        ratings: stats.avgRating,
        ratingsCount: stats.count,
        numberOfStudentsMentored: uniqueStudents.length // Set to unique student count
    });

    res.json({ request, review });
};
