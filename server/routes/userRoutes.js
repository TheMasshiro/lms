import express from "express";
import {
  addCourseCount,
  addEnrollmentCount,
  addUserRating,
  batchEnrollmentCount,
  batchEnrollToCourse,
  enrollToCourse,
  getCourseProgress,
  getUserCourseProgress,
  getUserData,
  purchaseStatus,
  updateRoleToStudent,
  updateUserCourseProgress,
  userEnrolledCourses,
  submitActivity,
  getUserSubmissions,
} from "../controllers/userController.js";
import upload from "../configs/multer.js";

const userRouter = express.Router();

// Get user Data
userRouter.get("/data", getUserData);

userRouter.get("/update-role", updateRoleToStudent);
userRouter.post("/purchase", purchaseStatus);
userRouter.get("/enrolled-courses", userEnrolledCourses);

userRouter.post("/update-course-progress", updateUserCourseProgress);
userRouter.post("/get-course-progress", getUserCourseProgress);
userRouter.post("/get-user-course-progress", getCourseProgress);

userRouter.post("/add-rating", addUserRating);
userRouter.post("/enroll-course", enrollToCourse);

userRouter.post("/add-course-count", addCourseCount);
userRouter.post("/add-enrollment-count", addEnrollmentCount);

userRouter.post("/batch-enroll-course", batchEnrollToCourse);
userRouter.post("/batch-enrollment-count", batchEnrollmentCount);

userRouter.post(
  "/submit-activity",
  upload.single("submission"),
  submitActivity
);
userRouter.get("/submissions/:courseId", getUserSubmissions);

export default userRouter;
