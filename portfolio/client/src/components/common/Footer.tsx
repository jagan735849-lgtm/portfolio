import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaEnvelope,
  FaHeart,
  FaShieldAlt,
  FaBook,
} from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { isAuthenticated } = useAuth();

  return (
    <footer
      className="mt-auto py-5 border-top"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-color)',
        transition: 'all 0.3s ease',
      }}
    >
      <Container>
        <Row className="gy-4 align-items-center justify-content-between">
          <Col md={5}>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="fw-bold fs-5">
                Alex Mercer<span className="text-primary">.dev</span>
              </span>
              <div className="status-indicator ms-2">
                <span className="pulse-dot"></span>
                <span>Available for hire</span>
              </div>
            </div>
            <p className="text-muted small mb-3" style={{ maxWidth: '420px' }}>
              Full-Stack Developer passionate about designing resilient cloud architectures, scalable backend services, and delightful user interfaces.
            </p>
            <div className="d-flex align-items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center p-2"
                style={{ width: '36px', height: '36px' }}
                aria-label="GitHub Profile"
              >
                <FaGithub size={16} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center p-2"
                style={{ width: '36px', height: '36px' }}
                aria-label="LinkedIn Profile"
              >
                <FaLinkedin size={16} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center p-2"
                style={{ width: '36px', height: '36px' }}
                aria-label="Twitter Profile"
              >
                <FaTwitter size={16} />
              </a>
              <a
                href="mailto:alex.mercer.dev@example.com"
                className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center p-2"
                style={{ width: '36px', height: '36px' }}
                aria-label="Email Contact"
              >
                <FaEnvelope size={16} />
              </a>
            </div>
          </Col>

          <Col sm={6} md={3}>
            <h6 className="fw-bold text-uppercase small tracking-wider mb-3">Navigation</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small mb-0">
              <li>
                <Link to="/" className="text-decoration-none text-muted">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-decoration-none text-muted">
                  About Me
                </Link>
              </li>
              <li>
                <Link to="/skills" className="text-decoration-none text-muted">
                  Technical Skills
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-decoration-none text-muted">
                  Featured Projects
                </Link>
              </li>
              <li>
                <Link to="/experience" className="text-decoration-none text-muted">
                  Experience & Education
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-decoration-none text-muted">
                  Get In Touch
                </Link>
              </li>
            </ul>
          </Col>

          <Col sm={6} md={3}>
            <h6 className="fw-bold text-uppercase small tracking-wider mb-3">Developer & Admin</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small mb-0">
              <li>
                <a
                  href="http://localhost:5000/api-docs"
                  target="_blank"
                  rel="noreferrer"
                  className="text-decoration-none text-muted d-flex align-items-center gap-1"
                >
                  <FaBook size={12} className="text-primary" />
                  <span>Swagger API Docs</span>
                </a>
              </li>
              <li>
                <a
                  href="http://localhost:5000/api/health"
                  target="_blank"
                  rel="noreferrer"
                  className="text-decoration-none text-muted"
                >
                  API Health Status
                </a>
              </li>
              <li>
                {isAuthenticated ? (
                  <Link
                    to="/admin"
                    className="text-decoration-none text-primary fw-medium d-flex align-items-center gap-1"
                  >
                    <FaShieldAlt size={12} />
                    <span>Admin Panel</span>
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="text-decoration-none text-muted d-flex align-items-center gap-1"
                  >
                    <FaShieldAlt size={12} />
                    <span>Admin Portal Login</span>
                  </Link>
                )}
              </li>
            </ul>
          </Col>
        </Row>

        <hr className="my-4" style={{ borderColor: 'var(--border-color)' }} />

        <div className="d-flex flex-column flex-sm-row align-items-center justify-content-between small text-muted gap-2">
          <div>
            &copy; {currentYear} Alex Mercer. Built with React, TypeScript, Express & MongoDB.
          </div>
          <div className="d-flex align-items-center gap-1">
            <span>Crafted with</span>
            <FaHeart className="text-danger" size={13} />
            <span>for high performance</span>
          </div>
        </div>
      </Container>
    </footer>
  );
};
