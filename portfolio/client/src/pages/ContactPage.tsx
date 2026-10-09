import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaPaperPlane,
  FaCheckCircle,
  FaExclamationTriangle,
  FaGithub,
  FaLinkedin,
  FaTwitter,
} from 'react-icons/fa';
import { contactService } from '../services/contactService';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot?: string;
}

export const ContactPage: React.FC = () => {
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    // Spam bot check
    if (data.honeypot) {
      console.warn('Bot detected by honeypot.');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitSuccess(null);
      setSubmitError(null);

      const res = await contactService.submitMessage(data);
      if (res.success) {
        setSubmitSuccess(res.message || 'Your message has been sent successfully!');
        reset();
      } else {
        setSubmitError(res.message || 'Failed to send message. Please try again.');
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || err.message || 'An unexpected error occurred while sending.';
      setSubmitError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-5">
      <Container>
        {/* Header */}
        <div className="text-center mx-auto mb-5" style={{ maxWidth: '650px' }}>
          <span className="text-primary text-uppercase fw-semibold small tracking-widest">
            Let's Connect
          </span>
          <h1 className="display-5 fw-bold mt-1">Get In Touch</h1>
          <p className="lead text-muted">
            Have a project in mind, seeking technical consultation, or wanting to discuss a software role? Send me a message!
          </p>
        </div>

        <Row className="gy-5">
          {/* Contact Details Card */}
          <Col lg={5}>
            <div className="custom-card p-4 p-md-5 h-100 d-flex flex-column justify-content-between">
              <div>
                <h3 className="fw-bold mb-3">Direct Contact</h3>
                <p className="text-muted mb-4">
                  Feel free to reach out directly through email, phone, or any of the social platforms below.
                </p>

                <div className="d-flex flex-column gap-4 mb-4">
                  <div className="d-flex align-items-center gap-3">
                    <div className="p-3 rounded-circle bg-primary bg-opacity-10 text-primary">
                      <FaEnvelope size={20} />
                    </div>
                    <div>
                      <div className="text-muted small">Email Address</div>
                      <a
                        href="mailto:alex.mercer.dev@example.com"
                        className="fw-semibold text-decoration-none text-body"
                      >
                        alex.mercer.dev@example.com
                      </a>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    <div className="p-3 rounded-circle bg-success bg-opacity-10 text-success">
                      <FaPhoneAlt size={18} />
                    </div>
                    <div>
                      <div className="text-muted small">Phone Number</div>
                      <span className="fw-semibold">+1 (555) 349-8821</span>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    <div className="p-3 rounded-circle bg-info bg-opacity-10 text-info">
                      <FaMapMarkerAlt size={20} />
                    </div>
                    <div>
                      <div className="text-muted small">Primary Location</div>
                      <span className="fw-semibold">San Francisco, CA (Open to Remote Worldwide)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-top">
                <span className="small text-muted d-block mb-3">Follow my work:</span>
                <div className="d-flex gap-3">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center p-2"
                    style={{ width: '40px', height: '40px' }}
                  >
                    <FaGithub size={18} />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center p-2"
                    style={{ width: '40px', height: '40px' }}
                  >
                    <FaLinkedin size={18} />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center p-2"
                    style={{ width: '40px', height: '40px' }}
                  >
                    <FaTwitter size={18} />
                  </a>
                </div>
              </div>
            </div>
          </Col>

          {/* Form */}
          <Col lg={7}>
            <Card className="custom-card p-4 p-md-5">
              <h3 className="fw-bold mb-2">Send a Message</h3>
              <p className="text-muted mb-4">
                Fill out the form below. Messages are saved securely in MongoDB and forwarded directly to my inbox.
              </p>

              {submitSuccess && (
                <Alert variant="success" className="d-flex align-items-center gap-2 mb-4">
                  <FaCheckCircle className="flex-shrink-0" size={18} />
                  <div>{submitSuccess}</div>
                </Alert>
              )}

              {submitError && (
                <Alert variant="danger" className="d-flex align-items-center gap-2 mb-4">
                  <FaExclamationTriangle className="flex-shrink-0" size={18} />
                  <div>{submitError}</div>
                </Alert>
              )}

              <Form onSubmit={handleSubmit(onSubmit)}>
                {/* Honeypot field for bot spam prevention */}
                <input
                  type="text"
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                  {...register('honeypot')}
                />

                <Row className="gy-3 mb-3">
                  <Col md={6}>
                    <Form.Group controlId="name">
                      <Form.Label className="small fw-semibold">Your Name *</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g. Sarah Connor"
                        isInvalid={!!errors.name}
                        {...register('name', {
                          required: 'Your name is required',
                          minLength: { value: 2, message: 'Name must be at least 2 characters' },
                        })}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.name?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group controlId="email">
                      <Form.Label className="small fw-semibold">Your Email *</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="e.g. sarah@company.com"
                        isInvalid={!!errors.email}
                        {...register('email', {
                          required: 'Your email is required',
                          pattern: {
                            value: /^\S+@\S+\.\S+$/,
                            message: 'Please provide a valid email address',
                          },
                        })}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group controlId="subject" className="mb-3">
                  <Form.Label className="small fw-semibold">Subject *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. Project Consultation / Job Opportunity"
                    isInvalid={!!errors.subject}
                    {...register('subject', {
                      required: 'Subject is required',
                      minLength: { value: 3, message: 'Subject must be at least 3 characters' },
                    })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.subject?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="message" className="mb-4">
                  <Form.Label className="small fw-semibold">Your Message *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    placeholder="Describe your inquiry, project scope, or opportunity..."
                    isInvalid={!!errors.message}
                    {...register('message', {
                      required: 'Message is required',
                      minLength: { value: 10, message: 'Message must be at least 10 characters' },
                    })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.message?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary-gradient w-100 py-3 d-flex align-items-center justify-content-center gap-2 fs-6"
                >
                  <FaPaperPlane size={15} />
                  <span>{isSubmitting ? 'Sending Message...' : 'Send Message'}</span>
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
