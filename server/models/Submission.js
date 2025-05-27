import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    student: {
      type: String,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    activityId: {
      type: String,
      required: true,
    },
    submissionUrl: { type: String, required: true },
    status: {
      type: String,
      enum: ["submitted", "graded"],
      default: "submitted",
    },
    grade: {
      type: Number,
      min: 0,
      max: 100,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    gradedAt: {
      type: Date,
    },
    isLateSubmission: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Submission = mongoose.model("Submission", submissionSchema);

export default Submission;
