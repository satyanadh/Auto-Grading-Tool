import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { Navbar, Nav} from "react-bootstrap"; 
import { FiArrowLeftCircle } from 'react-icons/fi';

export default function CreateCourse() {
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state === null) {
      navigate("/");
    }
  }, []);

  if (location.state === null) {
    return;
  }

  const user = location.state.user;

  const createCourse = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:3001/api/v1/courses", {
        name: courseName,
        description: courseDescription,
        instructor: user._id,
      })
      .then(function (response) {
        if (response.data.status === true) {
          toDashboard();
        } else {
          alert("Course creation failed! ");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const toDashboard = () => {
    navigate("/dashboard", { state: { user: user } });
  };

  const logout = () => {
    navigate("/");
  };

  return (
    <>
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
        <Container>
        <Button 
          variant="light" 
          onClick={toDashboard}
          style={{
            backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '-50px', marginRight: '20px',
          }}
        >
          <FiArrowLeftCircle style={{ marginRight: '8px', fontSize: '24px' }} />Back
        </Button>
          <Navbar.Brand href="#home" style={{ cursor: 'pointer', fontWeight: 'bold', marginLeft: '20px'}}>
            Learning Management System
            <div style={{ fontSize: '0.8em', lineHeight: '1' }}>Welcome, {user.firstName} {user.lastName}!</div>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {/* Additional nav items can be added here */}
            </Nav>
            <Button variant="outline-light" onClick={logout}>Logout</Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

    <Container className="p-5" fluid>
      <Row className="justify-content-center">
        <Col xs={12} sm={6}>
          <div className="p-5 shadow rounded">
            <div className="text-center">
              <h1>Create Course</h1>
            </div>
            <hr className="m-4" />
            <Form onSubmit={createCourse}>
              <Form.Group>
                <Form.Label>Course Name</Form.Label>
                <Form.Control
                  type="text"
                  style = {{borderWidth: '6px'}}
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label>Course Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5} 
                  style = {{borderWidth: '6px'}}
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  required
                />
              </Form.Group>
              <div className="text-center mt-3">
                <Button
                  variant="primary"
                  type="submit"
                  style={{
                    backgroundColor: '#004085', // Dark blue color
                    borderColor: '#004085', // Match border color
                    padding: '10px 20px', 
                    fontSize: '18px',
                  }}
                >
                  Create
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  </>
  );
}
