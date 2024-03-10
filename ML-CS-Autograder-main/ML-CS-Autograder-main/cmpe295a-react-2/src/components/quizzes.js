import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { Navbar, Nav} from "react-bootstrap";

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
    navigate("/grade-assignment-quiz", {
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
        {/* Align "Course" button to the left */}
        <div className="text-start mb-3">
          <Button
            onClick={toCourse}
            className="button-ash" // Apply the ash color class
            style={{ width: '200px' }} // Maintain the width
          >
            Back to Course
          </Button>
        </div>
        <div className="text-center">
          <h1>{course.name} Quizzes</h1>
        </div>
        <hr className="m-4" />
        {user.role === "teacher" && (
          <div className="text-center mb-3">
            <Button
              onClick={createQuiz}
              className="button-ash" // Apply the ash color class
              style={{ width: '200px' }} // Maintain the width
            >
              Create/Add Quiz
            </Button>
          </div>
        )}
        <Table striped bordered hover>
          <thead>
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
                  {/* Apply the ash color class to these buttons as well */}
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
