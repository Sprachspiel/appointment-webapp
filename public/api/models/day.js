var mongoose = require("mongoose");
const slotSchema = require("./slot").schema;

var daySchema = new mongoose.Schema({
  date: Date,
  slots: [slotSchema]
});
var Day = mongoose.model("Day", daySchema);

module.exports.model = Day;
module.exports.schema = daySchema;
