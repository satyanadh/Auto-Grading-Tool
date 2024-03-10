import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { Navbar, Nav} from "react-bootstrap";

export default function GradeQuestion() {
  const [points, setPoints] = useState(0);
  const [code, setCode] = useState("");
  const [results, setResults] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state === null) {
      navigate("/");
    }

    setPoints(answer.points);
  }, []);

  if (location.state === null) {
    return;
  }

  const user = location.state.user;
  const course = location.state.course;
  const assignmentQuiz = location.state.assignmentQuiz;
  const submission = location.state.submission;
  const question = location.state.question;
  const answer = location.state.answer;
  const i = location.state.i;

  const gradeQuestion = (e) => {
    e.preventDefault();

    answer.points = parseInt(points);
    let score = 0;
    for (const answer of submission.answers) {
      score += answer.points;
    }
    submission.score = score;

    axios
      .put(`http://localhost:3001/api/v1/assgs/grade/${submission._id}`, submission)
      .then(function (response) {
        toGradeSubmission();
      })
      .catch(function (e) {
        console.log(e);
      });
  };

  const parse = () => {
    axios
      .post("http://localhost:5000/parse", {
        url: answer.fileURL,
      })
      .then(function (response) {
        setCode(response.data);
      })
      .catch(function (e) {
        console.log(e);
      });
  };

  const repair = () => {
    axios
      .post("http://localhost:5000/repair", {
        code: code,
      })
      .then(function (response) {
        setCode(response.data);
      })
      .catch(function (e) {
        console.log(e);
      });
  };

  const grade = () => {
    axios
      .post("http://localhost:5000/grade", {
        funcDef: question.funcDef,
        code: code,
        testCases: question.testCases,
      })
      .then(function (response) {
        setResults(response.data);
      })
      .catch(function (e) {
        console.log(e);
      });
  };

  const toGradeSubmission = () => {
    navigate(`/grade-submission`, {
      state: {
        user: user,
        course: course,
        assignmentQuiz: assignmentQuiz,
        submission: submission,
      },
    });
  };

  const logout = () => {
    navigate("/");
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

  <Container className="p-5" fluid>
  <Row className="justify-content-center">
    <Col xs={12} sm={10}>
      <div className="p-5 shadow rounded">
        {/* Align "Back to Grade Submission" button to the left */}
        <div className="text-start mb-3">
          <Button
            type="button"
            onClick={toGradeSubmission}
            className="button-ash width-200 mt-1"
          >
            Back to Grade Submission
          </Button>
        </div>
        <hr className="m-4" />
        <div className="text-center">
          <h2>
            {i + 1}. {question.name} ({answer.points}/{question.points} points)
          </h2>
          <h4>{question.description}</h4>
          <Form.Control type="text" value={question.funcDef} readOnly={true} />
          {answer.fileURL && (
            <a href={answer.fileURL}>
              <Image src={answer.fileURL} className="max-height-200 mt-3" rounded fluid />
            </a>
          )}
        </div>
        <hr className="m-4" />
        <h2 className="text-center">Automated Grading</h2>
        <Row className="justify-content-center">
          <Col xs="auto">
            <Button type="button" className="button-ash width-200 mt-1" onClick={parse}>
              Parse
            </Button>
          </Col>
          <Col xs="auto">
            <Button type="button" className="button-ash width-200 mt-1" onClick={repair}>
              Repair
            </Button>
          </Col>
          <Col xs="auto">
            <Button type="button" className="button-ash width-200 mt-1" onClick={grade}>
              Grade
            </Button>
          </Col>
        </Row>
        <Form.Control
          as="textarea"
          rows={5}
          className="mt-3 bold-box"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        {results !== null && (
          <div className="mt-3">
            <h3>
              Test Cases Passed: {results.passed} ({((results.passed / (results.passed + results.failed)) * 100).toFixed(2)}%)
            </h3>
            <h3>
              Test Cases Failed: {results.failed} ({((results.failed / (results.passed + results.failed)) * 100).toFixed(2)}%)
            </h3>
            <Form.Control
              as="textarea"
              rows={5}
              className="mt-3 bold-box"
              value={JSON.stringify(results)}
              readOnly={true}
            />
          </div>
        )}
        {/* Move Points input and Save button to here, after all other content */}
        <Form onSubmit={gradeQuestion} className="mt-3">
          <Form.Group className="mb-3">
            <Form.Label>Points</Form.Label>
            <Form.Control
              type="number"
              step="1"
              min="0"
              max={question.points}
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              required
              className="points-input" 
            />
          </Form.Group>
          <Button type="submit" className="button-ash width-200 mt-1">
            Save
          </Button>
        </Form>
      </div>
    </Col>
  </Row>
</Container>
</>
  );
}
