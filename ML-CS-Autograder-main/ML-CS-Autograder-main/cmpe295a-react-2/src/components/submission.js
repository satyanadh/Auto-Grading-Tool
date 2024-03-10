import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Form from "react-bootstrap/Form";

export default function Submission() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state === null) {
      navigate("/");
    }
  }, []);

  if (location.state === null) {
    return;
  }

  const user = location.state.user;
  const course = location.state.course;
  const assignmentQuiz = location.state.assignmentQuiz;
  const submission = location.state.submission;

  const toSubmissions = () => {
    navigate(`/submissions`, {
      state: {
        user: user,
        course: course,
        assignmentQuiz: assignmentQuiz,
      },
    });
  };

  const createQuestion = (question, i) => {
    let finalAnswer = null;
    for (const answer of submission.answers) {
      if (answer.question === question._id) {
        finalAnswer = answer;
        break;
      }
    }
    return (
      <Row key={question._id} className={i > 0 ? "mt-5" : ""}>
        <Col>
          <h2>
            {i + 1}. {question.name} ({finalAnswer === null ? 0 : finalAnswer.points}/
            {question.points} points)
          </h2>
          <h4>{question.description}</h4>
          <Form.Control type="text" value={question.funcDef} readOnly={true} />
          {(finalAnswer === null || !("fileURL" in finalAnswer)) && (
            <h5 className="mt-3">No answer</h5>
          )}
          {finalAnswer !== null && (
            <a href={finalAnswer.fileURL}>
              <Image src={finalAnswer.fileURL} className="max-height-200 mt-3" rounded fluid />
            </a>
          )}
        </Col>
      </Row>
    );
  };

  return (
    <Container className="p-5" fluid>
      <Row className="justify-content-center">
        <Col xs={12} sm={10}>
          <div className="p-5 shadow rounded">
            <div className="text-center">
              <h1>{assignmentQuiz.name} Submission</h1>
              <h4>
                submitted {submission.dateSubmitted} | {submission.score}/
                {assignmentQuiz.totalPoints} points
              </h4>
              <Button
                variant="primary"
                type="button"
                onClick={toSubmissions}
                className="width-200 mt-1"
              >
                Submissions
              </Button>
              <hr className="m-4" />
              {assignmentQuiz.questions.map((question, i) => createQuestion(question, i))}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
