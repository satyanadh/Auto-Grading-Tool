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
import { FiArrowLeftCircle, FiArrowRightCircle } from 'react-icons/fi';
import { Spinner } from 'react-bootstrap';


export default function GradeQuestion() {
  const [points, setPoints] = useState(0);
  const [code, setCode] = useState("");
  const [results, setResults] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [isParsing, setIsParsing] = useState(false);
  const [isRepairing, setIsRepairing] = useState(false);
  const [isGrading, setIsGrading] = useState(false);
  const [parseResult, setParseResult] = useState('');
  const [repairResult, setRepairResult] = useState('');


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

  const parse = async () => {
    setIsParsing(true); // Start loading
    try {
        const response = await axios.post("http://localhost:5000/parse", { url: answer.fileURL });
        setParseResult(response.data);
    } catch (error) {
        console.log(error);
    } finally {
        setIsParsing(false); // Stop loading
    }
  };

  const repair = async () => {
    setIsRepairing(true); // Start loading
    try {
        const response = await axios.post("http://localhost:5000/repair", { code: code });
        setRepairResult(response.data);
    } catch (error) {
        console.log(error);
    } finally {
        setIsRepairing(false); // Stop loading
    }
  };

  const grade = async () => {
    setIsGrading(true); // Start loading
    try {
        const response = await axios.post("http://localhost:5000/grade", {
            funcDef: question.funcDef,
            code: code,
            testCases: question.testCases,
        });
        setResults(response.data);
    } catch (error) {
        console.log(error);
    } finally {
        setIsGrading(false); // Stop loading
    }
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
        <Button 
          variant="light" 
          onClick={toGradeSubmission}
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
          <h2>
            {i + 1}. {question.name} ({answer.points}/{question.points} points)
          </h2>
          <h4>{question.description}</h4>
          <Form.Control type="text" value={question.funcDef} readOnly={true} />
          <h2 style={{ color: 'green' }}>Submission</h2>
          {answer.fileURL && (
            <div className="mt-3 p-3 shadow rounded bg-light" style={{ maxWidth: 'fit-content', margin: 'auto' }}>
              <a href={answer.fileURL} target="_blank" rel="noopener noreferrer">
                <Image src={answer.fileURL} className="max-height-200 rounded" fluid />
              </a>
            </div>
          )}
        </div>
        <h2 className="text-center" style={{ marginTop: '20px' }}>Automated Grading</h2>
        <Row className="justify-content-center align-items-start">
                <Col md={6}>
                <Button type="button" className="button-ash width-200 mt-1" onClick={parse}
                  style={{
                    backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '120px', marginRight: '50px',
                  }}>
                  {isParsing ? (
                  <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" style={{ marginRight: '5px' }} />
                      Parsing...
                  </>
                  ) : (
                  <>
                      Parse <FiArrowRightCircle style={{ marginRight: '8px', fontSize: '24px' }} />
                  </>
                  )}
                  {/* Parse <FiArrowRightCircle style={{ marginRight: '8px', fontSize: '24px' }} /> */}
                 </Button>
                  <Form.Control
                    as="textarea"
                    rows={20}
                    value={parseResult}
                    onChange={(e) => setParseResult(e.target.value)}
                    placeholder="Parse results will appear here..."
                    className="mt-3 bold-box"
                    readOnly={!isParsing}
                  />
                </Col>
                <Col md={6}>
                <Button type="button" className="button-ash width-200 mt-1" onClick={repair}
                  style={{ backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '120px', marginRight: '50px',}}>
                  {isRepairing ? (
                  <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" style={{ marginRight: '5px' }} />
                      Repairing...
                  </>
                  ) : (
                  <>
                      Repair <FiArrowRightCircle style={{ marginRight: '8px', fontSize: '24px' }} />
                  </>
                  )}
                </Button>
                  <Form.Control
                    as="textarea"
                    rows={20}
                    value={repairResult}
                    onChange={(e) => setRepairResult(e.target.value)}
                    placeholder="Repair results will appear here..."
                    className="mt-3 bold-box"
                    readOnly={!isRepairing}
                  />
            </Col>
        </Row>
        <Row className="justify-content-center">
        <Col xs="auto">
            <Button type="button" className="button-ash width-200 mt-3" onClick={grade}
            style={{
              backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '-10px', marginRight: '20px',
            }}>
              {isGrading ? (
            <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" style={{ marginRight: '5px' }} />
                Grading...
            </>
            ) : (
            <>
                Grade <FiArrowRightCircle style={{ marginRight: '8px', fontSize: '24px' }} />
            </>
            )}
            </Button>
          </Col>
        </Row>
        <Form.Control
          as="textarea"
          rows={15}
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
          <Button type="submit" className="button-ash width-200 mt-1"
          style={{
            backgroundColor: '#004085', // Dark blue color
            fontSize: '15px',
            width: '150px'
          }}>
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
