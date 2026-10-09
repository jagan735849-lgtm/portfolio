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
import { educationService } from '../../services/educationService';
import { IEducation } from '../../types';

export const ManageEducationPage: React.FC = () => {
  const [educations, setEducations] = useState<IEducation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal State
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    institution: string;
    degree: string;
    fieldOfStudy: string;
    location: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    grade: string;
    description: string;
    order: number;
  }>({
    institution: '',
    degree: '',
    fieldOfStudy: '',
    location: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    grade: '',
    description: '',
    order: 0,
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const fetchEducations = async () => {
    try {
      setLoading(true);
      const res = await educationService.getEducations();
      if (res.success && res.data) {
        setEducations(res.data);
      }
    } catch (err) {
      console.error('Failed to load educations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducations();
  }, []);

  const openCreateModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      institution: '',
      degree: 'Bachelor of Science (B.S.)',
      fieldOfStudy: 'Computer Science',
      location: 'Berkeley, CA',
      startDate: '2016-08',
      endDate: '2020-05',
      isCurrent: false,
      grade: '3.8 GPA',
      description: 'Focus on Distributed Systems, Cloud Architecture, and Human-Computer Interaction',
      order: educations.length + 1,
    });
    setFormError(null);
    setShowModal(true);
  };

  const openEditModal = (edu: IEducation) => {
    setIsEditing(true);
    setCurrentId(edu._id);
    setFormData({
      institution: edu.institution,
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy,
      location: edu.location || '',
      startDate: edu.startDate,
      endDate: edu.endDate || '',
      isCurrent: edu.isCurrent,
      grade: edu.grade || '',
      description: edu.description || '',
      order: edu.order || 0,
    });
    setFormError(null);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.institution.trim() || !formData.degree.trim() || !formData.fieldOfStudy.trim()) {
      setFormError('Institution, degree, and field of study are required.');
      return;
    }

    try {
      setSaving(true);
      setFormError(null);

      if (isEditing && currentId) {
        await educationService.updateEducation(currentId, formData);
      } else {
        await educationService.createEducation(formData);
      }

      setShowModal(false);
      await fetchEducations();
    } catch (err: any) {
      setFormError(err.response?.data?.message || err.message || 'Failed to save education');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await educationService.deleteEducation(deleteId);
      setShowDeleteModal(false);
      setDeleteId(null);
      await fetchEducations();
    } catch (err) {
      console.error('Failed to delete education:', err);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading education records..." />;
  }

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Manage Education & Honors</h2>
          <p className="text-muted small mb-0">
            Maintain your academic credentials, degrees, and certifications.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={openCreateModal}
          className="btn-primary-gradient d-flex align-items-center gap-2 rounded-pill px-4"
        >
          <BsPlusCircle />
          <span>Add Education</span>
        </Button>
      </div>

      <Card className="custom-card p-4">
        <div className="table-responsive">
          <Table hover className="align-middle mb-0">
            <thead>
              <tr className="text-muted small">
                <th>Degree & Program</th>
                <th>Institution</th>
                <th>Period</th>
                <th>Honors/GPA</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {educations.map((edu) => (
                <tr key={edu._id}>
                  <td>
                    <div className="fw-bold">{edu.degree}</div>
                    <div className="text-primary small">{edu.fieldOfStudy}</div>
                  </td>
                  <td>
                    <div className="fw-medium">{edu.institution}</div>
                    <div className="text-muted small">{edu.location}</div>
                  </td>
                  <td className="small text-nowrap">
                    {edu.startDate} - {edu.endDate || 'Present'}
                  </td>
                  <td>
                    {edu.grade ? (
                      <Badge bg="info-subtle" className="text-info border border-info border-opacity-25 rounded-pill px-2">
                        {edu.grade}
                      </Badge>
                    ) : (
                      <span className="text-muted small">-</span>
                    )}
                  </td>
                  <td className="text-end">
                    <div className="d-inline-flex gap-2">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => openEditModal(edu)}
                        className="p-2"
                        title="Edit"
                      >
                        <BsPencil size={14} />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => {
                          setDeleteId(edu._id);
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
              {isEditing ? 'Edit Education Record' : 'Add Education Record'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            {formError && <Alert variant="danger">{formError}</Alert>}

            <Row className="gy-3 mb-3">
              <Col md={6}>
                <Form.Group controlId="eduDegree">
                  <Form.Label className="small fw-semibold">Degree / Certification *</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    placeholder="e.g. Bachelor of Science (B.S.)"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="eduField">
                  <Form.Label className="small fw-semibold">Field of Study *</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={formData.fieldOfStudy}
                    onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
                    placeholder="e.g. Computer Science"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="gy-3 mb-3">
              <Col md={6}>
                <Form.Group controlId="eduInst">
                  <Form.Label className="small fw-semibold">Institution Name *</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    placeholder="e.g. University of California, Berkeley"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="eduLoc">
                  <Form.Label className="small fw-semibold">Location</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Berkeley, CA"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="gy-3 mb-3">
              <Col sm={4}>
                <Form.Group controlId="eduStart">
                  <Form.Label className="small fw-semibold">Start Date *</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    placeholder="e.g. 2016-08"
                  />
                </Form.Group>
              </Col>

              <Col sm={4}>
                <Form.Group controlId="eduEnd">
                  <Form.Label className="small fw-semibold">End Date</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    placeholder="e.g. 2020-05"
                  />
                </Form.Group>
              </Col>

              <Col sm={4}>
                <Form.Group controlId="eduGrade">
                  <Form.Label className="small fw-semibold">Grade / Honors</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    placeholder="e.g. 3.85 GPA"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="eduDesc">
              <Form.Label className="small fw-semibold">Description / Coursework Highlights</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Key courses, academic clubs, or thesis title..."
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
          Are you sure you want to remove this education entry?
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
