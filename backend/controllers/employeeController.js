const Employee = require("../models/Employee");

const generateEmployeeCode = async () => {
  const count = await Employee.countDocuments();
  return `EMP${String(count + 1).padStart(3, "0")}`;
};

exports.createEmployee = async (req, res) => {
  try {
    const employeeCode = await generateEmployeeCode();

    const employee = await Employee.create({
      employeeCode,
      name: req.body.name,
      email: req.body.email,
      organizationId: req.user.organizationId
    });

    res.status(201).json(employee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
