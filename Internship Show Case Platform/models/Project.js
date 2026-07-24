const mongoose = require('mongoose');

const PROJECT_CATEGORIES = [
  'web',
  'mobile',
  'ai-ml',
  'devops',
  'design',
  'data',
  'other',
];

const urlOrEmpty = {
  type: String,
  default: '',
  trim: true,
  maxlength: [500, 'URL is too long'],
};

const stringList = (maxItems, maxLen, label) => ({
  type: [
    {
      type: String,
      trim: true,
      maxlength: [maxLen, `${label} entry is too long`],
    },
  ],
  default: [],
  validate: {
    validator(arr) {
      return arr.length <= maxItems;
    },
    message: `You can add at most ${maxItems} ${label}`,
  },
});

const projectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    clerkId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
      maxlength: [280, 'Short description cannot exceed 280 characters'],
    },
    fullDescription: {
      type: String,
      required: [true, 'Full description is required'],
      trim: true,
      maxlength: [8000, 'Full description cannot exceed 8000 characters'],
    },
    images: {
      type: [
        {
          type: String,
          trim: true,
        },
      ],
      default: [],
      validate: {
        validator(arr) {
          return arr.length <= 8;
        },
        message: 'You can upload at most 8 project images',
      },
    },
    technologies: stringList(25, 40, 'technologies'),
    tags: stringList(20, 30, 'tags'),
    githubUrl: urlOrEmpty,
    liveDemoUrl: urlOrEmpty,
    category: {
      type: String,
      enum: {
        values: PROJECT_CATEGORIES,
        message: 'Invalid project category',
      },
      default: 'web',
    },
    viewCount: {
      type: Number,
      default: 0,
      min: 0,
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

projectSchema.index({ clerkId: 1, createdAt: -1 });
projectSchema.index({ category: 1, createdAt: -1 });
projectSchema.index({ technologies: 1 });
projectSchema.index({
  title: 'text',
  shortDescription: 'text',
  tags: 'text',
  technologies: 'text',
});

projectSchema.statics.CATEGORIES = PROJECT_CATEGORIES;

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
