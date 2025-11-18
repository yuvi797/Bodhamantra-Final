import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MentorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: {
    type: String,
    unique: true,
    sparse: true
  },
  bio: String,
  expertise: [String], // tags/subjects
  idCardUrl: String, // URL of uploaded id card image
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending' // Mentors need admin approval
  },
  availableHours: { type: String, default: '0' }, // Available hours per day
  isCurrentlyAvailable: { type: Boolean, default: false },
  numberOfStudentsMentored: { type: Number, default: 0 },
  ratings: { type: Number, default: 0 }, // Average rating
  ratingsCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
MentorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
MentorSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model('Mentor', MentorSchema);
