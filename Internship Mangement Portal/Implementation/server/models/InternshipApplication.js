import mongoose from 'mongoose';

const APPLICATION_STATUSES = ['pending', 'accepted', 'rejected'];

const internshipApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    postingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InternshipPosting',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: APPLICATION_STATUSES,
      default: 'pending',
    },
  },
  { timestamps: true },
);

internshipApplicationSchema.index({ userId: 1, postingId: 1 }, { unique: true });

export const InternshipApplication = mongoose.model('InternshipApplication', internshipApplicationSchema);
