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
    fullName: {
      type: String,
      trim: true,
      maxlength: 120,
      default: '',
    },
    fatherName: {
      type: String,
      trim: true,
      maxlength: 120,
      default: '',
    },
    institute: {
      type: String,
      trim: true,
      maxlength: 200,
      default: '',
    },
    cnic: {
      type: String,
      trim: true,
      maxlength: 15,
      default: '',
    },
    contactNumber: {
      type: String,
      trim: true,
      maxlength: 20,
      default: '',
    },
    cvPdf: {
      type: String,
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
    enrollmentStatus: {
      type: String,
      enum: ['none', 'active', 'completed'],
      default: 'none',
    },
    enrollmentCompletedAt: Date,
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
