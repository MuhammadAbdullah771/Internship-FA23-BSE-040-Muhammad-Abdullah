import mongoose from 'mongoose';

export const PORTAL_ACCESS_STATUSES = ['unsubmitted', 'pending', 'approved', 'rejected'];

const portalAccessSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: PORTAL_ACCESS_STATUSES,
      default: 'unsubmitted',
    },
    postingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InternshipPosting',
    },
    internshipTitle: {
      type: String,
      trim: true,
      default: '',
    },
    paymentScreenshot: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: '',
    },
    submittedAt: Date,
    reviewedAt: Date,
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rejectionReason: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
  },
  { _id: false },
);

export default portalAccessSchema;
