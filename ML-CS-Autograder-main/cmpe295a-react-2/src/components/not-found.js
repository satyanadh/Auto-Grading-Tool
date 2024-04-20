import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import books from "../images/books.jpg";

export default function NotFound() {
  return (
    <Container className="p-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6}>
          <div className="p-5 shadow rounded">
            <div className="text-center">
              <Link to="/">
                <Image src={books} className="max-height-200" rounded fluid />
              </Link>
              <h1 className="mt-3">CMPE 295 LMS</h1>
              <h4 className="mt-3">There's nothing here!</h4>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
