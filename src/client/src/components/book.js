import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
  Button
} from "reactstrap";

import Slot from "./slot";
import { Routes, Route, useParams, useNavigate } from "react-router-dom";
import ThankYou from "./thankYou";
export default props => {
  const [totalSlots, setTotalSlots] = useState([]);

  // User's selections
  const [selection, setSelection] = useState({
    slot: {
      name: null,
      id: null
    },
    date: new Date(),
    time: null,
    size: 0
  });

  const navigate = useNavigate();

  // User's booking details
  const [booking, setBooking] = useState({
    name: "",
    phone: "",
    email: ""
  });

  // List of potential times
  const [times] = useState([
    "9AM",
    "10AM",
    "11AM",
    "12PM",
    "1PM",
    "2PM",
    "3PM",
    "4PM",
    "5PM"
  ]);
  // Basic reservation "validation"
  const [appointmentError, setAppointmentError] = useState(false);

  const getDate = _ => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    const date =
      months[selection.date.getMonth()] +
      " " +
      selection.date.getDate() +
      " " +
      selection.date.getFullYear();
    let time = selection.time.slice(0, -2);
    time = selection.time > 12 ? time + 12 + ":00" : time + ":00";
    console.log(time);
    const datetime = new Date(date + " " + time);
    return datetime;
  };

  const getEmptySlots = _ => {
    let slots = totalSlots.filter(slot => slot.isAvailable);
    return slots.length;
  };

  useEffect(() => {
    // Check availability of tables from DB when a date and time is selected
    if (selection.time && selection.date) {
      (async _ => {
        let datetime = getDate();
        let res = await fetch("http://localhost:3005/availability", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            date: datetime
          })
        });
        res = await res.json();
        // Filter available tables with location and group size criteria
        let slots = res.slots.filter(
          slot =>
            (selection.size > 0 ? slot.capacity >= selection.size : true) 
          
        );
        setTotalSlots(slots);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection.time, selection.date, selection.size,]);

  // Make the reservation if all details are filled out
  const reserve = async _ => {
    if (
      (booking.name.length === 0) |
      (booking.phone.length === 0) |
      (booking.email.length === 0)
    ) {
      console.log("Incomplete Details");
      setAppointmentError(true);
    } else {
      const datetime = getDate();
      let res = await fetch("http://localhost:3005/reservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...booking,
          date: datetime,
          slot: selection.slot.id
        })
      });
      res = await res.text();
      console.log("Appointment: " + res);
      function Thanks() {
        return (
          <div>
            <Routes>
              <Route path="/" element={<ThankYou />} />
            </Routes>
          </div>
        );
      }
    }
  };

  // Clicking on a table sets the selection state
  const selectSlot = (slot_name, slot_id) => {
    setSelection({
      ...selection,
      slot: {
        name: slot_name,
        id: slot_id
      }
    });
  };

  // Generate party size dropdown
  const getSizes = _ => {
    let newSizes = [];

    for (let i = 1; i < 8; i++) {
      newSizes.push(
        <DropdownItem
          key={i}
          className="booking-dropdown-item"
          onClick={e => {
            let newSel = {
              ...selection,
              slot: {
                ...selection.slot
              },
              size: i
            };
            setSelection(newSel);
          }}
        >
          {i}
        </DropdownItem>
      );
    }
    return newSizes;
  };

  const getTimes = _ => {
    let newTimes = [];
    times.forEach(time => {
      newTimes.push(
        <DropdownItem
          key={time}
          className="booking-dropdown-item"
          onClick={_ => {
            let newSel = {
              ...selection,
              slot: {
                ...selection.slot
              },
              time: time
            };
            setSelection(newSel);
          }}
        >
          {time}
        </DropdownItem>
      );
    });
    return newTimes;
  };


  // Generating tables from available tables state
  const getSlots = _ => {
    console.log("Getting slots");
    if (getEmptySlots() > 0) {
      let slots = [];
      totalSlots.forEach(slot => {
        if (slot.isAvailable) {
          slots.push(
            <Slot
              key={slot._id}
              id={slot._id}
              size={slot.capacity}
              name={slot.name}
              empty
              selectSlot={selectSlot}
            />
          );
        } else {
          slots.push(
            <Slot
              key={slot._id}
              id={slot._id}
              size={slot.capacity}
              name={slot.name}
              selectSlot={selectSlot}
            />
          );
        }
      });
      return slots;
    }
  };

  return (
    <div>
      <Row noGutters className="text-center align-items-center">
        <Col>
          <p className="Appointments">
            {!selection.slot.id ? "Book a Session" : "Confirm Appointment"}
        
          </p>
          <p className="selected-slot">
            {selection.slot.id
              ? "You are booking session " + selection.slot.name
              : null}
          </p>

          {appointmentError ? (
            <p className="appointment-error">
              * Please fill out all of the details.
            </p>
          ) : null}
        </Col>
      </Row>

      {!selection.slot.id ? (
        <div id="appointment-stuff">
          <Row noGutters className="text-center align-items-center">
            <Col xs="12" sm="3">
              <input
                type="date"
                required="required"
                className="booking-dropdown"
                value={selection.date.toISOString().split("T")[0]}
                onChange={e => {
                  if (!isNaN(new Date(new Date(e.target.value)))) {
                    let newSel = {
                      ...selection,
                      slot: {
                        ...selection.slot
                      },
                      date: new Date(e.target.value)
                    };
                    setSelection(newSel);
                  } else {
                    console.log("Invalid date");
                    let newSel = {
                      ...selection,
                      slot: {
                        ...selection.slot
                      },
                      date: new Date()
                    };
                    setSelection(newSel);
                  }
                }}
              ></input>
            </Col>
            <Col xs="12" sm="3">
              <UncontrolledDropdown>
                <DropdownToggle color="none" caret className="booking-dropdown">
                  {selection.time === null ? "Select a Time" : selection.time}
                </DropdownToggle>
                <DropdownMenu right className="booking-dropdown-menu">
                  {getTimes()}
                </DropdownMenu>
              </UncontrolledDropdown>
            </Col>
       
            <Col xs="12" sm="3">
              <UncontrolledDropdown>
                <DropdownToggle color="none" caret className="booking-dropdown">
                  {selection.size === 0
                    ? "Select a Party Size"
                    : selection.size.toString()}
                </DropdownToggle>
                <DropdownMenu right className="booking-dropdown-menu">
                  {getSizes()}
                </DropdownMenu>
              </UncontrolledDropdown>
            </Col>
          </Row>
          <Row noGutters className="slots-display">
            <Col>
              {getEmptySlots() > 0 ? (
                <p className="available-slots">{getEmptySlots()} available</p>
              ) : null}

              {selection.date && selection.time ? (
                getEmptySlots() > 0 ? (
                  <div>
                    <div className="slot-key">
                      <span className="empty-slot"></span> &nbsp; Available
                      &nbsp;&nbsp;
                      <span className="taken-slot"></span> &nbsp; Unavailable
                      &nbsp;&nbsp;
                    </div>
                    <Row noGutters>{getSlots()}</Row>
                  </div>
                ) : (
                  <p className="slot-display-message">No Available Sessions</p>
                )
              ) : (
                <p className="slot-display-message">
                  Please select a date and time for your appointment.
                </p>
              )}
            </Col>
          </Row>
        </div>
      ) : (
        <div id="confirm-appointment-stuff">
          <Row
            noGutters
            className="text-center justify-content-center reservation-details-container"
          >
            <Col xs="12" sm="3" className="reservation-details">
              <Input
                type="text"
                bsSize="lg"
                placeholder="Name"
                className="appointment-input"
                value={booking.name}
                onChange={e => {
                  setBooking({
                    ...booking,
                    name: e.target.value
                  });
                }}
              />
            </Col>
            <Col xs="12" sm="3" className="appointment-details">
              <Input
                type="text"
                bsSize="lg"
                placeholder="Phone Number"
                className="appointment-input"
                value={booking.phone}
                onChange={e => {
                  setBooking({
                    ...booking,
                    phone: e.target.value
                  });
                }}
              />
            </Col>
            <Col xs="12" sm="3" className="appointment-details">
              <Input
                type="text"
                bsSize="lg"
                placeholder="Email"
                className="appointment-input"
                value={booking.email}
                onChange={e => {
                  setBooking({
                    ...booking,
                    email: e.target.value
                  });
                }}
              />
            </Col>
          </Row>
          <Row noGutters className="text-center">
            <Col>
              <Button
                color="none"
                className="book-session-btn"
                onClick={_ => {
                  reserve();
                  navigate("/components/thankYou");
                }}
              >
                Book Now
              </Button>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};
