import mongoose from 'mongoose';
import { TASK_STATUSES, TASK_PRIORITIES } from '../constants/tasks.js';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      default: '',
      maxlength: 2000,
    },
    priority: {
      type: String,
      enum: TASK_PRIORITIES,
      default: 'Medium',
    },
    status: {
      type: String,
      enum: TASK_STATUSES,
      default: 'todo',
      index: true,
    },
    assigneeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    internId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Intern',
      default: null,
    },
    dueDate: {
      type: Date,
      default: null,
    },
    attachments: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    submission: {
      githubLink: { type: String, default: '', trim: true },
      liveUrl: { type: String, default: '', trim: true },
      comments: { type: String, default: '', maxlength: 2000 },
      status: { type: String, enum: ['draft', 'submitted'], default: 'draft' },
      submittedAt: { type: Date, default: null },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

export const Task = mongoose.model('Task', taskSchema);
