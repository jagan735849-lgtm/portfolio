import React, { useState } from 'react';
import { Navbar as BsNavbar, Nav, Container, Button } from 'react-bootstrap';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { BsCodeSlash, BsBoxArrowRight, BsSpeedometer2 } from 'react-icons/bs';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../../hooks/useAuth';

export const Navbar: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const closeNav = () => setExpanded(false);

  return (
    <BsNavbar
      expand="lg"
      sticky="top"
      expanded={expanded}
      className="glass-nav py-3"
      aria-label="Main Navigation"
    >
      <Container>
        <Link to="/" onClick={closeNav} className="navbar-brand d-flex align-items-center gap-2">
          <div
            className="d-flex align-items-center justify-content-center rounded-3 p-2 text-white"
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)',
            }}
          >
            <BsCodeSlash size={20} />
          </div>
          <span className="fw-bold fs-5 tracking-tight">
            Alex<span className="text-primary">.dev</span>
          </span>
        </Link>

        <div className="d-flex align-items-center gap-2 d-lg-none">
          <ThemeToggle />
          <BsNavbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={() => setExpanded(!expanded)}
          />
        </div>

        <BsNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-lg-center gap-1 gap-lg-2 my-3 my-lg-0">
            <Nav.Link as={NavLink} to="/" onClick={closeNav} end className="px-3 fw-medium">
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/about" onClick={closeNav} className="px-3 fw-medium">
              About
            </Nav.Link>
            <Nav.Link as={NavLink} to="/skills" onClick={closeNav} className="px-3 fw-medium">
              Skills
            </Nav.Link>
            <Nav.Link as={NavLink} to="/projects" onClick={closeNav} className="px-3 fw-medium">
              Projects
            </Nav.Link>
            <Nav.Link as={NavLink} to="/experience" onClick={closeNav} className="px-3 fw-medium">
              Experience
            </Nav.Link>
            <Nav.Link as={NavLink} to="/contact" onClick={closeNav} className="px-3 fw-medium">
              Contact
            </Nav.Link>

            <div className="d-none d-lg-block ms-2 me-1">
              <ThemeToggle />
            </div>

            {isAuthenticated ? (
              <div className="d-flex align-items-center gap-2 mt-2 mt-lg-0 ms-lg-2">
                <Link
                  to="/admin"
                  onClick={closeNav}
                  className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1 rounded-pill px-3"
                >
                  <BsSpeedometer2 size={15} />
                  <span>Dashboard</span>
                </Link>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => {
                    closeNav();
                    handleLogout();
                  }}
                  className="d-flex align-items-center gap-1 rounded-pill px-3"
                  title={`Logged in as ${user?.name}`}
                >
                  <BsBoxArrowRight size={15} />
                  <span>Logout</span>
                </Button>
              </div>
            ) : null}
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
};
