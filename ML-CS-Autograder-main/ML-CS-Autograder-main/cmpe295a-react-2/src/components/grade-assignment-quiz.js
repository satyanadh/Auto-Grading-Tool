import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { Navbar, Nav} from "react-bootstrap";

export default function ToGradeAssignmentQuiz() {
  const [students, setStudents] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state === null) {
      navigate("/");
    }

    const promises = [];
    for (const student of course.students) {
      const promise = axios
        .get(
          `http://localhost:3001/api/v1/assgs/stusubmission/${assignmentQuiz._id}/${student._id}`
        )
        .then(function (response) {
          const submissions = response.data;
          submissions.sort((a, b) => {
            return new Date(a.dateSubmitted) - new Date(b.dateSubmitted);
          });
          let lastSubmission = submissions.length > 0 ? submissions[submissions.length - 1] : null;
          student["lastSubmission"] = lastSubmission;
        })
        .catch(function (e) {
          console.log(e);
        });
      promises.push(promise);
    }

    Promise.all(promises)
      .then(function (response) {
        const s = course.students.filter((student) => student.lastSubmission !== null);
        setStudents(s);
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

  const toAssignmentsQuizzes = () => {
    navigate(`/${assignmentQuiz.type === "assignment" ? "assignments" : "quizzes"}`, {
      state: {
        user: user,
        course: course,
      },
    });
  };

  const toGradeSubmission = (lastSubmission) => {
    navigate("/grade-submission", {
      state: {
        user: user,
        course: course,
        assignmentQuiz: assignmentQuiz,
        submission: lastSubmission,
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
        {/* Move the button to the left */}
        <div className="text-start mb-3">
          <Button
            onClick={toAssignmentsQuizzes}
            className="button-ash" // Apply the ash color class
            style={{ width: '200px' }} // Maintain the width
          >
            {assignmentQuiz.type === "assignment" ? "Assignments" : "Quizzes"}
          </Button>
        </div>
        <div className="text-center">
          <h1>Grade {assignmentQuiz.name}</h1>
          <h4>
            Due date: <span style={{ color: 'red' }}>{assignmentQuiz.dueDate}</span> | {assignmentQuiz.totalPoints} points
          </h4>
        </div>
        <hr className="m-4" />
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Student</th>
              <th>Date Submitted</th>
              <th>Score</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>
                  {student.firstName} {student.lastName} ({student.username})
                </td>
                <td>
                  {student.lastSubmission.dateSubmitted}
                  {new Date(student.lastSubmission.dateSubmitted) > new Date(assignmentQuiz.dueDate) && <span> (LATE)</span>}
                </td>
                <td>
                  {student.lastSubmission.score}/{assignmentQuiz.totalPoints}
                </td>
                <td>
                  <Button
                    onClick={() => toGradeSubmission(student.lastSubmission)}
                    className="button-ash" // Apply the ash color class
                    style={{ width: '100px' }} // Adjust width as needed
                  >
                    Grade
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
