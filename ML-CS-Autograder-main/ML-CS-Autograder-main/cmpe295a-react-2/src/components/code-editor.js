import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import Editor from '@monaco-editor/react';
import { CodeiumEditor } from "@codeium/react-code-editor";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect} from "react";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Navbar, Nav} from "react-bootstrap";
import { FiArrowLeftCircle } from 'react-icons/fi';
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

export default function CodeEditor() {

  const location = useLocation();
  const navigate = useNavigate();
  
  const editorRef = useRef(null);
  const [selectedLanguage, setSelectedLanguage] = useState('Python');
  const [viewMode, setViewMode] = useState('code'); // 'code' or 'image'
  const [compileResult, setCompileResult] = useState(null);

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


  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  function showValue() {
    alert(editorRef.current.getValue());
  }

  function handleLanguageChange(language) {
    setSelectedLanguage(language);
  }

  function compileAndSubmit() {
    // Simulate compilation and submission process
    const code = editorRef.current.getValue();
    // Simulate compilation result or error
    const compilationResult = Math.random() < 0.5 ? 'Compiled successfully!' : 'Compilation Error: Invalid syntax.';
    setCompileResult(compilationResult);
  }

  function toggleViewMode() {
    setViewMode(viewMode === 'code' ? 'image' : 'code');
  }

  const languages = ['Python', 'JavaScript', 'Go', 'Java', "C++"];

  const toSubmissions = () => {
    navigate(`/submissions`, {
      state: {
        user: user,
        course: course,
        assignmentQuiz: assignmentQuiz,
      },
    });
  };

  const logout = () => {
    navigate("/");
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
          {/* <Form.Control type="text" value={question.funcDef} readOnly={true} /> */}
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
    <>
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
        <Container>
        <Button 
          variant="light" 
          onClick={toSubmissions}
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
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f0f0f0' }}>
      {/* Left Side - Question and Example Test Cases */}
      <div style={{ flex: 1, padding: '20px', backgroundColor: '#fff', borderRadius: '10px', margin: '20px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', position: 'relative' }}>
        {/* Toggle button */}
        {/* Content based on view mode */}
        {viewMode === 'code' ? (
          <>
            {assignmentQuiz.questions.map((question, i) => createQuestion(question, i))}

          </>
        ) : (
            <img src="https://mcttan.files.wordpress.com/2016/02/basic-html-code.jpg?w=1200" alt="Student Submission" style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '10px' }} />

        )}
      </div>

      {/* Right Side - Editor and Run Code Button */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px', backgroundColor: '#fff', borderRadius: '10px', margin: '20px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'center' }}>
          {languages.map((language) => (
            <button
              key={language}
              style={{
                backgroundColor: selectedLanguage === language ? '#007bff' : '#6c757d',
                color: '#fff',
                border: 'none',
                padding: '5px 10px',
                cursor: 'pointer',
                borderRadius: '5px',
                marginRight: '10px',
              }}
              onClick={() => handleLanguageChange(language)}
            >
              {language.toUpperCase()}
            </button>
          ))}
        </div>

        <div style={{ flex: 1 }}>
          <CodeiumEditor
            height="70vh"
            language={selectedLanguage.toLowerCase()}
            defaultValue="// Enter your code here"
            onMount={handleEditorDidMount}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <button style={{ marginRight: '10px', padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }} onClick={showValue}>
            Run Code
          </button>
          <button style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }} onClick={compileAndSubmit}>
            Compile & Submit
          </button>
        </div>
        {compileResult && (
          <div style={{ position: 'absolute', bottom: '10px', left: '20px', backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '10px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            {compileResult}
          </div>
        )}
      </div>
    </div>
   </Container>
  </>
  );
}
