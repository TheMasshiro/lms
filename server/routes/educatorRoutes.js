import express from "express";
import upload from "../configs/multer.js";
import {
  addCourse,
  addStudents,
  deleteStudents,
  educatorDashboardData,
  getEducatorCourses,
  getEducatorStudents,
  getEnrolledStudentsData,
  getStudents,
  studentEnrolledCourses,
  updateRoleToEducator
} from "../controllers/educatorController.js";
import { protectEducator } from "../middlewares/authMiddleware.js";

const educatorRouter = express.Router();

// Add Educator Role
educatorRouter.get("/update-role", updateRoleToEducator);

// Add Student
educatorRouter.post("/add-students", protectEducator, addStudents);

// Remove student
educatorRouter.post("/remove-students", protectEducator, deleteStudents);

// Add Courses
educatorRouter.post(
  "/add-course",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "file" },
    { name: "activity" },
  ]),
  protectEducator,
  addCourse
);

// Get Educator Courses
educatorRouter.get("/courses", protectEducator, getEducatorCourses);
educatorRouter.post("/student-courses", protectEducator, studentEnrolledCourses);

// Get Educator Dashboard Data
educatorRouter.get("/dashboard", protectEducator, educatorDashboardData);

// Get Educator Students Data
educatorRouter.get(
  "/enrolled-students",
  protectEducator,
  getEnrolledStudentsData
);

// Get all students
educatorRouter.get("/students", protectEducator, getStudents);

// Get Educator Students Data
educatorRouter.get("/my-students/", protectEducator, getEducatorStudents);

export default educatorRouter;
