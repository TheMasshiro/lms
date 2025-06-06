import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    imageUrl: { type: String, required: true },
    isMember: { type: Boolean, default: false, required: true },
    coursesCount: { type: Number, default: 0, required: true },
    enrollmentCount: { type: Number, default: 0, required: true },
    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    students: [
      {
        type: String,
        ref: "User",
      },
    ],
  },

  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
