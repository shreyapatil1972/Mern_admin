import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert, Spinner } from "react-bootstrap"; // Added Spinner
import { Link, useNavigate } from "react-router-dom";
import formImage from "../assets/formImage1.jpg";
import { loginAPI } from "../API/Api.js";

// Import the dedicated CSS file
import '../Css/LoginPage.css'; // <--- NEW: Import the dedicated CSS file

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false); // New state for loading
  const navigate = useNavigate();

  async function handleFormSubmit(e) {
    e.preventDefault();
    setError("");
    setIsLoggingIn(true); // Start loading

    try {
      const response = await loginAPI({ email, password });

      if (response.success && response.token) {
        alert("Login successful!");
        localStorage.setItem("token", response.token);

        // You might want to decode the token here to get user roles or other info
        // Example: const decodedToken = jwt_decode(response.token);
        // Based on decodedToken.isAdmin, navigate accordingly.
        // For now, redirecting all logins to home
        navigate("/");
      } else {
        setError(response.message || "Login failed. Invalid credentials.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.response?.data?.message || "An error occurred during login. Please try again.");
    } finally {
      setIsLoggingIn(false); // Stop loading
    }
  }

  return (
    <Container fluid className="login-page-container"> {/* Applied main container class */}
      <Row className="justify-content-center align-items-center login-row">
        <Col md={8} lg={6}>
          <Row className="login-form-card rounded overflow-hidden"> {/* Applied card class */}
            <Col md={6} className="p-0 d-none d-md-block">
              <img
                src={formImage}
                alt="Login Visual"
                className="w-100 h-100 login-image" // Applied image class
              />
            </Col>
            <Col md={6} className="p-4 login-form-section"> {/* Applied form section class */}
              <h3 className="mb-4 text-center login-title"> {/* Applied title class */}
                Login
              </h3>
              {error && <Alert variant="danger" className="login-error-alert">{error}</Alert>} {/* Applied alert class */}
              <Form onSubmit={handleFormSubmit}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label className="login-form-label">Email</Form.Label> {/* Applied label class */}
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="login-form-control" // Applied input class
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="formPassword">
                  <Form.Label className="login-form-label">Password</Form.Label> {/* Applied label class */}
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="login-form-control" // Applied input class
                  />
                </Form.Group>

                <Button
                  type="submit"
                  className="w-100 login-submit-btn" // Applied button class
                  disabled={isLoggingIn} // Disable while logging in
                >
                  {isLoggingIn ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />{' '}
                      Logging in...
                    </>
                  ) : (
                    'Login'
                  )}
                </Button>
              </Form>

              <div className="mt-3 text-center login-register-link"> {/* Applied link container class */}
                <span>New user? </span>
                <Link to="/RegisterPage" className="register-link-text"> {/* Applied link text class */}
                  Register here
                </Link>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;