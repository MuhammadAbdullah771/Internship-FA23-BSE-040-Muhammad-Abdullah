const mongoose = require('mongoose');

const urlOrEmpty = {
  type: String,
  default: '',
  trim: true,
  maxlength: [300, 'URL is too long'],
};

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },
    professionalTitle: {
      type: String,
      default: '',
      trim: true,
      maxlength: [120, 'Professional title cannot exceed 120 characters'],
    },
    bio: {
      type: String,
      default: '',
      trim: true,
      maxlength: [1000, 'Bio cannot exceed 1000 characters'],
    },
    profileImage: {
      type: String,
      default: '',
      trim: true,
    },
    location: {
      type: String,
      default: '',
      trim: true,
      maxlength: [120, 'Location cannot exceed 120 characters'],
    },
    university: {
      type: String,
      default: '',
      trim: true,
      maxlength: [150, 'University cannot exceed 150 characters'],
    },
    degree: {
      type: String,
      default: '',
      trim: true,
      maxlength: [120, 'Degree cannot exceed 120 characters'],
    },
    graduationYear: {
      type: Number,
      min: [1950, 'Graduation year is invalid'],
      max: [2100, 'Graduation year is invalid'],
      default: null,
    },
    skills: {
      type: [
        {
          type: String,
          trim: true,
          maxlength: [40, 'Skill name is too long'],
        },
      ],
      default: [],
      validate: {
        validator(arr) {
          return arr.length <= 30;
        },
        message: 'You can add at most 30 skills',
      },
    },
    githubUrl: urlOrEmpty,
    linkedinUrl: urlOrEmpty,
    portfolioUrl: urlOrEmpty,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

profileSchema.virtual('completionPercent').get(function completionPercent() {
  const checks = [
    Boolean(this.fullName?.trim()),
    Boolean(this.professionalTitle?.trim()),
    Boolean(this.bio?.trim() && this.bio.trim().length >= 40),
    Boolean(this.profileImage),
    Boolean(this.location?.trim()),
    Boolean(this.university?.trim()),
    Boolean(this.degree?.trim()),
    Boolean(this.graduationYear),
    Array.isArray(this.skills) && this.skills.length >= 3,
    Boolean(this.githubUrl?.trim() || this.linkedinUrl?.trim() || this.portfolioUrl?.trim()),
  ];

  const done = checks.filter(Boolean).length;
  return Math.round((done / checks.length) * 100);
});

profileSchema.index({ fullName: 'text', professionalTitle: 'text', skills: 'text' });
profileSchema.index({ skills: 1 });
profileSchema.index({ clerkId: 1, updatedAt: -1 });

profileSchema.methods.isComplete = function isComplete() {
  return this.completionPercent >= 80;
};

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
