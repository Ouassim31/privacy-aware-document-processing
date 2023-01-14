const mongoose = require("mongoose");
require('mongoose-type-email');

const Schema = mongoose.Schema;

const ProcessSchema = new Schema({
  // Basics
  created_on: { type: Date, immutable: true },
  landlord_id: { type: mongoose.SchemaTypes.Email, required: true },
  process_state: { type: Number, default: 1, enum: [1, 2, 3] },
  description: { type: String },
  applicant_id: { type: mongoose.SchemaTypes.Email },
  dataset_address: { type: String },
  task_id: { type: String },
});

// Export model
module.exports = mongoose.model("Process", ProcessSchema);