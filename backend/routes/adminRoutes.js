const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const rbacMiddleware = require("../middlewares/rbacMiddleware");
const {
  getAllUsersController,
  getAllCoursesController,
  deleteCourseController,
  deleteUserController,
} = require("../controllers/adminController");

const router = express.Router();

router.get(
  "/getallusers",
  authMiddleware,
  rbacMiddleware(["admin"]),
  getAllUsersController
);

router.get(
  "/getallcourses",
  authMiddleware,
  rbacMiddleware(["admin"]),
  getAllCoursesController
);

router.delete(
  "/deletecourse/:courseid",
  authMiddleware,
  rbacMiddleware(["admin"]),
  deleteCourseController
);

router.delete(
  "/deleteuser/:userid",
  authMiddleware,
  rbacMiddleware(["admin"]),
  deleteUserController
);

module.exports = router;
