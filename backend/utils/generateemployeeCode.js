const EmployeeCounter = require("../models/EmployeeCounter");

async function generateemployeeCode(joiningDate) {
  const year = new Date(joiningDate).getFullYear();

  const counter = await EmployeeCounter.findOneAndUpdate(
    { year },
    { $inc: { count: 1 } },
    { new: true, upsert: true }
  );

  const paddedCount = String(counter.count).padStart(4, "0");
  return `EMP-${year}-${paddedCount}`;
}

module.exports = generateemployeeCode;
