import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
  FaFileDownload,
  FaCheckCircle,
  FaLaptopCode,
  FaAward,
  FaArrowRight,
} from 'react-icons/fa';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { profileService } from '../services/profileService';
import { IProfile } from '../types';

export const AboutPage: React.FC = () => {
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await profileService.getProfile();
        if (res.success && res.data) {
          setProfile(res.data);
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading about me..." />;
  }

  const name = profile?.name || 'Alex Mercer';
  const title = profile?.title || 'Senior Full-Stack Developer & Cloud Architect';
  const bio =
    profile?.bio ||
    'I am a passionate software engineer with over 5 years of experience building modern web apps, distributed backends, and responsive user interfaces.';
  const strengths = profile?.strengths || [
    'Full-Stack Architecture & Microservices',
    'High Performance React, Next.js & TypeScript UIs',
    'Scalable REST & GraphQL Node.js APIs',
    'Docker, Kubernetes & AWS Cloud Deployments',
    'Database Design, Query Tuning & Redis Caching',
  ];
  const resumeUrl = profile?.resumeUrl || '/uploads/Alex_Mercer_Resume.pdf';
  const careerObjective =
    profile?.careerObjective ||
    'My primary objective is to engineer scalable, high-throughput digital systems that solve real human challenges with speed and security. I thrive in agile cross-functional environments where robust software engineering practices, test-driven craftsmanship, and thoughtful user-centered design unite.';

  return (
    <div className="py-5">
      <Container>
        {/* Header */}
        <div className="text-center max-w-700 mx-auto mb-5">
          <span className="text-primary text-uppercase fw-semibold small tracking-widest">
            Introduction
          </span>
          <h1 className="display-5 fw-bold mt-1">About Me</h1>
          <p className="lead text-muted mx-auto" style={{ maxWidth: '600px' }}>
            Get to know my engineering philosophy, technical background, and passion for craft.
          </p>
        </div>

        <Row className="gy-5 align-items-center mb-5">
          <Col lg={5} className="text-center">
            <div className="position-relative d-inline-block">
              <img
                src={
                  profile?.avatarUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
                }
                alt={name}
                className="img-fluid rounded-4 shadow-lg custom-card p-2"
                style={{ maxHeight: '420px', width: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
                }}
              />
            </div>
          </Col>

          <Col lg={7}>
            <div className="ps-lg-3">
              <h2 className="fs-2 fw-bold mb-2">{name}</h2>
              <h3 className="fs-5 text-primary fw-semibold mb-3">{title}</h3>

              <p className="text-body-secondary lead fs-6 mb-4">{bio}</p>

              <div className="d-flex flex-wrap gap-4 mb-4 p-3 rounded-3 custom-card">
                <div>
                  <div className="text-muted small">Location</div>
                  <div className="fw-semibold">{profile?.location || 'San Francisco, CA / Remote'}</div>
                </div>
                <div>
                  <div className="text-muted small">Experience</div>
                  <div className="fw-semibold">{profile?.yearsOfExperience || 5}+ Years</div>
                </div>
                <div>
                  <div className="text-muted small">Availability</div>
                  <div className="fw-semibold text-success">Immediate / Full-time</div>
                </div>
                <div>
                  <div className="text-muted small">Email</div>
                  <div className="fw-semibold">{profile?.email || 'alex.mercer.dev@example.com'}</div>
                </div>
              </div>

              <div className="d-flex flex-wrap gap-3">
                <Button
                  as="a"
                  href={resumeUrl}
                  download="Alex_Mercer_Resume.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary-gradient d-flex align-items-center gap-2"
                >
                  <FaFileDownload size={15} />
                  <span>Download Complete Resume</span>
                </Button>

                <Link to="/contact" className="btn btn-outline-custom">
                  <span>Get In Touch</span>
                </Link>
              </div>
            </div>
          </Col>
        </Row>

        {/* Strengths & Core Values */}
        <Row className="gy-4 my-4">
          <Col md={6}>
            <Card className="custom-card h-100 p-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="p-3 rounded-circle bg-primary bg-opacity-10 text-primary">
                  <FaAward size={24} />
                </div>
                <h4 className="fw-bold mb-0">Core Strengths & Expertise</h4>
              </div>
              <ul className="list-unstyled mb-0 d-flex flex-column gap-3">
                {strengths.map((str, idx) => (
                  <li key={idx} className="d-flex align-items-start gap-2">
                    <FaCheckCircle className="text-primary mt-1 flex-shrink-0" size={16} />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="custom-card h-100 p-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="p-3 rounded-circle bg-info bg-opacity-10 text-info">
                  <FaLaptopCode size={24} />
                </div>
                <h4 className="fw-bold mb-0">Career Objectives & Vision</h4>
              </div>
              <p className="text-muted mb-4" style={{ whiteSpace: 'pre-line' }}>
                {careerObjective}
              </p>
              <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                <span className="small text-muted">Ready to see my background?</span>
                <Link to="/experience" className="text-primary fw-semibold text-decoration-none d-flex align-items-center gap-1 small">
                  <span>View Timeline</span>
                  <FaArrowRight size={12} />
                </Link>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
