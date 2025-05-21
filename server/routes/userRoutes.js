import express from "express";
import {
  addCourseCount,
  addEnrollmentCount,
  addUserRating,
  batchEnrollmentCount,
  batchEnrollToCourse,
  enrollToCourse,
  getUserCourseProgress,
  getUserData,
  purchaseStatus,
  updateRoleToStudent,
  updateUserCourseProgress,
  userEnrolledCourses
} from "../controllers/userController.js";

const userRouter = express.Router();

// Get user Data
userRouter.get("/data", getUserData);

userRouter.get("/update-role", updateRoleToStudent);
userRouter.post("/purchase", purchaseStatus);
userRouter.get("/enrolled-courses", userEnrolledCourses);

userRouter.post("/update-course-progress", updateUserCourseProgress);
userRouter.post("/get-course-progress", getUserCourseProgress);

userRouter.post("/add-rating", addUserRating);
userRouter.post("/enroll-course", enrollToCourse);

userRouter.post("/add-course-count", addCourseCount);
userRouter.post("/add-enrollment-count", addEnrollmentCount);

userRouter.post("/batch-enroll-course", batchEnrollToCourse);
userRouter.post("/batch-enrollment-count", batchEnrollmentCount);

export default userRouter;
