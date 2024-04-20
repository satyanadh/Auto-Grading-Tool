import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { Navbar, Nav} from "react-bootstrap";
import { FiArrowLeftCircle } from 'react-icons/fi';
import { FiEdit } from "react-icons/fi";

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

  <Container className="p-5" fluid style={{ backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
  <Row className="justify-content-center">
    <Col xs={12} sm={10}>
      <div className="p-5 shadow rounded">
        <div className="text-center">
          <h1>{assignmentQuiz.name}</h1>
          <h4>
            Due date: <span style={{ color: 'red' }}>{assignmentQuiz.dueDate}</span> | {assignmentQuiz.totalPoints} points
          </h4>
        </div>
        <hr style={{ borderWidth: '2px', margin: '20px 0' }} />
          <Table striped bordered hover style={{ borderRadius: '15px', borderCollapse: 'separate', borderSpacing: '0'}}>
              <thead style={{ backgroundColor: '#4CAF50', color: 'white' }}>
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
                          className="button-ash"
                          onClick={() => toGradeSubmission(student.lastSubmission)}
                          style={{
                            backgroundColor: '#004085', // Dark blue color
                            fontSize: '15px',
                            width: '100px'
                          }}
                        >
                          <FiEdit className="me-2" />Grade
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
