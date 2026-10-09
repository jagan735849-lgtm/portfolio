import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge, Form, InputGroup, Button, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
  FaGithub,
  FaExternalLinkAlt,
  FaSearch,
  FaArrowRight,
  FaRedo,
} from 'react-icons/fa';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { projectService } from '../services/projectService';
import { IProject } from '../types';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [category, setCategory] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const categories = ['All', 'Full Stack', 'Frontend', 'Backend', 'AI/ML', 'Cloud/DevOps'];

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await projectService.getProjects({
        page,
        limit: 6,
        category: category !== 'All' ? category : undefined,
        search: search.trim() ? search.trim() : undefined,
      });

      if (res.success && res.data) {
        setProjects(res.data);
        if (res.pagination) {
          setTotalPages(res.pagination.totalPages);
          setTotal(res.pagination.total);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [category, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProjects();
  };

  const handleCategorySelect = (cat: string) => {
    setCategory(cat);
    setPage(1);
  };

  return (
    <div className="py-5">
      <Container>
        {/* Header */}
        <div className="text-center mx-auto mb-5" style={{ maxWidth: '650px' }}>
          <span className="text-primary text-uppercase fw-semibold small tracking-widest">
            Portfolio
          </span>
          <h1 className="display-5 fw-bold mt-1">Featured Projects</h1>
          <p className="lead text-muted">
            Explore my recent production web platforms, open-source repositories, and technical experiments.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="mb-5">
          <Row className="gy-3 align-items-center justify-content-between">
            <Col lg={8}>
              <div className="d-flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={category === cat ? 'primary' : 'outline-secondary'}
                    size="sm"
                    className="rounded-pill px-3 py-1"
                    onClick={() => handleCategorySelect(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </Col>

            <Col lg={4}>
              <Form onSubmit={handleSearchSubmit}>
                <InputGroup size="sm">
                  <InputGroup.Text className="bg-transparent border-end-0">
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Search projects by name or technology..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border-start-0"
                  />
                  <Button variant="primary" type="submit">
                    Search
                  </Button>
                </InputGroup>
              </Form>
            </Col>
          </Row>
        </div>

        {/* Content State */}
        {loading ? (
          <LoadingSpinner message="Fetching projects from database..." minHeight="350px" />
        ) : error ? (
          <div className="text-center py-5">
            <div className="alert alert-danger d-inline-block px-4 py-3">{error}</div>
            <div>
              <Button variant="outline-primary" onClick={fetchProjects} className="mt-3">
                <FaRedo className="me-2" />
                Retry
              </Button>
            </div>
          </div>
        ) : projects.length === 0 ? (
          <EmptyState
            title="No projects found"
            description="No projects match your current category filter or keyword."
            actionText="Clear Filters"
            onAction={() => {
              setCategory('All');
              setSearch('');
              setPage(1);
            }}
          />
        ) : (
          <>
            <div className="mb-3 text-muted small">
              Showing {projects.length} of {total} projects
            </div>

            <Row className="gy-4 mb-5">
              {projects.map((project) => (
                <Col key={project._id} md={6} lg={4}>
                  <Card className="custom-card h-100 overflow-hidden d-flex flex-column">
                    <div className="project-image-container">
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="project-image"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <Badge
                        bg="primary"
                        className="position-absolute top-0 end-0 m-3 px-3 py-2 rounded-pill shadow-sm"
                      >
                        {project.category}
                      </Badge>
                      {project.featured && (
                        <Badge
                          bg="warning"
                          text="dark"
                          className="position-absolute top-0 start-0 m-3 px-2 py-1 rounded-pill shadow-sm small"
                        >
                          Featured
                        </Badge>
                      )}
                    </div>

                    <Card.Body className="p-4 d-flex flex-column flex-grow-1">
                      <Card.Title className="fw-bold fs-5 mb-2">{project.title}</Card.Title>
                      <Card.Text className="text-muted small mb-4 flex-grow-1">
                        {project.description}
                      </Card.Text>

                      <div className="d-flex flex-wrap gap-1 mb-4">
                        {project.technologies.map((tech, i) => (
                          <span key={i} className="tech-badge">
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="d-flex align-items-center justify-content-between pt-3 border-top mt-auto">
                        <Link
                          to={`/projects/${project._id}`}
                          className="text-decoration-none fw-semibold small text-primary d-inline-flex align-items-center gap-1"
                        >
                          <span>Full Overview</span>
                          <FaArrowRight size={11} />
                        </Link>

                        <div className="d-flex align-items-center gap-2">
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center p-2"
                              style={{ width: '34px', height: '34px' }}
                              title="GitHub Repository"
                            >
                              <FaGithub size={15} />
                            </a>
                          )}
                          {project.liveDemoUrl && (
                            <a
                              href={project.liveDemoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-sm btn-outline-primary rounded-circle d-flex align-items-center justify-content-center p-2"
                              style={{ width: '34px', height: '34px' }}
                              title="Live Demo"
                            >
                              <FaExternalLinkAlt size={13} />
                            </a>
                          )}
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center">
                <Pagination>
                  <Pagination.Prev
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  />
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <Pagination.Item
                      key={idx + 1}
                      active={idx + 1 === page}
                      onClick={() => setPage(idx + 1)}
                    >
                      {idx + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  />
                </Pagination>
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
};
