import React, { useEffect, useState } from 'react';
import {
  Card,
  Button,
  Modal,
  Form,
  Row,
  Col,
  Table,
  Badge,
  Alert,
} from 'react-bootstrap';
import { BsPlusCircle, BsPencil, BsTrash } from 'react-icons/bs';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { experienceService } from '../../services/experienceService';
import { IExperience } from '../../types';

export const ManageExperiencePage: React.FC = () => {
  const [experiences, setExperiences] = useState<IExperience[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal State
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    company: string;
    role: string;
    location: string;
    employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Freelance';
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    description: string;
    technologies: string;
    order: number;
  }>({
    company: '',
    role: '',
    location: '',
    employmentType: 'Full-time',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
    technologies: '',
    order: 0,
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const res = await experienceService.getExperiences();
      if (res.success && res.data) {
        setExperiences(res.data);
      }
    } catch (err) {
      console.error('Failed to load experiences:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const openCreateModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      company: '',
      role: '',
      location: 'San Francisco, CA',
      employmentType: 'Full-time',
      startDate: '2023-01',
      endDate: 'Present',
      isCurrent: true,
      description: 'Architected scalable web apps handling high throughput\nMentored engineers and managed code review standards',
      technologies: 'React, Node.js, Express, MongoDB, AWS',
      order: experiences.length + 1,
    });
    setFormError(null);
    setShowModal(true);
  };

  const openEditModal = (exp: IExperience) => {
    setIsEditing(true);
    setCurrentId(exp._id);
    setFormData({
      company: exp.company,
      role: exp.role,
      location: exp.location || '',
      employmentType: exp.employmentType || 'Full-time',
      startDate: exp.startDate,
      endDate: exp.endDate || '',
      isCurrent: exp.isCurrent,
      description: exp.description.join('\n'),
      technologies: (exp.technologies || []).join(', '),
      order: exp.order || 0,
    });
    setFormError(null);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company.trim() || !formData.role.trim() || !formData.startDate.trim()) {
      setFormError('Company, role, and start date are required.');
      return;
    }

    try {
      setSaving(true);
      setFormError(null);

      const descArray = formData.description
        .split('\n')
        .map((d) => d.trim())
        .filter(Boolean);

      const techArray = formData.technologies
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        ...formData,
        description: descArray,
        technologies: techArray,
      };

      if (isEditing && currentId) {
        await experienceService.updateExperience(currentId, payload);
      } else {
        await experienceService.createExperience(payload);
      }

      setShowModal(false);
      await fetchExperiences();
    } catch (err: any) {
      setFormError(err.response?.data?.message || err.message || 'Failed to save experience');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await experienceService.deleteExperience(deleteId);
      setShowDeleteModal(false);
      setDeleteId(null);
      await fetchExperiences();
    } catch (err) {
      console.error('Failed to delete experience:', err);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading work experience records..." />;
  }

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Manage Work Experience</h2>
          <p className="text-muted small mb-0">
            Keep your career history, roles, and achievements up to date.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={openCreateModal}
          className="btn-primary-gradient d-flex align-items-center gap-2 rounded-pill px-4"
        >
          <BsPlusCircle />
          <span>Add Experience</span>
        </Button>
      </div>

      <Card className="custom-card p-4">
        <div className="table-responsive">
          <Table hover className="align-middle mb-0">
            <thead>
              <tr className="text-muted small">
                <th>Role & Company</th>
                <th>Period</th>
                <th>Type</th>
                <th>Achievements</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {experiences.map((exp) => (
                <tr key={exp._id}>
                  <td>
                    <div className="fw-bold">{exp.role}</div>
                    <div className="text-primary small">{exp.company}</div>
                    <div className="text-muted small">{exp.location}</div>
                  </td>
                  <td className="small text-nowrap">
                    {exp.startDate} - {exp.isCurrent ? <span className="text-success fw-bold">Present</span> : exp.endDate}
                  </td>
                  <td>
                    <Badge bg="secondary-subtle" className="text-secondary rounded-pill">
                      {exp.employmentType || 'Full-time'}
                    </Badge>
                  </td>
                  <td className="small text-muted" style={{ maxWidth: '380px' }}>
                    <div className="text-truncate">{exp.description[0]}</div>
                    {exp.description.length > 1 && (
                      <span className="badge bg-light text-dark border mt-1">
                        +{exp.description.length - 1} more items
                      </span>
                    )}
                  </td>
                  <td className="text-end">
                    <div className="d-inline-flex gap-2">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => openEditModal(exp)}
                        className="p-2"
                        title="Edit"
                      >
                        <BsPencil size={14} />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => {
                          setDeleteId(exp._id);
                          setShowDeleteModal(true);
                        }}
                        className="p-2"
                        title="Delete"
                      >
                        <BsTrash size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>

      {/* Add / Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title className="fs-5 fw-bold">
              {isEditing ? 'Edit Experience' : 'Add Work Experience'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            {formError && <Alert variant="danger">{formError}</Alert>}

            <Row className="gy-3 mb-3">
              <Col md={6}>
                <Form.Group controlId="expRole">
                  <Form.Label className="small fw-semibold">Job Title / Role *</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. Senior Full-Stack Engineer"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="expCompany">
                  <Form.Label className="small fw-semibold">Company Name *</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Vanguard Tech Solutions"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="gy-3 mb-3">
              <Col md={6}>
                <Form.Group controlId="expLocation">
                  <Form.Label className="small fw-semibold">Location</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="San Francisco, CA (Remote)"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="expType">
                  <Form.Label className="small fw-semibold">Employment Type</Form.Label>
                  <Form.Select
                    value={formData.employmentType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        employmentType: e.target.value as any,
                      })
                    }
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Freelance">Freelance</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="gy-3 mb-3">
              <Col sm={6}>
                <Form.Group controlId="expStart">
                  <Form.Label className="small fw-semibold">Start Date *</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    placeholder="e.g. 2022-01"
                  />
                </Form.Group>
              </Col>

              <Col sm={6}>
                <Form.Group controlId="expEnd">
                  <Form.Label className="small fw-semibold">End Date</Form.Label>
                  <Form.Control
                    type="text"
                    disabled={formData.isCurrent}
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    placeholder="e.g. 2024-06 or Present"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Check
              type="checkbox"
              id="expCurrent"
              label="I currently work in this role"
              checked={formData.isCurrent}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  isCurrent: e.target.checked,
                  endDate: e.target.checked ? 'Present' : formData.endDate,
                })
              }
              className="fw-medium small mb-3"
            />

            <Form.Group className="mb-3" controlId="expDesc">
              <Form.Label className="small fw-semibold">Key Achievements (One per line) *</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Architected distributed microservices handling 50k req/min&#10;Mentored 4 developers and automated deployment scripts"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="expTech">
              <Form.Label className="small fw-semibold">Technologies Used (Comma-separated)</Form.Label>
              <Form.Control
                type="text"
                value={formData.technologies}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                placeholder="React, TypeScript, Express, MongoDB, Docker"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={saving} className="btn-primary-gradient">
              {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Record'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered size="sm">
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 fw-bold">Delete Record</Modal.Title>
        </Modal.Header>
        <Modal.Body className="small text-muted">
          Are you sure you want to remove this experience entry?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" size="sm" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
