const User = require("../models/userModel");
const Course = require("../models/courseModel");

// Controller to fetch all users (admin only)
const getAllUsersController = async (req, res) => {
  try {
    // Fetch all users, excluding password
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
};

// Controller to fetch all courses (admin only)
const getAllCoursesController = async (req, res) => {
  try {
    // Fetch all courses
    const courses = await Course.find().populate("instructorId", "name email");
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch courses", error: err.message });
  }
};

// Controller to delete a course by ID (admin only)
const deleteCourseController = async (req, res) => {
  const { courseid } = req.params;
  
  try {
    // Check if course exists
    const course = await Course.findById(courseid);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    
    // Delete the course
    await course.remove();
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete course", error: err.message });
  }
};

// Controller to delete a user by ID (admin only)
const deleteUserController = async (req, res) => {
  const { userid } = req.params;

  try {
    // Check if user exists
    const user = await User.findById(userid);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Delete the user
    await user.remove();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user", error: err.message });
  }
};

module.exports = {
  getAllUsersController,
  getAllCoursesController,
  deleteCourseController,
  deleteUserController,
};
