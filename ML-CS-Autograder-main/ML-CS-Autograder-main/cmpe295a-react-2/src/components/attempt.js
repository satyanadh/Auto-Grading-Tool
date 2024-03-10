import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { format } from "date-fns";
import axios from "axios";
import { ReactSketchCanvas } from "react-sketch-canvas";

export default function Attempt() {
  const [submissionTypes, setSubmissionTypes] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const canvasRefs = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state === null) {
      navigate("/");
    }

    const types = [];
    for (const question of assignmentQuiz.questions) {
      types.push("upload");
    }
    setSubmissionTypes(types);

    const files = [];
    for (const question of assignmentQuiz.questions) {
      files.push(null);
    }
    setSelectedFiles(files);

    canvasRefs.current = canvasRefs.current.slice(0, assignmentQuiz.questions.length);
  }, []);

  if (location.state === null) {
    return;
  }

  const user = location.state.user;
  const course = location.state.course;
  const assignmentQuiz = location.state.assignmentQuiz;

  const changeSubmissionType = (i, type) => {
    submissionTypes[i] = type;
    setSubmissionTypes([...submissionTypes]);
  };

  const selectFile = (e, i) => {
    const file = e.target.files[0];
    selectedFiles[i] = file;
    setSelectedFiles([...selectedFiles]);
  };

  const submit = async () => {
    const submitFormData = new FormData();
    submitFormData.append("student", user._id);
    submitFormData.append("dateSubmitted", format(new Date(), "MM-dd-yyyy"));

    for (let i = 0; i < submissionTypes.length; i++) {
      const submissionType = submissionTypes[i];
      let file = null;
      if (submissionType === "upload") {
        file = selectedFiles[i];
      } else {
        const canvasRef = canvasRefs.current[i];
        const data = await canvasRef.exportImage("png");
        const decodedString = atob(data.split(",")[1]);
        const byteArray = new Uint8Array(decodedString.length);
        for (let j = 0; j < decodedString.length; j++) {
          byteArray[j] = decodedString.charCodeAt(j);
        }
        const blob = new Blob([byteArray], { type: "image/png" });
        file = new File([blob], `${user._id}_${course._id}_${assignmentQuiz._id}_.png`, {
          type: "image/png",
        });
      }
      submitFormData.append("fileURL", file);
    }

    const answers = [];
    for (const question of assignmentQuiz.questions) {
      answers.push({ question: question._id });
    }
    submitFormData.append("answers", JSON.stringify(answers));

    axios
      .post(`http://localhost:3001/api/v1/assgs/submit/${assignmentQuiz._id}`, submitFormData)
      .then(function (response) {
        if (response.status === 200) {
          navigate("/submissions", {
            state: {
              user: user,
              course: course,
              assignmentQuiz: assignmentQuiz,
            },
          });
        } else {
          alert("Submission failed!");
        }
      })
      .catch(function (e) {
        console.log(e.response);
      });
  };

  const toAssignmentsQuizzes = () => {
    navigate(`/${assignmentQuiz.type === "assignment" ? "assignments" : "quizzes"}`, {
      state: {
        user: user,
        course: course,
      },
    });
  };

  const createQuestion = (question, i) => {
    return (
      <Row key={question._id} className={i > 0 ? "mt-5" : ""}>
        <Col>
          <h2>
            {i + 1}. {question.name} ({question.points} points)
          </h2>
          <h4>{question.description}</h4>
          <Form.Control type="text" value={question.funcDef} readOnly={true} />
          <Form className="mt-2">
            <Form.Check
              type="radio"
              id={`${question._id}-upload`}
              label="Upload"
              name={question._id}
              checked={submissionTypes[i] === "upload"}
              onChange={(e) => changeSubmissionType(i, "upload")}
              inline
            />
            <Form.Check
              type="radio"
              id={`${question._id}-canvas`}
              label="Canvas"
              name={question._id}
              checked={submissionTypes[i] === "canvas"}
              onChange={(e) => changeSubmissionType(i, "canvas")}
              inline
            />
          </Form>
          {submissionTypes[i] === "upload" && (
            <Form.Control type="file" className="mt-3" onChange={(e) => selectFile(e, i)} />
          )}
          {submissionTypes[i] === "canvas" && (
            <Row>
              <Col>
                <div className="mt-3 height-500">
                  <ReactSketchCanvas
                    ref={(el) => (canvasRefs.current[i] = el)}
                    strokeColor="black"
                    strokeWidth={8}
                  />
                </div>
                <Button
                  variant="primary"
                  type="button"
                  onClick={() => canvasRefs.current[i].clearCanvas()}
                  className="width-200 mt-3"
                >
                  Clear
                </Button>
              </Col>
            </Row>
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
              <h1>{assignmentQuiz.name}</h1>
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
              <hr className="m-4" />
              {assignmentQuiz.questions.map((question, i) => createQuestion(question, i))}
              <Button variant="primary" type="button" onClick={submit} className="width-200 mt-5">
                Submit
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
