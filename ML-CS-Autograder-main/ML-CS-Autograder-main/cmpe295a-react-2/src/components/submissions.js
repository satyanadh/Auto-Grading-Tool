import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import axios from "axios";

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

  const toAssignmentsQuizzes = () => {
    navigate(`/${assignmentQuiz.type === "assignment" ? "assignments" : "quizzes"}`, {
      state: {
        user: user,
        course: course,
      },
    });
  };

  const toSubmission = (submission) => {
    navigate("/submission", {
      state: {
        user: user,
        course: course,
        assignmentQuiz: assignmentQuiz,
        submission: submission,
      },
    });
  };

  return (
    <Container className="p-5" fluid>
      <Row className="justify-content-center">
        <Col xs={12} sm={10}>
          <div className="p-5 shadow rounded">
            <div className="text-center">
              <h1>{assignmentQuiz.name} Submissions</h1>
              <h4>
                due {assignmentQuiz.dueDate} | {assignmentQuiz.totalPoints} points
              </h4>
              <Button
                variant="primary"
                type="button"
                onClick={toAssignmentsQuizzes}
                className="width-200 mt-1"
              >
                {assignmentQuiz.type === "assignment" ? "Assignments" : "Quizzes"}
              </Button>
            </div>
            <hr className="m-4" />
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Date Submitted</th>
                  <th>Score</th>
                  <th>View</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => (
                  <tr key={submission._id}>
                    <td>
                      {submission.dateSubmitted}
                      {new Date(submission.dateSubmitted) > new Date(assignmentQuiz.dueDate) && (
                        <span> (LATE)</span>
                      )}
                    </td>
                    <td>{submission.score}</td>
                    <td>
                      <Button
                        variant="primary"
                        type="button"
                        onClick={() => toSubmission(submission)}
                        className="width-100"
                      >
                        View
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
  );
}
