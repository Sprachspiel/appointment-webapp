const http = require('http');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

require("dotenv").config();
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");

// MongoDB
var mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
var db = mongoose.connection;

// Express
var app = express();
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use("/availability", require("./routes/availabilityRoute"));
app.use("/reservation", require("./routes/reservationRoute"));

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", _ => {
  console.log("Connected to DB");
});

// SMS messaging

app.get("./routes/reservationRoute/:Appointment.phone")
app.get("./routes/reservationRoute/:Appointment.name")
app.get("./routes/reservationRoute/:day")
var numbersToMessage = [""]

numbersToMessage.forEach(function(number){
  var message = client.messages.create({
    body: '${Appointment.name} has requested an appointment for ${day}. Reply Yes to confirm or No to ask them to reschedule',
    from: '',
    to: number
  })
  .then(message =>  console.log(message.status))
  .done();
});

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/', (req, res) => {
  const twiml = new MessagingResponse();

  if (req.body.Body == 'Yes' || 'yes') {
    twiml.message('Thanks! A confirmation notification has been sent to them.')
    client.messages
    .create({
    body: 'Your appointment for ${day} has been confirmed!',
    from: '',
    to: '${Appointment.phone}'
    });
  } else if (req.body.Body == 'No' || 'no') {
    twiml.message('Sure thing. A request for them to reschedule has been sent.')
    client.messages
    .create({
    body: 'Hey there. Unfortunately, the date and time you have requested for your appointment is unavailable. Please reschedule for another slot.',
    from: '',
    to: '${Appontment.phone}'
    });
  } else {
    twiml.message(
      'Sorry. Can you try again?'
    );
  }

  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});


http.createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337');
});

module.exports = app;
