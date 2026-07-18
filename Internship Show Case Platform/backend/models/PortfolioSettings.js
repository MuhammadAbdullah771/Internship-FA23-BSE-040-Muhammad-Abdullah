const mongoose = require('mongoose');

const PORTFOLIO_THEMES = ['minimal', 'professional', 'creative', 'bold'];
const PORTFOLIO_STATUSES = ['draft', 'published'];

const hexColor = {
  type: String,
  default: '#1d6f52',
  trim: true,
  validate: {
    validator(value) {
      return !value || /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value);
    },
    message: 'Primary color must be a valid hex color',
  },
};

const sectionVisibilitySchema = new mongoose.Schema(
  {
    about: { type: Boolean, default: true },
    skills: { type: Boolean, default: true },
    projects: { type: Boolean, default: true },
    contact: { type: Boolean, default: true },
  },
  { _id: false }
);

const aboutCustomizationSchema = new mongoose.Schema(
  {
    headline: {
      type: String,
      default: '',
      trim: true,
      maxlength: [160, 'About headline is too long'],
    },
    intro: {
      type: String,
      default: '',
      trim: true,
      maxlength: [1200, 'About intro is too long'],
    },
    showEducation: { type: Boolean, default: true },
    showLocation: { type: Boolean, default: true },
  },
  { _id: false }
);

const skillsCustomizationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: 'Skills',
      trim: true,
      maxlength: [80, 'Skills title is too long'],
    },
    layout: {
      type: String,
      enum: ['chips', 'list'],
      default: 'chips',
    },
  },
  { _id: false }
);

const projectsCustomizationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: 'Projects',
      trim: true,
      maxlength: [80, 'Projects title is too long'],
    },
    showTechnologies: { type: Boolean, default: true },
  },
  { _id: false }
);

const contactCustomizationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: 'Get in touch',
      trim: true,
      maxlength: [80, 'Contact title is too long'],
    },
    message: {
      type: String,
      default: '',
      trim: true,
      maxlength: [500, 'Contact message is too long'],
    },
    showEmail: { type: Boolean, default: true },
    showGithub: { type: Boolean, default: true },
    showLinkedin: { type: Boolean, default: true },
  },
  { _id: false }
);

const customizationSchema = new mongoose.Schema(
  {
    about: { type: aboutCustomizationSchema, default: () => ({}) },
    skills: { type: skillsCustomizationSchema, default: () => ({}) },
    projects: { type: projectsCustomizationSchema, default: () => ({}) },
    contact: { type: contactCustomizationSchema, default: () => ({}) },
  },
  { _id: false }
);

const portfolioSettingsSchema = new mongoose.Schema(
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
    /**
     * Public shareable slug used in /portfolio/:username
     */
    username: {
      type: String,
      trim: true,
      lowercase: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
      match: [
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        'Username may only contain lowercase letters, numbers, and hyphens',
      ],
      sparse: true,
      unique: true,
      index: true,
    },
    theme: {
      type: String,
      enum: {
        values: PORTFOLIO_THEMES,
        message: 'Invalid portfolio theme',
      },
      default: 'professional',
    },
    primaryColor: hexColor,
    sectionVisibility: {
      type: sectionVisibilitySchema,
      default: () => ({}),
    },
    projectOrder: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Project',
        },
      ],
      default: [],
    },
    customHeadline: {
      type: String,
      default: '',
      trim: true,
      maxlength: [160, 'Custom headline cannot exceed 160 characters'],
    },
    portfolioStatus: {
      type: String,
      enum: {
        values: PORTFOLIO_STATUSES,
        message: 'Portfolio status must be draft or published',
      },
      default: 'draft',
    },
    customization: {
      type: customizationSchema,
      default: () => ({}),
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

portfolioSettingsSchema.statics.THEMES = PORTFOLIO_THEMES;
portfolioSettingsSchema.statics.STATUSES = PORTFOLIO_STATUSES;

const PortfolioSettings = mongoose.model(
  'PortfolioSettings',
  portfolioSettingsSchema
);

module.exports = PortfolioSettings;
