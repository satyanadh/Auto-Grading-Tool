import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal'; // Import Modal component
import axios from 'axios';
import backgroundImage from '../images/LMS.jpg'; // Replace with your actual background image path
import Register from './register'; // Import the Register component

const customStyles = {
  navbar: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Keep existing navbar transparency
  },
  button: {
    backgroundColor: 'transparent', // Transparent background for buttons
    color: 'white', // White text color for buttons
    border: '2px solid white', // White border for buttons
    borderRadius: '5px', // Rounded corners for buttons
    padding: '6px 20px', // Padding for a button-like appearance
    fontWeight: 'bold',
    fontSize: '18px',
    margin: '0 5px', // Space between buttons
    display: 'inline-block', // Necessary for proper spacing and positioning
    transition: 'all 0.3s ease', // Smooth transition for hover effects
  },
  buttonHover: {
    backgroundColor: '#ffffff', // White background on hover
    color: '#007bff', // Text color changes on hover (e.g., blue for contrast)
  },
  navbarBrand: {
    color: 'white', // Set the text color to white for visibility
    textDecoration: 'none', // Remove any underline effect
    fontWeight: 'bold', // Optional: if you want the brand text to be bold
    fontSize: '20px', // Optional: adjust based on your design preferences
  },
};

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const login = (e) => {
    e.preventDefault();

    axios
      .post('http://localhost:3001/api/v1/users/login', {
        username: username,
        password: password,
      })
      .then(function (response) {
        if (response.data.status === true) {
          setMessage('');
          navigate('/dashboard', {
            state: {
              user: response.data.userData,
            },
          });
        } else {
          setMessage('Invalid username or password.');
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleRegisterClick = () => setShowRegisterModal(true);
  const handleRegisterClose = () => setShowRegisterModal(false);
  const handleLoginClick = () => setShowLoginModal(true);
  const handleLoginClose = () => setShowLoginModal(false);


  const handleShowRegister = () => {
      setShowLoginModal(false); // Close the login modal
      setShowRegisterModal(true); // Open the register modal
  };

  const containerStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  const [isHoveringLogin, setIsHoveringLogin] = useState(false);
  const [isHoveringSignUp, setIsHoveringSignUp] = useState(false);

  return (
    <>
    <div style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}>
        <Navbar expand="lg" sticky="top">
          <Container>
           <Navbar.Brand href="#home" style={customStyles.navbarBrand}>CMPE 295 LMS</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
              <Nav.Link href="#Home"
              style={customStyles.navbarBrand}>
                Home
              </Nav.Link>
              <Nav.Link
                href="#login"
                style={isHoveringLogin ? {...customStyles.button, ...customStyles.buttonHover} : customStyles.button}
                onMouseEnter={() => setIsHoveringLogin(true)}
                onMouseLeave={() => setIsHoveringLogin(false)}
                onClick={() => setShowLoginModal(true)}
              >
                Login
              </Nav.Link>
              <Nav.Link
                href="#signup"
                style={isHoveringSignUp ? {...customStyles.button, ...customStyles.buttonHover} : customStyles.button}
                onMouseEnter={() => setIsHoveringSignUp(true)}
                onMouseLeave={() => setIsHoveringSignUp(false)}
                onClick={() => setShowRegisterModal(true)}
              >
                SignUp
              </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

      <Container style={containerStyle} className="p-5 min-vh-100 position-relative">
        <div className="position-absolute start-0 top-50 translate-middle-y text-start" style={{ fontStyle: 'italic' }}>
          <h1 className="text-light" style={{ color: 'black', marginLeft: '20px' }}>Everything is Theoretically impossible,</h1>
          <h1 className="text-light" style={{ color: 'black', marginLeft: '20px' }}>until it is done.</h1>
          <h2 className="text-light" style={{ color: 'black', marginLeft: '300px' }}>  - Robert A. Heinlein</h2>
        </div>
      </Container>
      {/* Register Modal */}
      <Modal show={showRegisterModal} onHide={handleRegisterClose}>
        <Modal.Header closeButton>
          <Modal.Title  style={{ textAlign: 'center', width: '100%' }}>Register as a New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Register />
        </Modal.Body>
      </Modal>
      {/* Login Modal */}
      <Modal show={showLoginModal} onHide={handleLoginClose} centered>
      <Modal.Header closeButton style={{ borderBottom: 'none', justifyContent: 'center' }}>
  <Modal.Title style={{ textAlign: 'center', width: '100%' }}>Login</Modal.Title>
</Modal.Header>
  <Modal.Body style={{ padding: '2rem' }}>
    <Form onSubmit={login}>
      <Form.Group className="mb-3">
        <Form.Label>User Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter your email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ marginBottom: '1rem', borderRadius: '20px', border: '1px solid #ced4da', padding: '.375rem 1.75rem' }}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ marginBottom: '1rem', borderRadius: '20px', border: '1px solid #ced4da', padding: '.375rem 1.75rem' }}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check type="checkbox" label="Remember me" />
      </Form.Group>
      {message !== "" && (
        <Alert variant="danger" className="mt-3 mb-3">{message}</Alert>
      )}
      <div className="d-grid gap-2">
        <Button type="submit" style={{ backgroundColor: '#000080', borderColor: '#000080', borderRadius: '20px', padding: '.375rem 0', fontSize: '1rem', color: 'white' }}>
          Login
        </Button>
      </div>
      <div className="mt-3 text-center">
          Not a member? <a href="#" onClick={handleShowRegister} style={{ cursor: 'pointer', color: '#000080' }}>Signup Now</a>
      </div>
    </Form>
  </Modal.Body>
</Modal>
    </div>
    </>
  );
}