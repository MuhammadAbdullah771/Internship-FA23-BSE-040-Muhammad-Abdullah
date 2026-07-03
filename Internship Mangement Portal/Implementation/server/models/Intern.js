import mongoose from 'mongoose';
import { INTERN_STATUSES, INTERN_DEPARTMENTS } from '../constants/interns.js';

const internSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    track: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    status: {
      type: String,
      enum: INTERN_STATUSES,
      default: 'Onboarding',
      index: true,
    },
    department: {
      type: String,
      enum: INTERN_DEPARTMENTS,
      required: true,
      index: true,
    },
    intake: {
      type: String,
      required: true,
      trim: true,
      maxlength: 10,
      index: true,
    },
    avatar: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

internSchema.virtual('fullName').get(function fullName() {
  return `${this.firstName} ${this.lastName}`.trim();
});

internSchema.index({ firstName: 'text', lastName: 'text', email: 'text' });

export const Intern = mongoose.model('Intern', internSchema);
