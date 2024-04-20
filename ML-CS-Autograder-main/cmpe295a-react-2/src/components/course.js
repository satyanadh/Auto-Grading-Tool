import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Button, Navbar, Nav} from "react-bootstrap";
import { FiArrowLeftCircle } from 'react-icons/fi';
import { Card } from 'react-bootstrap';
import AssignmentCardImage from '../images/GradesCard_1.jpg';
import QuizCardImage from '../images/QuizCard.jpg';
import GradeCardImage from '../images/GradesCardImage_1.jpg'


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
    
      <Container fluid style={{ paddingTop: '70px' }}>
        <Row className="justify-content-center">
          <Col xs={12} sm={10}>
            <div className="text-center p-5 shadow rounded bg-white">
              <h1>{course.name}</h1>
              <h2>{course.description && <p className="mt-4">{course.description}</p>}</h2>
              <h4>Instructor: {course.instructor ? `${course.instructor.firstName} ${course.instructor.lastName}` : 'TBD'}</h4>
              {/* Card section starts */}
              <Row className="mt-4">
                {/* Assignments Card */}
                <Col md={4} className="mb-4">
                  <Card onClick={toAssignments} className="cursor-pointer h-100" style={{ backgroundColor: 'green', color: 'white' }}>
                    <Card.Img variant="top" src={AssignmentCardImage} style={{ height: '200px', objectFit: 'cover', objectPosition: 'center' }} />
                    <Card.Body style={{ height: '50px' }}>
                      <Card.Title className="text-center mb-0" style={{ fontWeight: 'bold' }}>
                        Assignments
                      </Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
            
          {/* Quizzes Card */}
          <Col md={4} className="mb-4">
            <Card onClick={toQuizzes} className="cursor-pointer h-100" style={{ backgroundColor: 'blue', color: 'white' }}>
            <Card.Img variant="top" src={QuizCardImage} style={{ height: '200px', objectFit: 'cover', objectPosition: 'center' }} />
              <Card.Body style={{ height: '50px' }}>
                <Card.Title className="text-center mb-0" style={{ fontWeight: 'bold' }}>
                  Quizzes
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>
          
          {/* Grades Card */}
          <Col md={4} className="mb-4">
            <Card onClick={toGrades} className="cursor-pointer h-100" style={{ backgroundColor: 'red', color: 'white' }}>
            <Card.Img variant="top" src={GradeCardImage} style={{ height: '200px', objectFit: 'cover', objectPosition: 'center' }} />
              <Card.Body style={{ height: '50px' }}>
                <Card.Title className="text-center mb-0" style={{ fontWeight: 'bold' }}>
                  Grades
                </Card.Title>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        {/* Card section ends */}
      </div>
    </Col>
  </Row>
</Container>
    </>
  );
}