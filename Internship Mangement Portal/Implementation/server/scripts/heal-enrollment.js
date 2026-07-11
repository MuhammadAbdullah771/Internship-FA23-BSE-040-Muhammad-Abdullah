import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from '../models/User.js';

dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);

const result = await User.updateMany(
  {
    role: 'student',
    'portalAccess.status': 'approved',
    $or: [
      { 'portalAccess.enrollmentStatus': { $exists: false } },
      { 'portalAccess.enrollmentStatus': null },
      { 'portalAccess.enrollmentStatus': 'none' },
    ],
  },
  { $set: { 'portalAccess.enrollmentStatus': 'active' } },
);

console.log('healed_approved_students', result.modifiedCount);

const clerkStudents = await User.countDocuments({
  role: 'student',
  clerkId: { $exists: true, $ne: null },
});
console.log('clerk_students', clerkStudents);

await mongoose.disconnect();
