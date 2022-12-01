const mongoose = require("mongoose");
// require("mongoose-type-ethereum-address");

const Schema = mongoose.Schema;

const ProcessSchema = new Schema({
  question: { type: String, required: true, maxLength: 100 },
  state: { type: Number, required: true, default: 1, enum: [1,2,3]},
  //Time stamp could be useful
  //updated: { type: Date, default: Date.now() },
  dataset_address: { type: String},
  applicant_address: { type: String},
  task_id: { type: String},
});

// Virtual for process URL
ProcessSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/${this._id}`;
});

// Export model
module.exports = mongoose.model("Process", ProcessSchema);