import React from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="py-5 d-flex align-items-center justify-content-center text-center" style={{ minHeight: '70vh' }}>
      <Container style={{ maxWidth: '520px' }}>
        <h1 className="display-1 fw-extrabold text-primary mb-2">404</h1>
        <h2 className="fw-bold mb-3">Page Not Found</h2>
        <p className="text-muted mb-4">
          The requested page could not be found or has been moved to another location.
        </p>
        <Link to="/" className="btn btn-primary-gradient d-inline-flex align-items-center gap-2 px-4 py-2">
          <FaHome size={16} />
          <span>Return Home</span>
        </Link>
      </Container>
    </div>
  );
};
