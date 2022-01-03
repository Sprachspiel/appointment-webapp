// Processes allTables JSON file into Mongo table objects

var mongoose = require("mongoose");
const Slot = require("../models/slot").model;
const fs = require("fs");

let slotData = fs.readFileSync(__dirname + "/allSlots.json");
slotData = JSON.parse(slotData).slots;

let allSlots = [];
slotData.forEach(slot => {
  allSlots.push(new Slot(slot));
});

module.exports = allSlots;
