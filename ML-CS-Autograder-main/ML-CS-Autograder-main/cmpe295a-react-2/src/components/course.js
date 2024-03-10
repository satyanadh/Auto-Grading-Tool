import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Button, Navbar, Nav} from "react-bootstrap";

export default function Course() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!location.state) {
      navigate("/");
    }
  }, [navigate, location.state]);

  if (!location.state) {
    return null;
  }

  const user = location.state.user;
  const course = location.state.course;

  const toDashboard = () => {
    navigate("/dashboard", { state: { user: user } });
  };

  const toAssignments = () => {
    navigate("/assignments", { state: { user: user, course: course } });
  };

  const toQuizzes = () => {
    navigate("/quizzes", { state: { user: user, course: course } });
  };

  const toGrades = () => {
    navigate("/grades", { state: { user: user, course: course } });
  };

  const logout = () => {
    navigate("/");
  };

  const buttonStyle = {
    width: '150px', // Example width, adjust as necessary
    // Additional styles can be added here
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
        <Container>
        <Navbar.Brand style={{ cursor: 'default', fontWeight: 'bold'  }}>
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

      <Container fluid style={{ paddingTop: '70px' }}>
      <Row className="justify-content-center">
        <Col xs={12} sm={10}>
          <div className="text-center p-5 shadow rounded bg-white">
            <h1>{course.name}</h1>
            <h4>Instructor: {course.instructor ? `${course.instructor.firstName} ${course.instructor.lastName}` : 'TBD'}</h4>
            <div className="d-flex justify-content-center mt-4">
              <div className="d-grid gap-2" style={{ width: 'fit-content' }}> {/* Ensures the grid itself is only as wide as its content */}
                <Button variant="secondary" size="sm" onClick={toDashboard} className="mt-1" style={buttonStyle}>
                  Back to Dashboard
                </Button>
                <Button variant="secondary" size="sm" onClick={toAssignments} className="mt-1" style={buttonStyle}>
                  Assignments
                </Button>
                <Button variant="secondary" size="sm" onClick={toQuizzes} className="mt-1" style={buttonStyle}>
                  Quizzes
                </Button>
                <Button variant="secondary" size="sm" onClick={toGrades} className="mt-1" style={buttonStyle}>
                  Grades
                </Button>
              </div>
            </div>
            {course.description && <p className="mt-4">{course.description}</p>}
          </div>
        </Col>
      </Row>
    </Container>
    </>
  );
}