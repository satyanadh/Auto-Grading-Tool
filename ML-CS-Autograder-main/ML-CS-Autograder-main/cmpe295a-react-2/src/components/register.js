import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import axios from "axios";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const register = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:3001/api/v1/users/signup", {
        firstName: firstName,
        lastName: lastName,
        email: email,
        username: username,
        password: password,
        role: role,
      })
      .then(function (response) {
        if (response.data.status === true) {
          setMessage("");
          navigate("/");
        } else {
          setMessage("Username or email already taken.");
        }
      })
      .catch(function (e) {
        console.log(e);
      });
  };

  return (
    <div className="register-container">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={20} md={16} lg={12}>
            <div className="p-4 shadow rounded bg-white">
              <Form onSubmit={register} className="mt-4">
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={firstName}
                    placeholder="Enter your First Name"
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    style={{ marginBottom: '1rem', borderRadius: '20px', border: '1px solid #ced4da', padding: '.375rem 1.75rem' }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={lastName}
                    placeholder="Enter your Last Name"
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    style={{ marginBottom: '1rem', borderRadius: '20px', border: '1px solid #ced4da', padding: '.375rem 1.75rem' }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    placeholder="Enter your Email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ marginBottom: '1rem', borderRadius: '20px', border: '1px solid #ced4da', padding: '.375rem 1.75rem' }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    value={username}
                    placeholder="Enter your username"
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={{ marginBottom: '1rem', borderRadius: '20px', border: '1px solid #ced4da', padding: '.375rem 1.75rem' }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    placeholder="Enter your password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ marginBottom: '1rem', borderRadius: '20px', border: '1px solid #ced4da', padding: '.375rem 1.75rem' }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select onChange={(e) => setRole(e.target.value)} 
                  style={{ marginBottom: '1rem', borderRadius: '20px', border: '1px solid #ced4da', padding: '.375rem 1.75rem' }}
                  required>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                  </Form.Select>
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100 mt-3" style={{ backgroundColor: '#000080', borderColor: '#000080', borderRadius: '20px', padding: '.375rem 0', fontSize: '1rem', color: 'white' }}>
                  Register
                </Button>
              </Form>
              <div className="text-center">
                <h5 className="mt-3">
                  Already have an account? <Link to="/">Login</Link>
                </h5>
              </div>
              {message !== "" && (
                <Alert variant="danger" className="mt-3 mb-0">
                  {message}
                </Alert>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}