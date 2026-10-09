import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FaGithub,
  FaExternalLinkAlt,
  FaArrowLeft,
  FaCalendarAlt,
  FaTag,
} from 'react-icons/fa';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { projectService } from '../services/projectService';
import { IProject } from '../types';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<IProject | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const res = await projectService.getProjectById(id);
        if (res.success && res.data) {
          setProject(res.data);
        } else {
          setError('Project not found');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load project details');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return <LoadingSpinner message="Loading project specifications..." />;
  }

  if (error || !project) {
    return (
      <Container className="py-5 text-center">
        <div className="alert alert-warning d-inline-block px-4 py-3 mb-4">
          {error || 'Project not found'}
        </div>
        <div>
          <Button variant="primary" onClick={() => navigate('/projects')}>
            Back to Projects
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <div className="py-5">
      <Container>
        {/* Back Link */}
        <div className="mb-4">
          <Link
            to="/projects"
            className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-2 rounded-pill px-3"
          >
            <FaArrowLeft size={12} />
            <span>Back to All Projects</span>
          </Link>
        </div>

        <Row className="gy-4">
          {/* Main Info */}
          <Col lg={8}>
            <div className="custom-card p-4 p-md-5 mb-4">
              <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                <Badge bg="primary" className="px-3 py-2 rounded-pill fs-6">
                  {project.category}
                </Badge>
                {project.featured && (
                  <Badge bg="warning" text="dark" className="px-3 py-2 rounded-pill fs-6">
                    Featured Project
                  </Badge>
                )}
              </div>

              <h1 className="display-6 fw-bold mb-3">{project.title}</h1>

              <div className="rounded-4 overflow-hidden mb-4 shadow-sm">
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-100 object-fit-cover"
                  style={{ maxHeight: '420px' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80';
                  }}
                />
              </div>

              <h4 className="fw-bold mb-3">Project Overview</h4>
              <p className="lead fs-6 text-muted mb-4">{project.description}</p>

              {project.longDescription && (
                <>
                  <h4 className="fw-bold mb-3">Architecture & Technical Implementation</h4>
                  <p className="text-body-secondary mb-4" style={{ lineHeight: '1.8' }}>
                    {project.longDescription}
                  </p>
                </>
              )}

              <h4 className="fw-bold mb-3">Technologies Leveraged</h4>
              <div className="d-flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech, i) => (
                  <span key={i} className="tech-badge py-2 px-3 fs-6">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </Col>

          {/* Sidebar / Links */}
          <Col lg={4}>
            <Card className="custom-card p-4 position-sticky" style={{ top: '100px' }}>
              <h5 className="fw-bold mb-3">Project Metadata</h5>

              <ul className="list-unstyled mb-4 d-flex flex-column gap-3 small">
                <li className="d-flex justify-content-between pb-2 border-bottom">
                  <span className="text-muted d-flex align-items-center gap-2">
                    <FaTag size={13} />
                    <span>Category</span>
                  </span>
                  <span className="fw-semibold">{project.category}</span>
                </li>
                {project.createdAt && (
                  <li className="d-flex justify-content-between pb-2 border-bottom">
                    <span className="text-muted d-flex align-items-center gap-2">
                      <FaCalendarAlt size={13} />
                      <span>Added</span>
                    </span>
                    <span className="fw-semibold">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </li>
                )}
              </ul>

              <div className="d-grid gap-2">
                {project.liveDemoUrl && (
                  <a
                    href={project.liveDemoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary-gradient d-flex align-items-center justify-content-center gap-2"
                  >
                    <FaExternalLinkAlt size={14} />
                    <span>Launch Live Demo</span>
                  </a>
                )}

                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline-custom d-flex align-items-center justify-content-center gap-2"
                  >
                    <FaGithub size={16} />
                    <span>View Source Code</span>
                  </a>
                )}

                <Link
                  to="/contact"
                  className="btn btn-outline-secondary rounded-pill mt-2"
                >
                  Inquire About This Project
                </Link>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
