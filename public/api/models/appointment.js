var mongoose = require("mongoose");

var appointmentSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String
});
var Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports.model = Appointment;
module.exports.schema = appointmentSchema;
