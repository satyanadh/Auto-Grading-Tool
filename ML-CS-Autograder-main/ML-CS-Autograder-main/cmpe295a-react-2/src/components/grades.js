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
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function Grades() {
  const [assignmentsQuizzes, setAssignmentsQuizzes] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const percentage = totalPoints > 0 ? (totalScore / totalPoints) * 100 : 0;
  

  useEffect(() => {
    if (location.state === null) {
      navigate("/");
    }

    axios
      .get(`http://localhost:3001/api/v1/assgs/course/${course._id}`)
      .then(function (response) {
        const assignmentsQuizzes = response.data;
        assignmentsQuizzes.sort((a, b) => {
          return new Date(a.dueDate) - new Date(b.dueDate);
        });

        const promises = [];
        for (const assignmentQuiz of assignmentsQuizzes) {
          const promise = axios
            .get(
              `http://localhost:3001/api/v1/assgs/stusubmission/${assignmentQuiz._id}/${user._id}`
            )
            .then(function (response) {
              const submissions = response.data;
              submissions.sort((a, b) => {
                return new Date(a.dateSubmitted) - new Date(b.dateSubmitted);
              });
              let lastSubmission =
                submissions.length > 0 ? submissions[submissions.length - 1] : null;
              assignmentQuiz["lastSubmission"] = lastSubmission;
            })
            .catch(function (e) {
              console.log(e);
            });
          promises.push(promise);
        }

        Promise.all(promises)
          .then(function (response) {
            setAssignmentsQuizzes(assignmentsQuizzes);

            let totalScore = 0;
            let totalPoints = 0;
            for (const assignmentQuiz of assignmentsQuizzes) {
              if (assignmentQuiz.lastSubmission !== null) {
                totalScore += assignmentQuiz.lastSubmission.score;
              }
              totalPoints += assignmentQuiz.totalPoints;
            }
            setTotalScore(totalScore);
            setTotalPoints(totalPoints);
          })
          .catch(function (e) {
            console.log(e);
          });
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

  const toCourse = () => {
    navigate("/course", {
      state: {
        user: user,
        course: course,
      },
    });
  };

  const createGrade = (assignmentQuiz) => {
    return (
      <tr key={assignmentQuiz._id}>
        <td>{assignmentQuiz.name}</td>
        <td>{assignmentQuiz.type.charAt(0).toUpperCase() + assignmentQuiz.type.slice(1)}</td>
        <td>{assignmentQuiz.dueDate}</td>
        <td>
          {assignmentQuiz.lastSubmission === null ? 0 : assignmentQuiz.lastSubmission.score}/
          {assignmentQuiz.totalPoints}
        </td>
      </tr>
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
            {/* Content centered */}
            <div className="text-center" style={{
              backgroundColor: '#f0f0f0', // Light grey background; adjust color as needed
              borderRadius: '10px', // Adjust this value to control the curve of the edges
              padding: '20px', // Adjust for internal spacing
              margin: '20px 0', // Optional: adds space above and below the box
            }}>
              <h1>
                {course.name} Grades for {user.firstName} {user.lastName}
              </h1>
            </div>
            <Table striped bordered hover style={{ borderRadius: '15px', borderCollapse: 'separate', borderSpacing: '0'}}>
              <thead style={{ backgroundColor: '#4CAF50', color: 'white' }}>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Due Date</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {assignmentsQuizzes.map((assignmentQuiz) => createGrade(assignmentQuiz))}
              </tbody>
            </Table>
            {totalPoints > 0 && (
              <h2 className="text-center">
                Total Grade: {totalScore}/{totalPoints}
              </h2>
            )}
            <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', // Center horizontally
                  alignItems: 'center' }}>
              <div style={{ 
                    width: 200, 
                    height: 200 
                  }}>
                    <CircularProgressbar
                        value={percentage}
                        text={`${percentage.toFixed(2)}%`}
                        styles={buildStyles({
                          // Customize the path, text, and background
                          pathColor: `rgba(62, 152, 199, ${percentage / 100})`,
                          textColor: '#f88',
                          trailColor: '#d6d6d6',
                          backgroundColor: '#3e98c7',
                        })}
                    />
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  </>
  );
}
