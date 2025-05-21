import { clerkClient } from "@clerk/express";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import Course from "../models/Course.js";
import { Purchase } from "../models/Purchase.js";
import User from "../models/User.js";

// update role to educator
export const updateRoleToEducator = async (req, res) => {
  try {
    const userId = req.auth.userId;

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: "educator",
      },
    });

    res.json({ success: true, message: "Welcome to Learnify" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Add Students to Educator
export const addStudents = async (req, res) => {
  try {
    const { users } = req.body;
    const educatorId = req.auth.userId;

    if (!Array.isArray(users) || users.length === 0) {
      return res.json({ success: false, message: "No students provided." });
    }

    const educator = await User.findById(educatorId);

    if (!educator) {
      return res.json({ success: false, message: "Educator not found" });
    }

    educator.students = educator.students || [];

    const skippedStudents = [];
    const addedStudents = [];

    for (const studentId of users) {
      if (educator.students.includes(studentId)) {
        skippedStudents.push(studentId);
      } else {
        educator.students.push(studentId);
        addedStudents.push(studentId);
      }
    }

    if (addedStudents.length > 0) {
      await educator.save();
    }

    res.json({
      success: true,
      addedStudents,
      skippedStudents,
      message: `Added ${addedStudents.length} student(s). Skipped ${skippedStudents.length} already added.`,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Delete Students from Educator
export const deleteStudents = async (req, res) => {
  try {
    const { users } = req.body;
    const educatorId = req.auth.userId;

    if (!Array.isArray(users) || users.length === 0) {
      return res.json({ success: false, message: "No students provided." });
    }

    const educator = await User.findById(educatorId);

    if (!educator) {
      return res.json({ success: false, message: "Educator not found." });
    }

    educator.students = educator.students || [];

    const skippedStudents = [];
    const removedStudents = [];

    for (const studentId of users) {
      if (!educator.students.includes(studentId)) {
        skippedStudents.push(studentId);
      } else {
        educator.students = educator.students.filter(
          (id) => id.toString() !== studentId.toString()
        );
        removedStudents.push(studentId);
      }
    }

    if (removedStudents.length > 0) {
      await educator.save();
    }

    res.json({
      success: true,
      removedStudents,
      skippedStudents,
      message: `Removed ${removedStudents.length} student(s). Skipped ${skippedStudents.length} not found.`,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get Educator Students
export const getEducatorStudents = async (req, res) => {
  try {
    const educatorId = req.auth.userId;

    const educator = await User.findById(educatorId).populate({
      path: "students",
      options: { sort: { name: 1 } },
    });

    if (!educator) {
      return res.json({ success: false, message: "Educator not found" });
    }

    const students = educator.students.map((student) => ({
      id: student._id,
      name: student.name,
      email: student.email,
      imageUrl: student.imageUrl,
      isMember: student.isMember,
      enrolledCourses: student.enrolledCourses,
      enrollmentCount: student.enrollmentCount,
    }));

    res.json({ success: true, students });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Add New Course
export const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body;

    const files = req.files;
    const imageFile = files.image?.[0];
    const lectureFiles = files.file || [];
    const activityFiles = files.activity || [];

    const educatorId = req.auth.userId;

    if (!imageFile) {
      return res.json({ success: false, message: "Thumbnail Not Attached" });
    }

    const parsedCourseData = await JSON.parse(courseData);
    parsedCourseData.educator = educatorId;

    const existingCourse = await Course.findOne({
      courseCode: parsedCourseData.courseCode,
    });
    if (existingCourse) {
      return res.json({
        success: false,
        message: "Course code already exists. Please choose a different one.",
      });
    }

    let fileIndex = 0;
    for (const chapter of parsedCourseData.courseContent) {
      for (const lecture of chapter.chapterContent) {
        if (lecture.contentType === "file") {
          const file = lectureFiles[fileIndex++];
          if (file) {
            const uploadResult = await cloudinary.uploader.upload(file.path, {
              resource_type: "raw",
              public_id: `${path.parse(file.originalname).name}`,
              access_mode: "public",
              format: "pdf",
              folder: "lecture_files",
            });
            lecture.lectureUrl = uploadResult.secure_url;
          }
        }
      }
    }

    let activityIndex = 0;
    for (const chapter of parsedCourseData.courseContent) {
      for (const activity of chapter.chapterActivities) {
        const file = activityFiles[activityIndex++];
        if (file) {
          const uploadResult = await cloudinary.uploader.upload(file.path, {
            resource_type: "raw",
            public_id: `${path.parse(file.originalname).name}`,
            access_mode: "public",
            format: "pdf",
            folder: "activity_files",
          });
          activity.activityUrl = uploadResult.secure_url;
        }
      }
    }

    const newCourse = await Course.create(parsedCourseData);
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      folder: "thumbnails",
    });
    newCourse.courseThumbnail = imageUpload.secure_url;

    await newCourse.save();

    res.json({ success: true, message: "Course Added" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get Educator Courses
export const getEducatorCourses = async (req, res) => {
  try {
    const educator = req.auth.userId;

    const courses = await Course.find({ educator });

    res.json({ success: true, courses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get enrolled courses of student
export const studentEnrolledCourses = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.json({ success: false, message: "userId is required" });
    }

    const user = await User.findById(userId).populate({
      path: "enrolledCourses",
      select: "-enrolledStudents",
      populate: {
        path: "educator",
        select: "-password",
      },
    });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, enrolledCourses: user.enrolledCourses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get Educator Dashboard Data ( Total Earning, Enrolled Students, No. of Courses)
export const educatorDashboardData = async (req, res) => {
  try {
    const educator = req.auth.userId;

    const courses = await Course.find({ educator });

    const totalCourses = courses.length;

    const courseIds = courses.map((course) => course._id);

    // Calculate total earnings from purchases
    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "paid",
    });

    const totalEarnings = purchases.reduce(
      (sum, purchase) => sum + purchase.amount,
      0
    );

    // Collect unique enrolled student IDs with their course titles
    const enrolledStudentsData = [];
    for (const course of courses) {
      const students = await User.find(
        {
          _id: { $in: course.enrolledStudents },
        },
        "name imageUrl"
      );

      students.forEach((student) => {
        enrolledStudentsData.push({
          courseTitle: course.courseTitle,
          student,
        });
      });
    }

    res.json({
      success: true,
      dashboardData: {
        totalEarnings,
        enrolledStudentsData,
        totalCourses,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get Enrolled Students for All Educator Courses
export const getEnrolledStudentsData = async (req, res) => {
  try {
    const educator = req.auth.userId;

    // Fetch all courses by this educator and populate enrolled students
    // Include the isMember field in the student data
    const courses = await Course.find({ educator }).populate(
      "enrolledStudents",
      "name email imageUrl isMember"
    );

    const enrolledStudents = [];

    courses.forEach((course) => {
      course.enrolledStudents.forEach((student) => {
        enrolledStudents.push({
          student: {
            _id: student._id,
            name: student.name,
            email: student.email,
            imageUrl: student.imageUrl,
            isMember: student.isMember,
          },
          courseTitle: course.courseTitle,
        });
      });
    });

    res.json({
      success: true,
      enrolledStudents,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getStudents = async (req, res) => {
  try {
    const { data } = await clerkClient.users.getUserList({
      orderBy: "+first_name",
    });

    const studentsFromClerk = data.filter(
      (user) => user.publicMetadata?.role === "student"
    );

    const clerkIds = studentsFromClerk.map((student) => student.id);
    const mongoUsers = await User.find({ _id: { $in: clerkIds } });

    const students = studentsFromClerk.map((student) => {
      const mongoUser = mongoUsers.find((u) => u._id === student.id);

      return {
        id: student.id,
        name: `${student.firstName} ${student.lastName}`,
        email: student.emailAddresses[0]?.emailAddress,
        imageUrl: student.imageUrl,
        isMember: mongoUser?.isMember ?? false,
        enrollmentCount: mongoUser?.enrollmentCount ?? 0,
      };
    });

    res.json({
      success: true,
      students,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
