
import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import Editor from '@monaco-editor/react';

function App() {
  const editorRef = useRef(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  function showValue() {
    alert(editorRef.current.getValue());
  }

  function handleLanguageChange(event) {
    setSelectedLanguage(event.target.value);
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Left Side - Question and Example Test Cases */}
      <div style={{ flex: 1, padding: '20px' }}>
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
      </div>

      {/* Right Side - Editor and Run Code Button */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="language">Select Language:</label>
          <select id="language" value={selectedLanguage} onChange={handleLanguageChange}>
            <option value="javascript">JavaScript</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
          </select>
        </div>

        <div style={{ flex: 1 }}>
          <Editor
            height="70vh"
            language={selectedLanguage}
            defaultValue="// Enter your code here"
            onMount={handleEditorDidMount}
          />
        </div>

        <button style={{ alignSelf: 'flex-end', marginTop: '10px' }} onClick={showValue}>
          Run Code
        </button>
      </div>
    </div>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
