const User = require("../models/userModel");
const Course = require("../models/courseModel");

// Controller for user registration
const registerController = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if the email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Create new user
    const newUser = new User({ name, email, password, role });
    await newUser.save();
    
    res.status(201).json({
      message: "User registered successfully",
      user: { name: newUser.name, email: newUser.email, role: newUser.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to register user", error: err.message });
  }
};

// Controller for user login
const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Send back user details (excluding password)
    res.status(200).json({
      message: "Login successful",
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to login", error: err.message });
  }
};

// Controller for adding a course (only for instructors)
const postCourseController = async (req, res) => {
  const { title, description, price, duration, category } = req.body;
  const instructorId = req.user.id; // Instructor's ID from JWT payload

  try {
    const newCourse = new Course({
      title,
      description,
      price,
      duration,
      category,
      instructorId,
      content: req.files.map((file) => ({
        title: file.originalname,
        type: "video", // assuming all files are video for simplicity
        url: file.path,
      })),
    });

    await newCourse.save();
    res.status(201).json({ message: "Course added successfully", course: newCourse });
  } catch (err) {
    res.status(500).json({ message: "Failed to add course", error: err.message });
  }
};

// Controller to get all courses (accessible to all authenticated users)
const getAllCoursesUserController = async (req, res) => {
  try {
    const courses = await Course.find().populate("instructorId", "name email");
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch courses", error: err.message });
  }
};

// Controller to delete a course (only for instructors)
const deleteCourseController = async (req, res) => {
  const { courseid } = req.params;
  const instructorId = req.user.id; // Instructor's ID from JWT payload

  try {
    const course = await Course.findById(courseid);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    
    if (course.instructorId.toString() !== instructorId) {
      return res.status(403).json({ message: "You can only delete your own courses" });
    }

    await course.remove();
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete course", error: err.message });
  }
};

// Controller to enroll in a course (only for students)
const enrolledCourseController = async (req, res) => {
  const { courseid } = req.params;
  const studentId = req.user.id; // Student's ID from JWT payload

  try {
    const course = await Course.findById(courseid);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (student.enrolledCourses.includes(courseid)) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    student.enrolledCourses.push(courseid);
    await student.save();

    res.status(200).json({ message: "Successfully enrolled in the course" });
  } catch (err) {
    res.status(500).json({ message: "Failed to enroll in the course", error: err.message });
  }
};

// Controller for fetching course content (only for students)
const sendCourseContentController = async (req, res) => {
  const { courseid } = req.params;
  const studentId = req.user.id; // Student's ID from JWT payload

  try {
    const course = await Course.findById(courseid);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if student is enrolled in the course
    const student = await User.findById(studentId);
    if (!student.enrolledCourses.includes(courseid)) {
      return res.status(403).json({ message: "You are not enrolled in this course" });
    }

    res.status(200).json(course.content);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch course content", error: err.message });
  }
};

// Controller to mark module as completed (only for students)
const completeSectionController = async (req, res) => {
  const { courseid, sectionId } = req.body;
  const studentId = req.user.id; // Student's ID from JWT payload

  try {
    const course = await Course.findById(courseid);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const student = await User.findById(studentId);
    if (!student.enrolledCourses.includes(courseid)) {
      return res.status(403).json({ message: "You are not enrolled in this course" });
    }

    // Mark the section as completed (you could add logic to store progress)
    // For simplicity, we're just responding with a success message
    res.status(200).json({ message: `Module ${sectionId} marked as completed` });
  } catch (err) {
    res.status(500).json({ message: "Failed to mark module as completed", error: err.message });
  }
};

// Controller to get all courses available to the user
const sendAllCoursesUserController = async (req, res) => {
  try {
    const courses = await Course.find().populate("instructorId", "name email");
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch courses", error: err.message });
  }
};

module.exports = {
  registerController,
  loginController,
  postCourseController,
  getAllCoursesUserController,
  deleteCourseController,
  enrolledCourseController,
  sendCourseContentController,
  completeSectionController,
  sendAllCoursesUserController,
};
