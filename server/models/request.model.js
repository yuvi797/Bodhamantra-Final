import mongoose from 'mongoose';

const RequestSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor', required: true },
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['PENDING', 'ACCEPTED', 'DECLINED', 'COMPLETED'], default: 'PENDING' },
  scheduledAt: Date, // optional: when meeting is scheduled
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
  // after completion:
  review: { type: mongoose.Schema.Types.ObjectId, ref: 'Review' }
});

RequestSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Request', RequestSchema);
