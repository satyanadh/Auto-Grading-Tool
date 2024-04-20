import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import Editor from '@monaco-editor/react';
import { CodeiumEditor } from "@codeium/react-code-editor";

function App() {
  const editorRef = useRef(null);
  const [selectedLanguage, setSelectedLanguage] = useState('Python');
  const [viewMode, setViewMode] = useState('code'); // 'code' or 'image'
  const [compileResult, setCompileResult] = useState(null);

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

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f0f0f0' }}>
      {/* Left Side - Question and Example Test Cases */}
      <div style={{ flex: 1, padding: '20px', backgroundColor: '#fff', borderRadius: '10px', margin: '20px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', position: 'relative' }}>
        {/* Toggle button */}
        <button 
          style={{ position: 'center', top: '10px', left: '20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', width: '140px', height: '30px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', outline: 'none' }}
          onClick={toggleViewMode}
        >
          {viewMode === 'code' ? 'View Submission' : 'View Question'}
        </button>

        {/* Content based on view mode */}
        {viewMode === 'code' ? (
          <>
            <h2>Question 1</h2>
            <p>Given a positive integer N, The task is to write a Python program to check if the number is Prime or not in Python.</p>

            <h2>Example Test Cases</h2>
            <pre>
              <h4>Test Case 1</h4>
              Input:  n = 11<br />
              Output: True <br />

              <h4>Test Case 2</h4>
              Input:  n = 1 <br />
              Output: False <br />
                Output: ...
            </pre>
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
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
