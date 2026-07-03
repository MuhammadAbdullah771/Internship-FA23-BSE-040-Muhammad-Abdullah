import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ROLE_VALUES } from '../constants/roles.js';

const SALT_ROUNDS = 12;

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
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
    role: {
      type: String,
      enum: ROLE_VALUES,
      default: 'student',
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

userSchema.virtual('fullName').get(function fullName() {
  return `${this.firstName} ${this.lastName}`.trim();
});

userSchema.methods.comparePassword = function comparePassword(plainPassword) {
  return bcrypt.compare(plainPassword, this.passwordHash);
};

userSchema.statics.hashPassword = function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
};

userSchema.pre('save', async function hashOnSave(next) {
  if (!this.isModified('passwordHash')) {
    return next();
  }
  if (this.passwordHash.startsWith('$2')) {
    return next();
  }
  this.passwordHash = await bcrypt.hash(this.passwordHash, SALT_ROUNDS);
  return next();
});

export const User = mongoose.model('User', userSchema);
