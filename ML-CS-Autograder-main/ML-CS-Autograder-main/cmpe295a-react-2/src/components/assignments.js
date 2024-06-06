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

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state === null) {
      navigate("/");
    }

    axios
      .get(`http://localhost:3001/api/v1/assgs/courseassignments/${course._id}`)
      .then(function (response) {
        response.data.sort((a, b) => {
          return new Date(a.dueDate) - new Date(b.dueDate);
        });
        setAssignments(response.data);
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

  const createAssignment = () => {
    navigate("/create-assignment-quiz", {
      state: { user: user, course: course, type: "assignment" },
    });
  };

  const toCourse = () => {
    navigate("/course", {
      state: {
        user: user,
        course: course,
      },
    });
  };

  const toAttempt = (assignment) => {
    console.log("hello")
    navigate("/attempt", {
      state: {
        user: user,
        course: course,
        assignmentQuiz: assignment,
      },
    });
  };

  const toSubmissions = (assignment) => {
    console.log("toSubmissionss")
    navigate("/submissions", {
      state: {
        user: user,
        course: course,
        assignmentQuiz: assignment,
      },
    });
  };

  const toGradeAssignmentQuiz = (assignment) => {
    navigate("/grade-assignment-quiz", {
      state: {
        user: user,
        course: course,
        assignmentQuiz: assignment,
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
          onClick={toCourse}
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

      <Container className="pt-5 mt-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={10}>
          <div className="p-5 shadow rounded bg-white">
          <div className="text-center" style={{
              backgroundColor: '#f0f0f0', // Light grey background; adjust color as needed
              borderRadius: '10px', // Adjust this value to control the curve of the edges
              padding: '20px', // Adjust for internal spacing
              margin: '20px 0', // Optional: adds space above and below the box
            }}>
              <h1>{course.name} Assignments</h1>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            {user.role === "teacher" && (
              <Button variant="secondary" onClick={createAssignment}
              style={{
                backgroundColor: '#004085', // Dark blue color
                fontSize: '15px',
              }}>
                <FiEdit className="me-2" />Create/Add Assignment
              </Button>
            )}
          </div>
          <hr style={{ borderWidth: '2px', margin: '20px 0' }} />
          <Table striped bordered hover style={{ borderRadius: '15px', borderCollapse: 'separate', borderSpacing: '0'}}>
              <thead style={{ backgroundColor: '#4CAF50', color: 'white' }}>
                <tr>
                  <th>Assignment Description</th>
                  <th>Due Date</th>
                  <th>Points</th>
                  {user.role === "student" && <th>Attempt/Submissions</th>}
                  {user.role === "teacher" && <th>Grade</th>}
                </tr>
              </thead>
              <tbody>
                {assignments.map((assignment) => (
                  <tr key={assignment._id}>
                    <td>{assignment.name}</td>
                    <td>
                      {new Date(assignment.dueDate).toLocaleDateString()}
                      {new Date(assignment.dueDate) < new Date() && <span> (Past)</span>}
                    </td>
                    <td>{assignment.totalPoints}</td>
                    <td>
                      {user.role === "student" ? (
                        <>
                          <Button
                            className="button-ash me-2"
                            onClick={() => toAttempt(assignment)}
                          >
                            Attempt
                          </Button>
                          <Button
                            className="button-ash"
                            onClick={() => toSubmissions(assignment)}
                          >
                            Submissions
                          </Button>
                        </>
                      ) : (
                        <Button
                          className="button-ash"
                          onClick={() => toGradeAssignmentQuiz(assignment)}
                          style={{
                            backgroundColor: '#004085', // Dark blue color
                            fontSize: '15px',
                            width: '100px',
                          }}
                        >
                          <FiEdit className="me-2" />Grade
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {/* Centering the "Create Assignment" button for teachers below the table */}
          </div>
        </Col>
      </Row>
    </Container>
    </>
  );
}
