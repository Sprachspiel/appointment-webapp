import React from "react";
import { Row, Col } from "reactstrap";

const ThankYou = () => {
  return (
    <div>
      <Row noGutters className="text-center">
        <Col>
          <p className="thanks-header">Thank You!</p>
          
          <p className="thanks-subtext">
            You should receive an email confirmation for your appointment.
          </p>
        </Col>
      </Row>
    </div>
  );
};

export default ThankYou;
