const mongoose = require('mongoose');

const VIEW_TYPES = ['portfolio', 'project'];

const viewEventSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: VIEW_TYPES,
      required: true,
      index: true,
    },
    ownerClerkId: {
      type: String,
      required: true,
      index: true,
    },
    /** Portfolio username or project ObjectId as string */
    targetKey: {
      type: String,
      required: true,
      index: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null,
      index: true,
    },
    /** Coarse fingerprint for light dedupe (hashed IP + UA day) — not PII storage */
    visitorKey: {
      type: String,
      default: '',
      trim: true,
      maxlength: 80,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

viewEventSchema.index({ ownerClerkId: 1, createdAt: -1 });
viewEventSchema.index({ type: 1, targetKey: 1, createdAt: -1 });
viewEventSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 180 });

viewEventSchema.statics.TYPES = VIEW_TYPES;

const ViewEvent = mongoose.model('ViewEvent', viewEventSchema);

module.exports = ViewEvent;
