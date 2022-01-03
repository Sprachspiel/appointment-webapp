var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");

const Day = require("../models/day").model;
const Appointment = require("../models/appointment").model;

// Parameters:
// {
//   "date": String ("Dec 02 2019 06:00"),
//   "slot": slot id,
// 	"name": String,
// 	"phone": String,
// 	"email": String
// }

router.post("/", function(req, res, next) {
  Day.find({ date: req.body.date }, (err, days) => {
    if (!err) {
      if (days.length > 0) {
        let day = days[0];
        day.slots.forEach(slots => {
          if (slot._id == req.body.slot) {
            // The correct slot is slot
            slot.appointment = new Appointment({
              name: req.body.name,
              phone: req.body.phone,
              email: req.body.email
            });
            slot.isAvailable = false;
            day.save(err => {
              if (err) {
                console.log(err);
              } else {
                console.log("Reserved");
                res.status(200).send("Booked Appointment");
              }
            });
          }
        });
      } else {
        console.log("Day not found");
      }
    }
  });
});

module.exports = router;
