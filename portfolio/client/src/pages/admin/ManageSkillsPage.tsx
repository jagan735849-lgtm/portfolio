import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
  ProgressBar,
  Badge,
  Alert,
} from 'react-bootstrap';
import { BsPlusCircle, BsPencil, BsTrash } from 'react-icons/bs';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { skillService } from '../../services/skillService';
import { ISkill, SkillCategory, SkillLevel } from '../../types';

export const ManageSkillsPage: React.FC = () => {
  const [skills, setSkills] = useState<ISkill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal State
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    category: SkillCategory;
    proficiency: number;
    level: SkillLevel;
    icon: string;
    order: number;
  }>({
    name: '',
    category: 'frontend',
    proficiency: 85,
    level: 'Advanced',
    icon: 'Code',
    order: 0,
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const res = await skillService.getSkills();
      if (res.success && res.data) {
        setSkills(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch skills:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const openCreateModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      name: '',
      category: 'frontend',
      proficiency: 85,
      level: 'Advanced',
      icon: 'Code',
      order: skills.length + 1,
    });
    setFormError(null);
    setShowModal(true);
  };

  const openEditModal = (skill: ISkill) => {
    setIsEditing(true);
    setCurrentId(skill._id);
    setFormData({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      level: skill.level,
      icon: skill.icon || 'Code',
      order: skill.order || 0,
    });
    setFormError(null);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Skill name is required.');
      return;
    }

    try {
      setSaving(true);
      setFormError(null);

      if (isEditing && currentId) {
        await skillService.updateSkill(currentId, formData);
      } else {
        await skillService.createSkill(formData);
      }

      setShowModal(false);
      await fetchSkills();
    } catch (err: any) {
      setFormError(err.response?.data?.message || err.message || 'Failed to save skill');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await skillService.deleteSkill(deleteId);
      setShowDeleteModal(false);
      setDeleteId(null);
      await fetchSkills();
    } catch (err) {
      console.error('Failed to delete skill:', err);
    }
  };

  const categoryNames: Record<SkillCategory, string> = {
    frontend: 'Frontend Development',
    backend: 'Backend & APIs',
    database: 'Databases & Caching',
    programming: 'Programming Languages',
    tools: 'DevOps & Tooling',
    other: 'Other Technologies',
  };

  const categoriesOrder: SkillCategory[] = ['frontend', 'backend', 'database', 'programming', 'tools'];

  if (loading) {
    return <LoadingSpinner message="Loading skills management..." />;
  }

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Manage Technical Skills</h2>
          <p className="text-muted small mb-0">
            Configure skills, proficiencies, and categories shown on the portfolio.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={openCreateModal}
          className="btn-primary-gradient d-flex align-items-center gap-2 rounded-pill px-4"
        >
          <BsPlusCircle />
          <span>Add New Skill</span>
        </Button>
      </div>

      {categoriesOrder.map((catKey) => {
        const catSkills = skills.filter((s) => s.category === catKey);
        if (catSkills.length === 0) return null;

        return (
          <Card key={catKey} className="custom-card p-4 mb-4">
            <h5 className="fw-bold text-primary mb-3">{categoryNames[catKey]}</h5>
            <Row className="gy-3">
              {catSkills.map((skill) => (
                <Col md={6} lg={4} key={skill._id}>
                  <div className="p-3 rounded-3 border bg-body-tertiary">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <div className="fw-bold">{skill.name}</div>
                        <Badge bg="secondary-subtle" className="text-secondary small">
                          {skill.level}
                        </Badge>
                      </div>

                      <div className="d-flex gap-1">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          className="p-1 px-2"
                          onClick={() => openEditModal(skill)}
                          title="Edit"
                        >
                          <BsPencil size={12} />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="p-1 px-2"
                          onClick={() => {
                            setDeleteId(skill._id);
                            setShowDeleteModal(true);
                          }}
                          title="Delete"
                        >
                          <BsTrash size={12} />
                        </Button>
                      </div>
                    </div>

                    <ProgressBar
                      now={skill.proficiency}
                      variant="primary"
                      style={{ height: '6px', borderRadius: '3px' }}
                    />
                    <div className="d-flex justify-content-between text-muted small mt-1" style={{ fontSize: '0.72rem' }}>
                      <span>Proficiency</span>
                      <span className="fw-bold">{skill.proficiency}%</span>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        );
      })}

      {/* Add / Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title className="fs-5 fw-bold">
              {isEditing ? 'Edit Skill' : 'Add New Skill'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            {formError && <Alert variant="danger">{formError}</Alert>}

            <Form.Group className="mb-3" controlId="skillName">
              <Form.Label className="small fw-semibold">Skill Name *</Form.Label>
              <Form.Control
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. TypeScript, GraphQL, Docker"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="skillCategory">
              <Form.Label className="small fw-semibold">Category *</Form.Label>
              <Form.Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as SkillCategory })}
              >
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="database">Database</option>
                <option value="programming">Programming Language</option>
                <option value="tools">Tools & DevOps</option>
                <option value="other">Other</option>
              </Form.Select>
            </Form.Group>

            <Row className="gy-3 mb-3">
              <Col sm={6}>
                <Form.Group controlId="skillLevel">
                  <Form.Label className="small fw-semibold">Expertise Level</Form.Label>
                  <Form.Select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value as SkillLevel })}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col sm={6}>
                <Form.Group controlId="skillOrder">
                  <Form.Label className="small fw-semibold">Sort Order</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 0 })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="skillProficiency">
              <Form.Label className="small fw-semibold d-flex justify-content-between">
                <span>Proficiency Percentage</span>
                <span className="text-primary fw-bold">{formData.proficiency}%</span>
              </Form.Label>
              <Form.Range
                min={0}
                max={100}
                value={formData.proficiency}
                onChange={(e) => setFormData({ ...formData, proficiency: parseInt(e.target.value, 10) })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={saving} className="btn-primary-gradient">
              {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Skill'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered size="sm">
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 fw-bold">Delete Skill</Modal.Title>
        </Modal.Header>
        <Modal.Body className="small text-muted">
          Are you sure you want to remove this skill?
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
