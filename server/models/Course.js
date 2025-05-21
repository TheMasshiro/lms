import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
  {
    lectureId: { type: String, required: true },
    lectureTitle: { type: String, required: true },
    lectureDuration: { type: Number, required: true },
    lectureUrl: { type: String, required: true },
    isPreviewFree: { type: Boolean, required: true },
    lectureOrder: { type: Number, required: true },
    contentType: { type: String, required: true },
  },
  { _id: false }
);

const activitySchema = new mongoose.Schema(
  {
    activityId: { type: String, required: true },
    activityTitle: { type: String, required: true },
    activityOrder: { type: Number, required: true },
    activityUrl: { type: String, required: true },
  },
  { _id: false }
);

const chapterSchema = new mongoose.Schema(
  {
    chapterId: { type: String, required: true },
    chapterOrder: { type: Number, required: true },
    chapterTitle: { type: String, required: true },
    chapterContent: [lectureSchema],
    chapterActivities: [activitySchema],
  },
  { _id: false }
);



const courseSchema = new mongoose.Schema(
  {
    courseTitle: { type: String, required: true },
    courseCode: { type: String, required: true, unique: true },
    courseDescription: { type: String, required: true },
    courseThumbnail: { type: String },
    isPublished: { type: Boolean, default: true },
    courseContent: [chapterSchema],
    educator: {
      type: String,
      ref: "User",
      required: true,
    },
    courseRatings: [
      {
        userId: { type: String },
        rating: { type: Number, min: 1, max: 5 },
      },
    ],
    enrolledStudents: [
      {
        type: String,
        ref: "User",
      },
    ],
  },
  { timestamps: true, minimize: false }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;
