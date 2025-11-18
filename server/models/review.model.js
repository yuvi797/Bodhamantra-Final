import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
    request: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request'
    }, // optional backlink
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student', required: true
    },
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mentor',
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: String,
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Review', ReviewSchema);
