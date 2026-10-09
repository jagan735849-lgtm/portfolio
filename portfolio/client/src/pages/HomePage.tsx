import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, ProgressBar, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
  FaGithub,
  FaExternalLinkAlt,
  FaArrowRight,
  FaRocket,
} from 'react-icons/fa';
import { HeroSection } from '../components/home/HeroSection';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { profileService } from '../services/profileService';
import { projectService } from '../services/projectService';
import { skillService } from '../services/skillService';
import { IProfile, IProject, ISkill } from '../types';

export const HomePage: React.FC = () => {
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [featuredProjects, setFeaturedProjects] = useState<IProject[]>([]);
  const [topSkills, setTopSkills] = useState<ISkill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileRes, projectsRes, skillsRes] = await Promise.all([
          profileService.getProfile(),
          projectService.getProjects({ featured: true, limit: 3 }),
          skillService.getSkills(),
        ]);

        if (profileRes.success && profileRes.data) {
          setProfile(profileRes.data);
        }
        if (projectsRes.success && projectsRes.data) {
          setFeaturedProjects(projectsRes.data);
        }
        if (skillsRes.success && skillsRes.data) {
          // Take top 6 skills
          setTopSkills(skillsRes.data.slice(0, 6));
        }
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading portfolio overview..." minHeight="80vh" />;
  }

  const stats = profile?.stats || {
    projectsCompleted: 35,
    satisfiedClients: 20,
    yearsExperience: 5,
    codeCommits: 3000,
  };

  return (
    <div>
      {/* Hero Section */}
      <HeroSection profile={profile} />

      {/* Stats Overview */}
      <section className="py-4 border-top border-bottom" style={{ backgroundColor: 'var(--bg-card)' }}>
        <Container>
          <Row className="gy-4 text-center">
            <Col xs={6} md={3}>
              <div className="p-3">
                <div className="display-6 fw-bold text-primary mb-1">{stats.projectsCompleted}+</div>
                <div className="text-muted small text-uppercase tracking-wider">Projects Completed</div>
              </div>
            </Col>
            <Col xs={6} md={3}>
              <div className="p-3">
                <div className="display-6 fw-bold text-info mb-1">{stats.yearsExperience}+</div>
                <div className="text-muted small text-uppercase tracking-wider">Years Experience</div>
              </div>
            </Col>
            <Col xs={6} md={3}>
              <div className="p-3">
                <div className="display-6 fw-bold text-success mb-1">{stats.satisfiedClients}+</div>
                <div className="text-muted small text-uppercase tracking-wider">Satisfied Clients</div>
              </div>
            </Col>
            <Col xs={6} md={3}>
              <div className="p-3">
                <div className="display-6 fw-bold text-warning mb-1">{stats.codeCommits}+</div>
                <div className="text-muted small text-uppercase tracking-wider">Git Commits</div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Projects Section */}
      <section className="py-5 py-lg-6">
        <Container>
          <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between mb-5">
            <div>
              <span className="text-primary text-uppercase fw-semibold small tracking-widest">
                Portfolio Showcase
              </span>
              <h2 className="display-6 fw-bold mt-1">Featured Projects</h2>
              <p className="text-muted mb-0">A curated selection of modern full-stack web applications.</p>
            </div>
            <Link
              to="/projects"
              className="btn btn-outline-primary mt-3 mt-md-0 rounded-pill px-4 d-inline-flex align-items-center gap-2"
            >
              <span>View All Projects</span>
              <FaArrowRight size={13} />
            </Link>
          </div>

          <Row className="gy-4">
            {featuredProjects.map((project) => (
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

                    {/* Technologies Tags */}
                    <div className="d-flex flex-wrap gap-1 mb-4">
                      {project.technologies.slice(0, 4).map((tech, i) => (
                        <span key={i} className="tech-badge">
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="tech-badge">+{project.technologies.length - 4}</span>
                      )}
                    </div>

                    {/* Links */}
                    <div className="d-flex align-items-center justify-content-between pt-3 border-top mt-auto">
                      <Link
                        to={`/projects/${project._id}`}
                        className="text-decoration-none fw-semibold small text-primary d-inline-flex align-items-center gap-1"
                      >
                        <span>Details</span>
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
                            title="View Source on GitHub"
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
        </Container>
      </section>

      {/* Skills Highlight */}
      <section className="py-5 py-lg-6" style={{ backgroundColor: 'var(--bg-card)' }}>
        <Container>
          <Row className="gy-4 align-items-center justify-content-between">
            <Col lg={5}>
              <span className="text-primary text-uppercase fw-semibold small tracking-widest">
                Technical Expertise
              </span>
              <h2 className="display-6 fw-bold mt-1 mb-3">Core Skills & Modern Tools</h2>
              <p className="text-muted mb-4">
                Constantly expanding knowledge with the latest full-stack ecosystem standards. Focusing on performance, safety, and scalable cloud engineering.
              </p>
              <Link to="/skills" className="btn btn-primary-gradient rounded-pill px-4">
                <span>Explore All Technical Skills</span>
              </Link>
            </Col>

            <Col lg={6}>
              <Row className="gy-3">
                {topSkills.map((skill) => (
                  <Col sm={6} key={skill._id}>
                    <div className="custom-card p-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-semibold small">{skill.name}</span>
                        <span className="badge bg-secondary-subtle text-secondary rounded-pill small">
                          {skill.level}
                        </span>
                      </div>
                      <ProgressBar
                        now={skill.proficiency}
                        variant="primary"
                        style={{ height: '6px', borderRadius: '3px' }}
                      />
                      <div className="text-end text-muted mt-1" style={{ fontSize: '0.75rem' }}>
                        {skill.proficiency}%
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Call to Action Banner */}
      <section className="py-5 py-lg-6">
        <Container>
          <div
            className="p-5 text-center rounded-4 custom-card position-relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
            }}
          >
            <div className="d-inline-flex p-3 rounded-circle bg-primary bg-opacity-10 text-primary mb-3">
              <FaRocket size={32} />
            </div>
            <h2 className="display-6 fw-bold mb-3">Have a project in mind? Let's build together.</h2>
            <p className="lead text-muted mx-auto mb-4" style={{ maxWidth: '600px' }}>
              Whether you need a full-stack platform, high-throughput microservices, or cloud optimization, I'm here to bring your vision to life.
            </p>
            <Link to="/contact" className="btn btn-primary-gradient px-4 py-2 fs-6">
              <span>Start A Conversation</span>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
};
