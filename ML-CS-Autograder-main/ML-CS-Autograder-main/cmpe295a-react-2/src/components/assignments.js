import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { Navbar, Nav} from "react-bootstrap";

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
    navigate("/attempt", {
      state: {
        user: user,
        course: course,
        assignmentQuiz: assignment,
      },
    });
  };

  const toSubmissions = (assignment) => {
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

      <Container className="pt-5 mt-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={10}>
          <div className="p-5 shadow rounded bg-white">
            <div className="text-center">
              <h1>{course.name} Assignments</h1>
              <Row className="justify-content-between align-items-center mt-3">
                <Col xs="auto">
                  <Button
                    className="button-ash mt-1"
                    onClick={toCourse}
                  >
                    Back to Course
                  </Button>
                </Col>
                {user.role === "teacher" && (
                  <Col xs={12} className="d-flex justify-content-center mt-4">
                    <Button
                      className="button-ash"
                      onClick={createAssignment}
                    >
                      Create/Add Assignment
                    </Button>
                  </Col>
                )}
              </Row>
            </div>
            <hr className="m-4" />
            <Table striped bordered hover>
              <thead>
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
                        >
                          Grade
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
