const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const LandlordSchema = new Schema({
  username: { type: String, required: true, unique: true, maxLength: 100 }
});

// Export model
module.exports = mongoose.model("Landlord", LandlordSchema);