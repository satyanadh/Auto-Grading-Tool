import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { Navbar, Nav} from "react-bootstrap";
import { FiEdit } from "react-icons/fi";
import { FiArrowLeftCircle } from 'react-icons/fi';

export default function Submissions() {
  const [submissions, setSubmissions] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state === null) {
      navigate("/");
    }

    axios
      .get(`http://localhost:3001/api/v1/assgs/stusubmission/${assignmentQuiz._id}/${user._id}`)
      .then(function (response) {
        response.data.sort((a, b) => {
          return new Date(a.dateSubmitted) - new Date(b.dateSubmitted);
        });
        setSubmissions(response.data);
      })
      .catch(function (e) {
        console.log(e);
      });
  }, []);


  if (location.state === null) {
    return;
  }

  const user = location.state.user;
  const course = location.state.course;
  const assignmentQuiz = location.state.assignmentQuiz;
  const submission = location.state.submission;


  const toAssignmentsQuizzes = () => {
    navigate(`/${assignmentQuiz.type === "assignment" ? "assignments" : "quizzes"}`, {
      state: {
        user: user,
        course: course,
      },
    });
  };

  const toSubmission = (submission) => {
    console.log("to submissions")
    navigate("/submission", {
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

  const toEditor = (submission) => {
    console.log("=====to editor")
    navigate("/code-editor",  
    { state: { 
        user: user,
        course: course,
        assignmentQuiz: assignmentQuiz,
        submission: submission,
      } })
  }

  return (
    <>
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
        <Container>
        <Button 
          variant="light" 
          onClick={toAssignmentsQuizzes}
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
              <h1>Submissions</h1>
            </div>
            <hr style={{ borderWidth: '2px', margin: '20px 0' }} />
            <Table striped bordered hover style={{ borderRadius: '15px', borderCollapse: 'separate', borderSpacing: '0'}}>
              <thead style={{ backgroundColor: '#4CAF50', color: 'white' }}>
                <tr>
                  <th>Assignment Description</th>
                  <th>Due Date</th>
                  <th>Date Submitted</th>
                  <th>Score</th>
                  <th>View</th>
                  <th>CodeEditor</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => (
                  <tr key={submission._id}>
                    <td>{assignmentQuiz.name}</td>
                    <td>{assignmentQuiz.dueDate}</td>
                    <td>
                      {submission.dateSubmitted}
                      {new Date(submission.dateSubmitted) > new Date(assignmentQuiz.dueDate) && (
                        <span style = {{color : 'red'}}> (LATE)</span>
                      )}
                    </td>
                    <td>{submission.score}/{assignmentQuiz.totalPoints}</td>
                    <td>
                      <Button
                          className="button-ash"
                          onClick={() => toSubmission(submission)}
                          style={{
                            backgroundColor: '#004085', // Dark blue color
                            fontSize: '15px',
                            width: '200px',
                          }}
                        >
                        View Submission
                      </Button>
                    </td>
                    <td>
                      <Button variant="secondary" type="button"
                      onClick={() => toEditor(submission)} 
                      >
                          <FiEdit className="me-2" /> TextEditor
                      </Button>
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
