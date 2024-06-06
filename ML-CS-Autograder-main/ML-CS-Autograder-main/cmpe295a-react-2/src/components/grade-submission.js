import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Form from "react-bootstrap/Form";
import { Navbar, Nav} from "react-bootstrap";
import { FiArrowLeftCircle } from 'react-icons/fi';
import { FiEdit } from "react-icons/fi";


export default function GradeSubmission() {
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

  const toGradeAssignmentQuiz = () => {
    navigate(`/grade-assignment-quiz`, {
      state: {
        user: user,
        course: course,
        assignmentQuiz: assignmentQuiz,
      },
    });
  };

  const toGradeQuestion = (question, answer, i) => {
    navigate(`/grade-question`, {
      state: {
        user: user,
        course: course,
        assignmentQuiz: assignmentQuiz,
        submission: submission,
        question: question,
        answer: answer,
        i: i,
      },
    });
  };

  const createQuestion = (question, i) => {
    let answer = null;
    for (const ans of submission.answers) {
      if (ans.question === question._id) {
        answer = ans;
        break;
      }
    }
    return (
      <Row key={question._id} className={(i > 0 ? "mt-5" : "") + " justify-content-center"}>
        <Col>
          <h2>
            {i + 1}. {question.name} ({answer === null ? 0 : answer.points}/{question.points}{" "}
            points)
          </h2>
          <h4>{question.description}</h4>
          <Form.Control 
            type="text" 
            value={question.funcDef}
            // readOnly={true}  
          />
          {(answer === null || !("fileURL" in answer)) && <h5 className="mt-3">No answer</h5>}
          {answer !== null && (
            <>
              <Row>
                <Col>
                  <a href={answer.fileURL}>
                    <Image src={answer.fileURL} className="max-height-200 mt-3" rounded fluid />
                  </a>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button
                          onClick={() => toGradeQuestion(question, answer, i)}
                          style={{
                            backgroundColor: '#004085', // Dark blue color
                            fontSize: '15px',
                            width: '100px',
                          }}
                        >
                          <FiEdit className="me-2" />Grade
                        </Button>
                </Col>
              </Row>
            </>
          )}
        </Col>
      </Row>
    );
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
          onClick={toGradeAssignmentQuiz}
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
            <div className="text-center">
              <h1>{assignmentQuiz.name}</h1>
              <h4>
                Submitted: {submission.dateSubmitted} | {submission.score}/
                {assignmentQuiz.totalPoints} points
              </h4>
            </div>
            <hr className="m-4" />
            {assignmentQuiz.questions.map((question, i) => createQuestion(question, i))}
          </div>
        </Col>
      </Row>
    </Container>
  </>
  );
}
