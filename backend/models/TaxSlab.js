const mongoose = require("mongoose");

const taxSlabSchema = new mongoose.Schema({
  country: { type: String, required: true },
  state: { type: String, required: true },
  minIncome: Number,
  maxIncome: Number,
  taxPercentage: Number,
});

// Prevent OverwriteModelError
module.exports = mongoose.models.TaxSlab || mongoose.model("TaxSlab", taxSlabSchema);
