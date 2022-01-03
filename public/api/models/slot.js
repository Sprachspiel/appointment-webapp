var mongoose = require("mongoose");

const appointmentSchema = require("./appointment").schema;

var slotSchema = new mongoose.Schema({
  name: String,
  capacity: Number,
  isAvailable: Boolean,
  appointment: {
    required: false,
    type: appointmentSchema
  }
});
var Slot = mongoose.model("Slot", slotSchema);

module.exports.model = Slot;
module.exports.schema = slotSchema;
