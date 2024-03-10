import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";

export default function CreateCourse() {
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
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

  const createCourse = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:3001/api/v1/courses", {
        name: courseName,
        description: courseDescription,
        instructor: user._id,
      })
      .then(function (response) {
        if (response.data.status === true) {
          toDashboard();
        } else {
          alert("Course creation failed! ");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const toDashboard = () => {
    navigate("/dashboard", { state: { user: user } });
  };

  return (
    <Container className="p-5" fluid>
      <Row className="justify-content-center">
        <Col xs={12} sm={10}>
          <div className="p-5 shadow rounded">
            <div className="text-center">
              <h1>Create Course</h1>
              <Button
                variant="primary"
                type="button"
                onClick={toDashboard}
                className="width-200 mt-1"
              >
                Dashboard
              </Button>
            </div>
            <hr className="m-4" />
            <Form onSubmit={createCourse}>
              <Form.Group>
                <Form.Label>Course Name</Form.Label>
                <Form.Control
                  type="text"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label>Course Description</Form.Label>
                <Form.Control
                  type="text"
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100 mt-3">
                Create
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
