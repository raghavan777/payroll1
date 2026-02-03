const express = require("express");
const bcrypt = require("bcryptjs");

const router = express.Router();

const auth = require("../middleware/auth");
const User = require("../models/User");
const Employee = require("../models/Employee");
const generateemployeeCode = require("../utils/generateemployeeCode");

/**
 * CREATE EMPLOYEE (WITH LOGIN ACCESS)
 * Super Admin / HR Admin
 */
router.post("/", auth, async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      department,
      designation,
      dateOfJoining
    } = req.body;

    if (!name || !email || !password || !department) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // Prevent duplicate login user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create login user
    const hashedPassword = await bcrypt.hash(password, 10);

    const role = department === "HR" ? "HR_ADMIN" : "EMPLOYEE";

    const permissions =
      role === "HR_ADMIN"
        ? ["manage_users", "manage_statutory"]
        : [];

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      permissions,
      organizationId: req.user.organizationId
    });

    // Create employee record
    const employeeCode = await generateemployeeCode(dateOfJoining);

    const employee = await Employee.create({
      employeeCode,
      name,
      email,
      department,
      designation,
      dateOfJoining,
      organizationId: req.user.organizationId,
      userId: user._id
    });

    res.status(201).json({
      message: "Employee created with login access",
      employee
    });

  } catch (error) {
    console.error("EMPLOYEE CREATE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET ALL EMPLOYEES (ORG-WISE)
 */
router.get("/", auth, async (req, res) => {
  try {
    const employees = await Employee.find({
      organizationId: req.user.organizationId
    }).sort({ createdAt: -1 });

    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
