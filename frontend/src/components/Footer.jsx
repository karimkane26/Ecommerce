/* eslint-disable no-unused-vars */
import { Container, Row, Col } from "react-bootstrap";
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div>
      <footer>
        <Row>
          <Col className="text-center py-3">
            <p>JAYMA &copy; {currentYear}</p>
          </Col>
        </Row>
      </footer>
    </div>
  );
};

export default Footer;
