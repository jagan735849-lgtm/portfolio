import React from 'react';
import { Container, Nav, Navbar as BsNavbar, Button } from 'react-bootstrap';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import {
  BsSpeedometer2,
  BsFolderCheck,
  BsTools,
  BsBriefcase,
  BsMortarboard,
  BsEnvelope,
  BsPersonGear,
  BsArrowLeft,
  BsBoxArrowRight,
} from 'react-icons/bs';
import { useAuth } from '../hooks/useAuth';
import { ThemeToggle } from '../components/common/ThemeToggle';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: 'var(--bg-main)' }}>
      {/* Admin Top Navigation */}
      <BsNavbar
        expand="lg"
        className="glass-nav py-2 border-bottom sticky-top"
        style={{ zIndex: 1020 }}
      >
        <Container fluid className="px-lg-4">
          <div className="d-flex align-items-center gap-3">
            <BsNavbar.Brand as={Link} to="/admin" className="d-flex align-items-center gap-2 m-0">
              <span className="badge bg-primary px-2 py-1 fs-6">Admin</span>
              <span className="fw-bold tracking-tight">Portfolio Manager</span>
            </BsNavbar.Brand>
            <Link to="/" className="btn btn-sm btn-outline-secondary d-none d-sm-flex align-items-center gap-1 rounded-pill px-3">
              <BsArrowLeft size={14} />
              <span>Public Site</span>
            </Link>
          </div>

          <div className="d-flex align-items-center gap-2">
            <span className="text-muted small d-none d-md-inline me-2">
              Signed in as <strong className="text-body">{user?.name || user?.email}</strong>
            </span>
            <ThemeToggle />
            <Button
              variant="outline-danger"
              size="sm"
              onClick={handleLogout}
              className="d-flex align-items-center gap-1 rounded-pill px-3"
            >
              <BsBoxArrowRight size={14} />
              <span className="d-none d-sm-inline">Logout</span>
            </Button>
          </div>
        </Container>
      </BsNavbar>

      {/* Admin Subnav */}
      <div
        className="border-bottom py-2 overflow-auto"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)',
        }}
      >
        <Container fluid className="px-lg-4">
          <Nav className="flex-nowrap gap-1">
            <Nav.Link
              as={NavLink}
              to="/admin"
              end
              className="px-3 py-2 rounded-3 text-nowrap d-flex align-items-center gap-2"
            >
              <BsSpeedometer2 size={16} />
              <span>Dashboard</span>
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/admin/projects"
              className="px-3 py-2 rounded-3 text-nowrap d-flex align-items-center gap-2"
            >
              <BsFolderCheck size={16} />
              <span>Projects</span>
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/admin/skills"
              className="px-3 py-2 rounded-3 text-nowrap d-flex align-items-center gap-2"
            >
              <BsTools size={16} />
              <span>Skills</span>
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/admin/experience"
              className="px-3 py-2 rounded-3 text-nowrap d-flex align-items-center gap-2"
            >
              <BsBriefcase size={16} />
              <span>Experience</span>
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/admin/education"
              className="px-3 py-2 rounded-3 text-nowrap d-flex align-items-center gap-2"
            >
              <BsMortarboard size={16} />
              <span>Education</span>
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/admin/messages"
              className="px-3 py-2 rounded-3 text-nowrap d-flex align-items-center gap-2"
            >
              <BsEnvelope size={16} />
              <span>Messages</span>
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/admin/profile"
              className="px-3 py-2 rounded-3 text-nowrap d-flex align-items-center gap-2"
            >
              <BsPersonGear size={16} />
              <span>Profile Settings</span>
            </Nav.Link>
          </Nav>
        </Container>
      </div>

      {/* Main Admin Content */}
      <main className="flex-grow-1 py-4">
        <Container fluid className="px-lg-4">
          <Outlet />
        </Container>
      </main>
    </div>
  );
};
