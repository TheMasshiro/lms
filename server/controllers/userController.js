import Course from "../models/Course.js";
import { CourseProgress } from "../models/CourseProgress.js";
import { Purchase } from "../models/Purchase.js";
import User from "../models/User.js";
import axios from "axios";
import { clerkClient } from "@clerk/express";

// update role to student
export const updateRoleToStudent = async (req, res) => {
  try {
    const userId = req.auth.userId;

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: "student",
      },
    });

    res.json({ success: true, message: "Welcome to Learnify" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const batchEnrollToCourse = async (req, res) => {
  try {
    const { courseCode, userId } = req.body;

    if (!courseCode || !userId || !Array.isArray(userId)) {
      return res.json({
        success: false,
        message: "Course Code and User ID are required",
      });
    }

    const courseData = await Course.findOne({ courseCode });
    if (!courseData) {
      return res.json({ success: false, message: "Course not found" });
    }

    const alreadyEnrolled = [];
    const successfullyEnrolled = [];

    for (const userIdElement of userId) {
      const userData = await User.findById(userIdElement);
      if (!userData) {
        continue;
      }

      const alreadyInCourse = userData.enrolledCourses.includes(courseData._id);
      if (alreadyInCourse) {
        alreadyEnrolled.push(userData.id);
        continue;
      }

      courseData.enrolledStudents.push(userData._id);
      userData.enrolledCourses.push(courseData._id);

      await userData.save();
      successfullyEnrolled.push(userData.email);
    }

    await courseData.save();

    res.json({
      success: true,
      enrolled: successfullyEnrolled,
      skipped: alreadyEnrolled,
      message: `Enrolled ${successfullyEnrolled.length} student(s). Skipped ${alreadyEnrolled.length} already enrolled.`,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Enroll User to Course
export const enrollToCourse = async (req, res) => {
  try {
    const { courseCode } = req.body;

    if (!courseCode) {
      return res.json({ success: false, message: "Course Code is required" });
    }

    const userId = req.auth.userId;

    const courseData = await Course.findOne({ courseCode });
    const userData = await User.findById(userId);

    if (!courseData || !userData) {
      return res.json({ success: false, message: "Course or User not found" });
    }

    if (userData.enrolledCourses.includes(courseData._id)) {
      return res.json({ success: false, message: "Already Enrolled" });
    }

    courseData.enrolledStudents.push(userData);
    await courseData.save();

    userData.enrolledCourses.push(courseData._id);
    await userData.save();

    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get User Data
export const getUserData = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User Not Found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get Url Endpoint for Success URL
// This function determines the success URL based on the user's role
const getSuccessUrl = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const response = await clerkClient.users.getUser(userId);
    if (response.publicMetadata.role !== "educator") {
      return "student";
    } else {
      return "educator";
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get Role Price
// This function determines the price based on the user's role
const rolePrice = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const response = await clerkClient.users.getUser(userId);
    if (response.publicMetadata.role !== "educator") {
      return 99;
    } else {
      return 199;
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const roleName = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const response = await clerkClient.users.getUser(userId);
    if (response.publicMetadata.role !== "educator") {
      return "Lifetime Access as a Student";
    } else {
      return "Lifetime Access as an Educator";
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Purchase Access
export const purchaseStatus = async (req, res) => {
  try {
    const { origin } = req.headers;
    const userId = req.auth.userId;
    const userData = await User.findById(userId);

    if (!userData) {
      return res.json({ success: false, message: "Data Not Found" });
    }

    const rolePriceValue = await rolePrice(req, res);
    const computedAmount = Math.round(rolePriceValue * 100);

    const purchaseData = {
      userId,
      amount: rolePriceValue,
    };

    const roleNameValue = await roleName(req, res);

    const newPurchase = await Purchase.create(purchaseData);
    const currency = (process.env.CURRENCY || "PHP").toUpperCase();
    const url_endpoint = await getSuccessUrl(req, res);

    const lineItems = [
      {
        currency: currency,
        amount: computedAmount,
        description: roleNameValue,
        name: roleNameValue,
        quantity: 1,
      },
    ];

    const checkoutSessionRes = await axios.post(
      "https://api.paymongo.com/v1/checkout_sessions",
      {
        data: {
          attributes: {
            billing: {
              name: userData.name || "Full Name",
              email: userData.email || "email@example.com",
            },
            description: newPurchase._id.toString(),
            send_email_receipt: true,
            show_description: true,
            show_line_items: true,
            line_items: lineItems,
            payment_method_types: ["gcash", "card", "paymaya", "grab_pay"],
            cancel_url: `${origin}/`,
            success_url: `${origin}/` + url_endpoint,
            metadata: {
              purchaseId: newPurchase._id.toString(),
            },
          },
        },
      },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            process.env.PAYMONGO_SECRET_KEY + ":"
          ).toString("base64")}`,
          "Content-Type": "application/json",
        },
      }
    );

    const sessionUrl = checkoutSessionRes.data.data.attributes.checkout_url;
    res.json({ success: true, session_url: sessionUrl });
  } catch (error) {
    console.error("Purchase Error:", error?.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error?.response?.data?.errors?.[0]?.detail || error.message,
      errors: error?.response?.data?.errors || [],
    });
  }
};

// Users Enrolled Courses With Lecture Links
export const userEnrolledCourses = async (req, res) => {
  try {
    const userId = req.auth.userId;

    const user = await User.findById(userId).populate({
      path: "enrolledCourses",
      select: "-enrolledStudents",
      populate: {
        path: "educator",
        select: "-password",
      },
    });

    res.json({ success: true, enrolledCourses: user.enrolledCourses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Update User Course Progress
export const updateUserCourseProgress = async (req, res) => {
  try {
    const userId = req.auth.userId;

    const { courseId, lectureId } = req.body;

    const progressData = await CourseProgress.findOne({ userId, courseId });

    if (progressData) {
      if (progressData.lectureCompleted.includes(lectureId)) {
        return res.json({
          success: true,
          message: "Lecture Already Completed",
        });
      }

      progressData.lectureCompleted.push(lectureId);
      await progressData.save();
    } else {
      await CourseProgress.create({
        userId,
        courseId,
        lectureCompleted: [lectureId],
      });
    }

    res.json({ success: true, message: "Progress Updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// get User Course Progress
export const getUserCourseProgress = async (req, res) => {
  try {
    const userId = req.auth.userId;

    const { courseId } = req.body;

    const progressData = await CourseProgress.findOne({ userId, courseId });

    res.json({ success: true, progressData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// get specific User Course Progress
export const getCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    if (!userId || !courseId) {
      return res.json({ 
        success: false, 
        message: "Both userId and courseId are required" 
      });
    }

    const progressData = await CourseProgress.findOne({ userId, courseId });

    res.json({ success: true, progressData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Add User Ratings to Course
export const addUserRating = async (req, res) => {
  const userId = req.auth.userId;
  const { courseId, rating } = req.body;

  // Validate inputs
  if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
    return res.json({ success: false, message: "InValid Details" });
  }

  try {
    // Find the course by ID
    const course = await Course.findById(courseId);

    if (!course) {
      return res.json({ success: false, message: "Course not found." });
    }

    const user = await User.findById(userId);

    if (!user || !user.enrolledCourses.includes(courseId)) {
      return res.json({
        success: false,
        message: "User has not purchased this course.",
      });
    }

    // Check is user already rated
    const existingRatingIndex = course.courseRatings.findIndex(
      (r) => r.userId === userId
    );

    if (existingRatingIndex > -1) {
      // Update the existing rating
      course.courseRatings[existingRatingIndex].rating = rating;
    } else {
      // Add a new rating
      course.courseRatings.push({ userId, rating });
    }

    await course.save();

    return res.json({ success: true, message: "Rating added" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const addCourseCount = async (req, res) => {
  try {
    const userId = req.auth.userId;

    const userData = await User.findById(userId);

    if (!userData) {
      return res.json({ success: false, message: "User Not Found" });
    }

    // If the user is a member, no message needed, just proceed
    if (userData.isMember) {
      await userData.save();
      return res.json({
        success: true,
      });
    }

    // Increment the courses count
    userData.coursesCount += 1;

    const trialLimit = 3;
    const coursesLeft = trialLimit - userData.coursesCount;

    // Check if the user has reached the trial limit
    if (coursesLeft > 0) {
      await userData.save();
      res.json({
        success: true,
        message: `You have ${coursesLeft} courses left in your trial.`,
      });
    } else {
      await userData.save();
      res.json({
        success: false,
        message: "You have reached the maximum course limit for your trial.",
      });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const addEnrollmentCount = async (req, res) => {
  try {
    const userId = req.auth.userId;

    const userData = await User.findById(userId);

    if (!userData) {
      return res.json({ success: false, message: "User Not Found" });
    }

    if (userData.isMember) {
      await userData.save();
      return res.json({
        success: true,
      });
    }

    userData.enrollmentCount += 1;

    const trialLimit = 3;
    const enrollmentsLeft = trialLimit - userData.enrollmentCount;

    if (enrollmentsLeft > 0) {
      await userData.save();
      res.json({
        success: true,
        message: `You have ${enrollmentsLeft} enrollments left in your trial.`,
      });
    } else {
      await userData.save();
      res.json({
        success: false,
        message:
          "You have reached the maximum enrollment limit for your trial.",
      });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Batch Enrollment Count
export const batchEnrollmentCount = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId || !Array.isArray(userId)) {
      return res.json({ success: false, message: "User ID is required" });
    }

    const userData = await User.findById(userId[0]);
    if (!userData) {
      return res.json({ success: false, message: "User Not Found" });
    }

    if (userData.isMember) {
      await userData.save();
      return res.json({
        success: true,
      });
    }

    userData.enrollmentCount += 1;

    const trialLimit = 3;
    const enrollmentsLeft = trialLimit - userData.enrollmentCount;

    if (enrollmentsLeft > 0) {
      await userData.save();
      res.json({
        success: true,
        message: `The user has ${enrollmentsLeft} enrollments left in their trial.`,
      });
    } else {
      await userData.save();
      res.json({
        success: false,
        message:
          "The student has reached the maximum enrollment limit for their trial.",
      });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
