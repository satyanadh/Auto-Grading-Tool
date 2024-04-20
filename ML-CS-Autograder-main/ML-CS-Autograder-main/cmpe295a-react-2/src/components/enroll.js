import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { Navbar, Nav} from "react-bootstrap";
import { FiArrowLeftCircle } from 'react-icons/fi';
import { FiEdit } from "react-icons/fi";

export default function Enroll() {
  const [courses, setCourses] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state === null) {
      navigate("/");
    }

    axios
      .get("http://localhost:3001/api/v1/courses/")
      .then(function (response) {
        setCourses(response.data);
      })
      .catch(function (e) {
        console.log(e);
      });
  }, []);

  if (location.state === null) {
    return;
  }

  const user = location.state.user;
  const enrolled = location.state.enrolled.map((course) => course._id);

  const toDashboard = () => {
    navigate("/dashboard", {
      state: {
        user: user,
      },
    });
  };

  const enroll = (course) => {
    axios
      .put(`http://localhost:3001/api/v1/courses/enroll/${course._id}`, {
        student: user._id,
      })
      .then(function (response) {
        if (response.data.status === true) {
          toDashboard();
        } else {
          alert("Course enrollment failed!");
        }
      })
      .catch(function (e) {
        console.log(e);
      });
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
        <Navbar.Brand style={{ cursor: 'default', fontWeight: 'bold', marginLeft: '20px' }}>
            <div style={{ fontWeight: 'bold' }}>Learning Management System</div>
            <div style={{ fontSize: '0.8em', lineHeight: '1' }}>Welcome, {user.firstName} {user.lastName}!</div>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
            </Nav>
            <Button variant="outline-light" onClick={logout}>Logout</Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

    <Container className="p-5" fluid>
      <Row className="justify-content-center">
        <Col xs={12} sm={10}>
          <div className="p-5 shadow rounded">
          <div className="text-center" style={{
              backgroundColor: '#f0f0f0', // Light grey background; adjust color as needed
              borderRadius: '10px', // Adjust this value to control the curve of the edges
              padding: '20px', // Adjust for internal spacing
              margin: '20px 0', // Optional: adds space above and below the box
            }}>
              <h1>Course Enrollment</h1>
            </div>
            <hr style={{ borderWidth: '2px', margin: '20px 0' }} />
            <Table striped bordered hover style={{ borderRadius: '15px', borderCollapse: 'separate', borderSpacing: '0'}}>
              <thead style={{ backgroundColor: '#4CAF50', color: 'white' }}>
                <tr>
                  <th>Course ID</th>
                  <th>Course Description</th>
                  <th>Course Name</th>
                  <th>Teacher</th>
                  <th>Enroll</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course._id}>
                    <td>{course._id}</td>
                    <td>{course.description}</td>
                    <td>{course.name}</td>
                    <td>
                      {course.instructor
                        ? course.instructor.firstName + " " + course.instructor.lastName
                        : "Not Available"}
                    </td>
                    <td>
                      {enrolled.includes(course._id) ? (
                        <span style={{ color: 'red' }}>Already enrolled</span>
                      ) : (
                        <Button
                        className="button-ash"
                        onClick={() => enroll(course)}
                        style={{
                          backgroundColor: '#004085', // Dark blue color
                          fontSize: '15px',
                          width: '100px',
                        }}
                      >
                        <FiEdit className="me-2" />Enroll
                      </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
    </Container>
  </>
  );
}
