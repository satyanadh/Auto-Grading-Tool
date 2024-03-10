import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import axios from "axios";

export default function Enroll() {
  const [courses, setCourses] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state === null) {
      navigate("/");
    }

    axios
      .get("http://localhost:3001/api/v1/courses/")
      .then(function (response) {
        setCourses(response.data);
      })
      .catch(function (e) {
        console.log(e);
      });
  }, []);

  if (location.state === null) {
    return;
  }

  const user = location.state.user;
  const enrolled = location.state.enrolled.map((course) => course._id);

  const toDashboard = () => {
    navigate("/dashboard", {
      state: {
        user: user,
      },
    });
  };

  const enroll = (course) => {
    axios
      .put(`http://localhost:3001/api/v1/courses/enroll/${course._id}`, {
        student: user._id,
      })
      .then(function (response) {
        if (response.data.status === true) {
          toDashboard();
        } else {
          alert("Course enrollment failed!");
        }
      })
      .catch(function (e) {
        console.log(e);
      });
  };

  return (
    <Container className="p-5" fluid>
      <Row className="justify-content-center">
        <Col xs={12} sm={10}>
          <div className="p-5 shadow rounded">
            <div className="text-center">
              <h1>Course Enrollment</h1>
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
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Course ID</th>
                  <th>Course Name</th>
                  <th>Teacher</th>
                  <th>Enroll</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course._id}>
                    <td>{course._id}</td>
                    <td>{course.name}</td>
                    <td>
                      {course.instructor
                        ? course.instructor.firstName + " " + course.instructor.lastName
                        : "Not Available"}
                    </td>
                    <td>
                      {enrolled.includes(course._id) ? (
                        <span>Already enrolled</span>
                      ) : (
                        <Button
                          variant="primary"
                          type="button"
                          onClick={() => enroll(course)}
                          className="width-100"
                        >
                          Enroll
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
  );
}
