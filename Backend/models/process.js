const mongoose = require("mongoose");
// require("mongoose-type-ethereum-address");

const Schema = mongoose.Schema;

const ProcessSchema = new Schema({
  // Basics
  created_on: { type: Date, default: Date.now(), immutable: true},
  landlord_id: { type: Schema.Types.ObjectId, required:true},
  question: { type: String, maxLength: 200 },
  state: { type: Number, default: 1, enum: [1,2,3]},
  // iExec infos
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