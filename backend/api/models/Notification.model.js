    import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
  {
    /**
     * WHO should receive this notification
     */
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /**
     * WHAT happened
     */
    type: {
      type: String,
      enum: ["VIDEO_UPLOADED", "LIVE_STREAM_STARTED"],
      required: true,
    },

    /**
     * ENTITY references
     */
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
      required: function () {
        return this.type === "VIDEO_UPLOADED";
      },
    },

    channel: {
      type: Schema.Types.ObjectId,
      ref: "User", // channel owner
      required: true,
    },
    streamTitle: {
      type: String,
      trim: true,
      default: "",
    },
    streamUrl: {
      type: String,
      trim: true,
      default: "",
    },

    /**
     * DISPLAY data (denormalized for speed)
     */
    

    /**
     * STATE
     */
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * 🔥 Performance index
 */
notificationSchema.index({ user: 1, createdAt: -1 });

export const Notification = mongoose.model(
  "Notification",
  notificationSchema
);
