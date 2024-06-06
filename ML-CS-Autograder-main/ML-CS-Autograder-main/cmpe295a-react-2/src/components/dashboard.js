import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Button, Card, Navbar, Nav } from "react-bootstrap";
import books from "../images/books.jpg";
import { FiEdit } from "react-icons/fi";
import axios from "axios";
import backgroundImage from '../images/LMS.jpg'; 
import gradeCard from '../images/GradesCard.jpg';


export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const addCourseButtonStyle = {
    position: 'absolute', // Position the button absolutely within its positioned ancestor
    top: '100px', // Adjust this value based on your navbar's height
    right: '20px', // Right-aligned with some margin
    zIndex: '1000', // Ensure it's above other content
    color: 'white', // Text color
    padding: '10px 20px', // Padding around the text
    borderRadius: '5px', // Rounded corners
    border: 'none', // Remove border
    cursor: 'pointer', // Change cursor on hover
  };

  useEffect(() => {
    if (!location.state) {
      navigate("/");
    } else {
      const user = location.state.user;

      axios
        .get(`http://localhost:3001/api/v1/courses/by${user.role === "student" ? "student" : "instructor"}/${user._id}`)
        .then(function (response) {
          setCourses(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, [location, navigate]);

  if (!location.state) {
    return null;
  }

  const user = location.state.user;

  const logout = () => {
    navigate("/");
  };

  const enroll = () => {
    navigate("/enroll", { state: { user: user, enrolled: courses } });
  };

  const createCourse = () => {
    navigate("/create-course", { state: { user: user } });
  };

  const toCourse = (course) => {
    navigate("/course", { state: { user: user, course: course } });
  };


 return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top" className="mb-4"> 
        <Container>
          <Navbar.Brand style={{ cursor: 'default', fontWeight: 'bold'  }}>
            <div style={{ fontWeight: 'bold' }}>Learning Management System</div>
            <div style={{ fontSize: '0.8em', lineHeight: '1' }}>Welcome, {user.firstName} {user.lastName}!</div>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {/* Optionally, other navigation links can be added here */}
            </Nav>
            <Button variant="outline-light" onClick={logout}>Logout</Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {user.role === "teacher" && (
        <div style={addCourseButtonStyle}>
          <Button variant="secondary" onClick={createCourse}>
            <FiEdit className="me-2" />Add a New Course
          </Button>
        </div>
      )}
      {user.role === "student" && (
        <div style={addCourseButtonStyle}>
            <Button variant="secondary" type="button" onClick={enroll}>
              <FiEdit className="me-2" /> Enroll New Course
            </Button>
        </div>
      )}
      
      <Container fluid style={{ paddingTop: '70px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}> 
        <Row className="justify-content-center">
          <Col xs={12} sm={10}>
            <div className="p-5 rounded" style={{ backgroundColor: 'transparent' }}>
              <h2 className="text-center mb-3" style={{ fontWeight: 'bold' }}>Courses</h2>
              <Row>
                {courses.map((course) => (
                  <Col xs={12} md={6} lg={4} key={course._id} className="mt-3">
                    <Card 
                      onClick={() => toCourse(course)} 
                      className="cursor-pointer h-100"
                      style={{ backgroundColor: 'green', color: 'white' }}
                    >
                      <Card.Img variant="top" src={gradeCard} />
                      <Card.Body>
                        <Card.Title className="text-center mb-0" style={{ fontWeight: 'bold' }}>
                          {course.name}
                        </Card.Title>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}
