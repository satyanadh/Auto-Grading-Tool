import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import { Navbar, Nav} from "react-bootstrap";
import { FiArrowLeftCircle } from 'react-icons/fi';

export default function Submission() {
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
  const course = location.state.course;
  const assignmentQuiz = location.state.assignmentQuiz;
  const submission = location.state.submission;

  const toSubmissions = () => {
    navigate(`/submissions`, {
      state: {
        user: user,
        course: course,
        assignmentQuiz: assignmentQuiz,
      },
    });
  };

  const logout = () => {
    navigate("/");
  };


  const createQuestion = (question, i) => {
    let finalAnswer = null;
    for (const answer of submission.answers) {
      if (answer.question === question._id) {
        finalAnswer = answer;
        break;
      }
    }
    return (
      <Row key={question._id} className={i > 0 ? "mt-5" : ""}>
        <Col>
          <h2>
            {i + 1}. {question.name} ({finalAnswer === null ? 0 : finalAnswer.points}/
            {question.points} points)
          </h2>
          <h4>{question.description}</h4>
          {/* <Form.Control type="text" value={question.funcDef} readOnly={true} /> */}
          {(finalAnswer === null || !("fileURL" in finalAnswer)) && (
            <h5 className="mt-3">No answer</h5>
          )}
          {finalAnswer !== null && (
            <a href={finalAnswer.fileURL}>
              <Image src={finalAnswer.fileURL} className="max-height-200 mt-3" rounded fluid />
            </a>
          )}
        </Col>
      </Row>
    );
  };

  return (
  <>
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
        <Container>
        <Button 
          variant="light" 
          onClick={toSubmissions}
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
        <Col xs={12} sm={10}>
          <div className="p-5 shadow rounded">
           <div className="text-center" style={{
              backgroundColor: '#f0f0f0', // Light grey background; adjust color as needed
              borderRadius: '10px', // Adjust this value to control the curve of the edges
              padding: '20px', // Adjust for internal spacing
              margin: '20px 0', // Optional: adds space above and below the box
            }}>
              <h1 style = {{color : 'green'}}>{assignmentQuiz.name} Submission</h1>
              <hr style={{ borderWidth: '2px', margin: '20px 0' }}/>
              {assignmentQuiz.questions.map((question, i) => createQuestion(question, i))}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  </>
  );
}
