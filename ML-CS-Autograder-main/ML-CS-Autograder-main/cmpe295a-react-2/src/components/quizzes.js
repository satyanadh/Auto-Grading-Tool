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


export default function Quizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state === null) {
      navigate("/");
    }

    axios
      .get(`http://localhost:3001/api/v1/assgs/coursequizzes/${course._id}`)
      .then(function (response) {
        response.data.sort((a, b) => {
          return new Date(a.dueDate) - new Date(b.dueDate);
        });
        setQuizzes(response.data);
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

  const createQuiz = () => {
    navigate("/create-assignment-quiz", {
      state: { user: user, course: course, type: "quiz" },
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

  const toAttempt = (quiz) => {
    navigate("/attempt", {
      state: {
        user: user,
        course: course,
        assignmentQuiz: quiz,
      },
    });
  };

  const toSubmissions = (quiz) => {
    navigate("/submissions", {
      state: {
        user: user,
        course: course,
        assignmentQuiz: quiz,
      },
    });
  };

  const toGradeAssignmentQuiz = (quiz) => {
    navigate("/grade", {
      state: {
        user: user,
        course: course,
        assignmentQuiz: quiz,
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

    <Container className="p-5" fluid>
  <Row className="justify-content-center">
    <Col xs={12} sm={10}>
      <div className="p-5 shadow rounded">
        {/* Align "Course" button to the left */}
        <div className="text-center">
        <div className="text-center" style={{
              backgroundColor: '#f0f0f0', // Light grey background; adjust color as needed
              borderRadius: '10px', // Adjust this value to control the curve of the edges
              padding: '20px', // Adjust for internal spacing
              margin: '20px 0', // Optional: adds space above and below the box
            }}>
          <h1>{course.name} Quizzes</h1>
         </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
        {user.role === "teacher" && (
          <div className="text-center mb-3">
            <Button
              onClick={createQuiz}
              className="button-ash" // Apply the ash color class
              style={{
                backgroundColor: '#004085', // Dark blue color
                fontSize: '15px',
              }}
            >
              <FiEdit className="me-2" /> Create/Add Quiz
            </Button>
          </div>
        )}
        </div>
        <hr style={{ borderWidth: '2px', margin: '20px 0' }} />
        <Table striped bordered hover style={{ borderRadius: '15px', borderCollapse: 'separate', borderSpacing: '0'}}>
          <thead style={{ backgroundColor: '#4CAF50', color: 'white' }}>
            <tr>
              <th>Quiz</th>
              <th>Due Date</th>
              <th>Points</th>
              {user.role === "student" && <th>Attempt/Submissions</th>}
              {user.role === "teacher" && <th>Grade</th>}
            </tr>
          </thead>
          <tbody>
            {quizzes.map((quiz) => (
              <tr key={quiz._id}>
                <td>{quiz.name}</td>
                <td>{new Date(quiz.dueDate).toLocaleDateString()}</td>
                <td>{quiz.totalPoints}</td>
                <td>
                      {user.role === "student" ? (
                        <>
                          <Button
                            className="button-ash me-2"
                            onClick={() => toAttempt(quiz)}
                          >
                            Attempt
                          </Button>
                          <Button
                            className="button-ash"
                            onClick={() => toSubmissions(quiz)}
                          >
                            Submissions
                          </Button>
                        </>
                      ) : (
                        <Button
                          className="button-ash"
                          onClick={() => toGradeAssignmentQuiz(quiz)}
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
      </div>
    </Col>
  </Row>
</Container>
  </>
  );
}
