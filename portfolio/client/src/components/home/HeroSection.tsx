import React from 'react';
import { Container, Row, Col, Button, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaEnvelope,
  FaFileDownload,
  FaArrowRight,
} from 'react-icons/fa';
import { IProfile } from '../../types';

interface HeroSectionProps {
  profile: IProfile | null;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ profile }) => {
  const name = profile?.name || 'Alex Mercer';
  const title = profile?.title || 'Senior Full-Stack Developer & Cloud Architect';
  const tagline =
    profile?.tagline ||
    'Designing scalable architectures, robust distributed systems, and intuitive digital experiences.';
  const avatarUrl =
    profile?.avatarUrl ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
  const resumeUrl = profile?.resumeUrl || '/uploads/Alex_Mercer_Resume.pdf';

  return (
    <section className="hero-wrapper py-5 py-lg-6">
      <Container className="py-4">
        <Row className="gy-5 align-items-center justify-content-between">
          <Col lg={7} className="text-center text-lg-start">
            <div className="d-inline-flex mb-3">
              <div className="status-indicator">
                <span className="pulse-dot"></span>
                <span>{profile?.availableForHire ? 'Available for new opportunities' : 'Open for consulting'}</span>
              </div>
            </div>

            <h1 className="display-4 fw-extrabold mb-3 lh-sm">
              Hi, I'm <span className="gradient-text">{name}</span>
            </h1>

            <h2 className="fs-3 fw-semibold text-primary mb-3">{title}</h2>

            <p className="lead text-muted mb-4 pe-lg-4" style={{ maxWidth: '620px' }}>
              {tagline}
            </p>

            <div className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-3 mb-4">
              <Link to="/projects" className="btn btn-primary-gradient d-flex align-items-center gap-2">
                <span>View My Projects</span>
                <FaArrowRight size={14} />
              </Link>

              <Button
                as="a"
                href={resumeUrl}
                download="Alex_Mercer_Resume.pdf"
                target="_blank"
                rel="noreferrer"
                className="btn-outline-custom d-flex align-items-center gap-2"
              >
                <FaFileDownload size={15} />
                <span>Download Resume</span>
              </Button>

              <Link to="/contact" className="btn btn-outline-secondary rounded-pill px-4">
                <span>Contact Me</span>
              </Link>
            </div>

            {/* Social Links */}
            <div className="d-flex align-items-center justify-content-center justify-content-lg-start gap-3 pt-2">
              <span className="small text-muted fw-medium me-1">Connect with me:</span>
              <a
                href={profile?.socialLinks?.github || 'https://github.com'}
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center p-2"
                style={{ width: '38px', height: '38px' }}
                aria-label="GitHub Profile"
              >
                <FaGithub size={17} />
              </a>
              <a
                href={profile?.socialLinks?.linkedin || 'https://linkedin.com'}
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center p-2"
                style={{ width: '38px', height: '38px' }}
                aria-label="LinkedIn Profile"
              >
                <FaLinkedin size={17} />
              </a>
              <a
                href={profile?.socialLinks?.twitter || 'https://twitter.com'}
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center p-2"
                style={{ width: '38px', height: '38px' }}
                aria-label="Twitter Profile"
              >
                <FaTwitter size={17} />
              </a>
              {profile?.socialLinks?.instagram && (
                <a
                  href={profile.socialLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center p-2"
                  style={{ width: '38px', height: '38px' }}
                  aria-label="Instagram Profile"
                >
                  <FaInstagram size={17} />
                </a>
              )}
              <a
                href={`mailto:${profile?.email || 'alex.mercer.dev@example.com'}`}
                className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center p-2"
                style={{ width: '38px', height: '38px' }}
                aria-label="Email Me"
              >
                <FaEnvelope size={17} />
              </a>
            </div>
          </Col>

          {/* Profile Photo / Visual Avatar */}
          <Col lg={5} className="d-flex justify-content-center">
            <div
              className="position-relative"
              style={{
                width: '320px',
                height: '320px',
                maxWidth: '100%',
              }}
            >
              <div
                className="position-absolute top-50 start-50 translate-middle rounded-circle"
                style={{
                  width: '340px',
                  height: '340px',
                  background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.25) 0%, rgba(99, 102, 241, 0.25) 100%)',
                  filter: 'blur(20px)',
                  zIndex: 0,
                }}
              />
              <div
                className="position-relative rounded-circle p-2 custom-card"
                style={{
                  width: '320px',
                  height: '320px',
                  zIndex: 1,
                  border: '2px solid rgba(56, 189, 248, 0.3)',
                }}
              >
                <Image
                  src={avatarUrl}
                  alt={name}
                  roundedCircle
                  className="w-100 h-100 object-fit-cover shadow-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
                  }}
                />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
