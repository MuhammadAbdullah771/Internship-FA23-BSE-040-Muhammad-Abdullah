const mongoose = require('mongoose');

const ROLES = ['intern', 'recruiter', 'admin'];
const AUTH_PROVIDERS = ['email', 'google', 'github', 'apple'];

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: [true, 'Clerk user id is required'],
      unique: true,
      trim: true,
      index: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    /**
     * Passwords are managed by Clerk (hashed & stored by Clerk).
     * Do not store password hashes in this application database.
     */
    profileImage: {
      type: String,
      default: '',
      trim: true,
    },
    role: {
      type: String,
      enum: {
        values: ROLES,
        message: 'Role must be intern, recruiter, or admin',
      },
      default: 'intern',
    },
    /** How the user typically signs in (project-facing label) */
    primaryAuthProvider: {
      type: String,
      enum: AUTH_PROVIDERS,
      default: 'email',
    },
    /** All linked sign-in methods (email + social) */
    authProviders: {
      type: [
        {
          type: String,
          enum: AUTH_PROVIDERS,
        },
      ],
      default: ['email'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

userSchema.statics.ROLES = ROLES;
userSchema.statics.AUTH_PROVIDERS = AUTH_PROVIDERS;

const User = mongoose.model('User', userSchema);

module.exports = User;
