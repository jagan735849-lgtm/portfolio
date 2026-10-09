import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import {
  FaBriefcase,
  FaGraduationCap,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { experienceService } from '../services/experienceService';
import { educationService } from '../services/educationService';
import { IExperience, IEducation } from '../types';

export const ExperiencePage: React.FC = () => {
  const [experiences, setExperiences] = useState<IExperience[]>([]);
  const [educations, setEducations] = useState<IEducation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [expRes, eduRes] = await Promise.all([
          experienceService.getExperiences(),
          educationService.getEducations(),
        ]);

        if (expRes.success && expRes.data) {
          setExperiences(expRes.data);
        }
        if (eduRes.success && eduRes.data) {
          setEducations(eduRes.data);
        }
      } catch (err) {
        console.error('Failed to load experience data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading career timeline..." />;
  }

  return (
    <div className="py-5">
      <Container>
        {/* Header */}
        <div className="text-center mx-auto mb-5" style={{ maxWidth: '650px' }}>
          <span className="text-primary text-uppercase fw-semibold small tracking-widest">
            Career Journey
          </span>
          <h1 className="display-5 fw-bold mt-1">Experience & Education</h1>
          <p className="lead text-muted">
            A chronological timeline of my professional roles, engineering contributions, and academic background.
          </p>
        </div>

        <Row className="gy-5">
          {/* Work Experience */}
          <Col lg={7}>
            <div className="d-flex align-items-center gap-3 mb-4">
              <div className="p-3 rounded-circle bg-primary bg-opacity-10 text-primary">
                <FaBriefcase size={22} />
              </div>
              <h2 className="fs-3 fw-bold mb-0">Professional Experience</h2>
            </div>

            <div className="timeline">
              {experiences.map((exp) => (
                <div key={exp._id} className="timeline-item">
                  <div className="timeline-dot" />
                  <Card className="custom-card p-4">
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
                      <h4 className="fw-bold fs-5 mb-0">{exp.role}</h4>
                      <Badge bg={exp.isCurrent ? 'success' : 'secondary'} className="rounded-pill px-3 py-1">
                        {exp.isCurrent ? 'Current Role' : exp.employmentType || 'Full-time'}
                      </Badge>
                    </div>

                    <h5 className="fs-6 text-primary fw-semibold mb-2">{exp.company}</h5>

                    <div className="d-flex flex-wrap gap-3 small text-muted mb-3">
                      <span className="d-flex align-items-center gap-1">
                        <FaCalendarAlt size={12} />
                        <span>
                          {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                        </span>
                      </span>
                      {exp.location && (
                        <span className="d-flex align-items-center gap-1">
                          <FaMapMarkerAlt size={12} />
                          <span>{exp.location}</span>
                        </span>
                      )}
                    </div>

                    <ul className="mb-3 ps-3 text-body-secondary small">
                      {exp.description.map((desc, i) => (
                        <li key={i} className="mb-2">
                          {desc}
                        </li>
                      ))}
                    </ul>

                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="d-flex flex-wrap gap-1 pt-2 border-top">
                        {exp.technologies.map((t, idx) => (
                          <span key={idx} className="tech-badge">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </Card>
                </div>
              ))}
            </div>
          </Col>

          {/* Education & Certifications */}
          <Col lg={5}>
            <div className="d-flex align-items-center gap-3 mb-4">
              <div className="p-3 rounded-circle bg-info bg-opacity-10 text-info">
                <FaGraduationCap size={24} />
              </div>
              <h2 className="fs-3 fw-bold mb-0">Education & Honors</h2>
            </div>

            <div className="timeline">
              {educations.map((edu) => (
                <div key={edu._id} className="timeline-item">
                  <div
                    className="timeline-dot"
                    style={{ borderColor: 'var(--color-secondary)' }}
                  />
                  <Card className="custom-card p-4">
                    <h4 className="fw-bold fs-5 mb-1">{edu.degree}</h4>
                    <h5 className="fs-6 text-primary fw-semibold mb-2">{edu.fieldOfStudy}</h5>
                    <p className="fw-medium text-body mb-2 small">{edu.institution}</p>

                    <div className="d-flex flex-wrap gap-3 small text-muted mb-3">
                      <span className="d-flex align-items-center gap-1">
                        <FaCalendarAlt size={12} />
                        <span>
                          {edu.startDate} - {edu.endDate || 'Present'}
                        </span>
                      </span>
                      {edu.grade && (
                        <Badge bg="info-subtle" className="text-info border border-info border-opacity-25 rounded-pill px-2">
                          {edu.grade}
                        </Badge>
                      )}
                    </div>

                    {edu.description && (
                      <p className="text-body-secondary small mb-0">{edu.description}</p>
                    )}
                  </Card>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
