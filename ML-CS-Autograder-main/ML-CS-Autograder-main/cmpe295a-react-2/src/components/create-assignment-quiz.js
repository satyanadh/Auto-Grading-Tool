import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { format } from "date-fns";
import { Navbar, Nav} from "react-bootstrap";
import { FiArrowLeftCircle } from 'react-icons/fi';
import { FiPlusCircle, FiMinusCircle } from 'react-icons/fi';

export default function CreateAssignmentQuiz() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState(0);
  const [dueDate, setDueDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [questions, setQuestions] = useState([
    {
      name: "",
      description: "",
      funcDef: "",
      points: 0,
      solution: "",
      testCases: [{ input: "", output: "" }],
    },
  ]);
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
  const type = location.state.type;

  const handleInputChange = (setterFunction, value) => {
    try {
      // Automatically detect numbers and convert them, treat everything else as a string
      const formattedValue = isNaN(value) ? JSON.stringify(value) : JSON.stringify(Number(value));
      setterFunction(formattedValue);
    } catch (error) {
      console.error("Error formatting input:", error);
      // Fall back to original value in case of error
      setterFunction(JSON.stringify(value));
    }
  };

  const createAssignmentQuiz = (e) => {
    e.preventDefault();
  
    setErrorMessage(""); // Clear any previous error messages at the start
  
    const totalQuestionPoints = questions.reduce((acc, question) => acc + parseInt(question.points), 0);
    if (totalQuestionPoints !== parseInt(points)) {
      setErrorMessage(`Total points of questions (${totalQuestionPoints}) must equal the total points for the assignment/quiz (${points}).`);
      return;
    }
  
    const funcDefRegex = /^def\s+\w+\s*\(([^)]*)\)\s*:/;
    for (const question of questions) {
      if (!question.funcDef || !funcDefRegex.test(question.funcDef)) {
        setErrorMessage(`Function Definition in one or more questions is either empty or does not match the required format ('def func_name(params):').`);
        return;
      }
    }
  
    try {
      const formattedQuestions = questions.map(question => ({
        ...question,
        points: parseInt(question.points),
        testCases: question.testCases.map(testCase => ({
          input: JSON.parse(JSON.stringify(testCase.input)),
          output: JSON.parse(JSON.stringify(testCase.output))
        }))
      }));
  
      axios.post("http://localhost:3001/api/v1/assgs/", {
        course: course._id,
        type: type,
        name: name,
        description: description,
        dueDate: format(new Date(dueDate), "MM-dd-yyyy"),
        totalPoints: parseInt(points),
        questions: formattedQuestions,
      }).then(response => {
        if (response.data.status === true) {
          toAssignmentsQuizzes();
        } else {
          alert("Assignment creation failed!");
        }
      }).catch(error => {
        console.log(error);
        setErrorMessage("Error submitting assignment.");
      });
    } catch (error) {
      console.error("JSON parsing error in test cases:", error);
      setErrorMessage("Invalid JSON format in test cases. Please check and correct.");
    }
  };
  const addQuestion = () => {
    questions.push({
      name: "",
      description: "",
      funcDef: "",
      points: 0,
      solution: "",
      testCases: [{ input: "", output: "" }],
    });
    setQuestions([...questions]);
  };

  const addTestCase = (question) => {
    question.testCases.push({
      input: "",
      output: "",
    });
    setQuestions([...questions]);
  };

  const setQuestionProperty = (question, property, e) => {
    question[property] = e.target.value;
    setQuestions([...questions]);
  };

  const toAssignmentsQuizzes = () => {
    navigate(`/${type === "assignment" ? "assignments" : "quizzes"}`, {
      state: {
        user: user,
        course: course,
      },
    });
  };

  const logout = () => {
    navigate("/");
  };

  const removeTestCase = (questionIndex, testCaseIndex) => {
    // Create a new array without the specific test case
    const updatedTestCases = questions[questionIndex].testCases.filter((_, index) => index !== testCaseIndex);
  
    // Update the specific question's test cases
    const updatedQuestions = questions.map((question, qIndex) => {
      if (qIndex === questionIndex) {
        return { ...question, testCases: updatedTestCases };
      }
      return question;
    });
  
    setQuestions(updatedQuestions);
  };

  const removeQuestion = (questionIndex) => {
    const updatedQuestions = questions.filter((_, index) => index !== questionIndex);
    setQuestions(updatedQuestions);
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

    <Container className="p-5" fluid style={{ backgroundColor: '#f0f0f0' }}>
      <Row className="justify-content-center">
        <Col xs={12} sm={10}>
          <div className="p-5 shadow rounded">
            <div className="text-center">
              <h1 style={{color : 'green'}}>Create {type.charAt(0).toUpperCase() + type.slice(1)}</h1>
            </div>
            <hr className="m-4" />
            <Form onSubmit={createAssignmentQuiz}>
              <Form.Group>
                <Form.Label className="fw-bold">Name of {type.charAt(0).toUpperCase() + type.slice(1)}</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{
                    height: '50px', // Increase height for a bigger text box
                    borderColor: 'black', // Example for a noticeable border color
                    borderWidth: '1px', // Thicker border
                    fontSize: '16px', // Larger text size inside the input
                  }}
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label className="fw-bold">Description of {type.charAt(0).toUpperCase() + type.slice(1)}</Form.Label>
                <Form.Control
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  style={{
                    height: '100px', // Increase height for a bigger text box
                    borderColor: 'black', // Example for a noticeable border color
                    borderWidth: '1px', // Thicker border
                    fontSize: '16px', // Larger text size inside the input
                  }}
                />
              </Form.Group>
              <Row>
                <Col md={6}> {/* Adjust the 'md' value as needed for different screen sizes */}
                  <Form.Group className="mt-3">
                    <Form.Label className="fw-bold">Points to {type.charAt(0).toUpperCase() + type.slice(1)}</Form.Label>
                    <Form.Control
                      type="number"
                      step="1"
                      min="0"
                      value={points}
                      onChange={(e) => setPoints(e.target.value)}
                      required
                      style={{
                        borderColor: 'black', // Example for a noticeable border color
                        borderWidth: '1px', // Thicker border
                        fontSize: '16px', // Larger text size inside the input
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mt-3">
                    <Form.Label className="fw-bold" style={{ color: 'red' }}>Due Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      required
                      style={{
                        borderColor: 'black', // Example for a noticeable border color
                        borderWidth: '1px', // Thicker border
                        fontSize: '16px', // Larger text size inside the input
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <div className="my-4">
                <h2>Questions</h2>
                {questions.map((question, i) => (
                  <div key={`q-${i}`} className="shadow rounded mt-3 p-4">
                    <Form.Group>
                      <Form.Label className="fw-bold">Name</Form.Label>
                      <Form.Control
                        as="textarea"
                        value={question.name}
                        onChange={(e) => setQuestionProperty(question, "name", e)}
                        required
                        style={{
                          height: '50px', // Increase height for a bigger text box
                          borderColor: 'black', // Example for a noticeable border color
                          borderWidth: '1px', // Thicker border
                          fontSize: '16px', // Larger text size inside the input
                        }}
                      />
                    </Form.Group>
                    <Form.Group className="mt-3">
                      <Form.Label className="fw-bold">Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        value={question.description}
                        onChange={(e) => setQuestionProperty(question, "description", e)}
                        required
                        style={{
                          height: '100px', // Increase height for a bigger text box
                          borderColor: 'black', // Example for a noticeable border color
                          borderWidth: '1px', // Thicker border
                          fontSize: '16px', // Larger text size inside the input
                        }}
                      />
                    </Form.Group>
                    <Form.Group className="mt-3">
                      <Form.Label className="fw-bold">Function Definition</Form.Label>
                      <Form.Text className="text-muted">
                        Please enter the function definition in the format: "def func_name(params):"
                      </Form.Text>
                      <Form.Control
                        as="textarea"
                        value={question.funcDef}
                        onChange={(e) => setQuestionProperty(question, "funcDef", e)}
                        required
                        style={{
                          height: '100px', // Increase height for a bigger text box
                          borderColor: 'black', // Example for a noticeable border color
                          borderWidth: '1px', // Thicker border
                          fontSize: '16px', // Larger text size inside the input
                        }}
                        placeholder="def func_name(params):"
                      />
                    </Form.Group>
                    <Form.Group className="mt-3">
                      <Form.Label className="fw-bold">Points</Form.Label>
                      <Form.Control
                        type="number"
                        step={1.0}
                        min={0}
                        value={question.points}
                        onChange={(e) => setQuestionProperty(question, "points", e)}
                        required
                        style={{
                          borderColor: 'black', // Example for a noticeable border color
                          borderWidth: '1px', // Thicker border
                          fontSize: '16px', // Larger text size inside the input
                        }}
                      />
                    </Form.Group>
                    <Form.Group className="mt-3">
                      <Form.Label className="fw-bold">Solution</Form.Label>
                      <Form.Control
                        as="textarea"
                        value={question.solution}
                        onChange={(e) => setQuestionProperty(question, "solution", e)}
                        style={{
                          height: '100px', // Increase height for a bigger text box
                          borderColor: 'black', // Example for a noticeable border color
                          borderWidth: '1px', // Thicker border
                          fontSize: '16px', // Larger text size inside the input
                        }}
                      />
                    </Form.Group>
                    <h3 className="mt-3">Test Cases</h3>
                    {question.testCases.map((testCase, j) => (
                      <div key={`tc-${j}`} className="shadow rounded mt-3 p-4">
                        <Form.Group>
                          <Form.Label className="fw-bold">Input</Form.Label>
                          <Form.Control
                            type="text"
                            value={testCase.input} // Ensures the displayed value is user-friendly
                            onChange={(e) => setQuestionProperty(testCase, "input", e)}
                            required
                            placeholder='Enter a value (e.g., 42 or Even or [1,2,3,4,5] )'
                            style={{
                              height: '50px',
                              borderColor: 'black',
                              borderWidth: '1px',
                              fontSize: '16px',
                            }}
                          />
                        </Form.Group>
                        <Form.Group className="mt-3">
                          <Form.Label className="fw-bold">Output</Form.Label>
                          <Form.Control
                            type="text"
                            value={testCase.output} // Ensures the displayed value is user-friendly
                            onChange={(e) => setQuestionProperty(testCase, "output", e)}
                            required
                            placeholder='Enter expected output (e.g., Even)'
                            style={{
                              height: '50px',
                              borderColor: 'black',
                              borderWidth: '1px',
                              fontSize: '16px',
                            }}
                          />
                        </Form.Group>
                                      {question.testCases.length > 1 && (
                          <Button variant="danger" type="button" className="mt-3 me-2" onClick={() => removeTestCase(i, j)}>
                            <FiMinusCircle className="me-2" />Remove Test Case
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      variant="primary"
                      type="button"
                      className="button-ash w-30 mt-3"
                      onClick={() => addTestCase(question)}
                      style={{
                        backgroundColor: '#4CAF50', marginBottom: '10px', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '0px', marginRight: '20px',
                      }}
                    >
                      <FiPlusCircle className="me-2" />Add Test Case
                    </Button>
                    {questions.length > 1 && (
                      <Button
                        variant="danger"
                        type="button"
                        onClick={() => removeQuestion(i)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#dc3545', // Bootstrap 'danger' color
                          color: 'white',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '20px',
                          marginLeft: '0px',
                          marginRight: '20px',
                          marginBottom: '5px',
                        }}
                      >
                        <FiMinusCircle className="me-2" size={20}/>Remove Question
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="primary"
                  type="button"
                  className="button-ash w-30 mt-3"
                  onClick={addQuestion}
                  style={{
                    backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '0px', marginRight: '20px',
                  }}
                >
                  <FiPlusCircle className="me-2" />Add Another Question
                </Button>
              </div>
              <div className="text-center">
                <Button variant="primary" type="submit" className="button-ash w-50 mt-3" 
                 style={{
                  backgroundColor: '#004085', marginBottom: '10px', color: 'white', padding: '10px 20px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '250px',
                }}
                >
                  Create
                </Button>
                {errorMessage && <div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>}
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  </>
  );
}
