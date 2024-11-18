const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middlewares/authMiddleware");
const rbacMiddleware = require("../middlewares/rbacMiddleware");
const {
  registerController,
  loginController,
  postCourseController,
  getAllCoursesUserController,
  deleteCourseController,
  enrolledCourseController,
  sendCourseContentController,
  completeSectionController,
  sendAllCoursesUserController,
} = require("../controllers/userController");

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.env.UPLOAD_PATH || "uploads/"); // Use path from .env or default to "uploads/"
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Original file name
  },
});

const upload = multer({
  storage: storage,
});

// Route for user registration
router.post("/register", registerController);

// Route for user login
router.post("/login", loginController);

// Route for adding a course (only accessible by instructors)
router.post(
  "/addcourse",
  authMiddleware,
  rbacMiddleware(["instructor"]),  // Only instructors can add courses
  upload.array("S_content"), // Expecting an array of files
  postCourseController
);

// Route for retrieving all courses (accessible by any authenticated user)
router.get("/getallcourses", getAllCoursesUserController);

// Route for retrieving courses created by a specific teacher (only accessible by instructors)
router.get(
  "/getallcoursesteacher",
  authMiddleware,
  rbacMiddleware(["instructor"]),  // Only instructors can view their own courses
  getAllCoursesUserController
);

// Route for deleting a course (only accessible by instructors)
router.delete(
  "/deletecourse/:courseid",
  authMiddleware,
  rbacMiddleware(["instructor"]), // Only instructors can delete courses
  deleteCourseController
);

// Route for enrolling a user in a course (only accessible by students)
router.post(
  "/enrolledcourse/:courseid",
  authMiddleware,
  rbacMiddleware(["student"]), // Only students can enroll in courses
  enrolledCourseController
);

// Route for fetching content of a specific course (only accessible by students)
router.get(
  "/coursecontent/:courseid",
  authMiddleware,
  rbacMiddleware(["student"]), // Only students can view course content
  sendCourseContentController
);

// Route for marking a module as completed (only accessible by students)
router.post(
  "/completemodule",
  authMiddleware,
  rbacMiddleware(["student"]), // Only students can mark modules as complete
  completeSectionController
);

// Route for fetching all courses available to a user (accessible by any authenticated user)
router.get(
  "/getallcoursesuser",
  authMiddleware,
  sendAllCoursesUserController
);

module.exports = router;
