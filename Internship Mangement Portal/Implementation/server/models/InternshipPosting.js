import mongoose from 'mongoose';

const internshipPostingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, default: 'InternHub Partner', trim: true },
    duration: { type: String, required: true },
    type: { type: String, default: 'Virtual' },
    spots: { type: Number, default: 20, min: 0 },
    level: { type: String, default: 'Beginner' },
    image: { type: String, default: '' },
    tags: [{ type: String, trim: true }],
    trending: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

export const InternshipPosting = mongoose.model('InternshipPosting', internshipPostingSchema);
