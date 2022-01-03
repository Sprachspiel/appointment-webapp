import React from "react";
import { Row, Col } from "reactstrap";

export default props => {
  const getRow1 = _ => {
    let size = [];
    for (var i = 0; i < 2; i++) {
      size.push(
        <span
          key={i}
          className={props.empty ? "empty-slot" : "full-slot"}
        ></span>
      );
    }
    return size;
  };
  const getRow2 = _ => {
    let size2 = [];
    for (var i = 0; i < 2; i++) {
      size2.push(
        <span
          key={i}
          className={props.empty ? "empty-slot" : "full-slot"}
        ></span>
      );
    }
    return size2;
  };

  return (
    <div className="slot-container">
      <Col
        className={props.empty ? "slot selectable-slot" : "slot"}
        onClick={_ => {
          props.empty
            ? props.selectSlot(props.name, props.id)
            : console.log("Tried to select a full slot");
        }}
      >
        <Row noGutters className="slot-row">
          <Col className="text-center">{getRow1()}</Col>
        </Row>
        <Row noGutters className="slot-row">
          <Col className="text-center">{getRow2()}</Col>
        </Row>

        <p className="text-center slot-name">{props.name}</p>
      </Col>
    </div>
  );
};
