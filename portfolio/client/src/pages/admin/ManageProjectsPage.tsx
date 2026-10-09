import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Badge,
  Card,
  InputGroup,
  Alert,
  Row,
  Col,
} from 'react-bootstrap';
import {
  BsPlusCircle,
  BsPencil,
  BsTrash,
  BsSearch,
} from 'react-icons/bs';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { projectService } from '../../services/projectService';
import { uploadService } from '../../services/uploadService';
import { BACKEND_URL } from '../../utils/config';
import { IProject, ProjectCategory } from '../../types';

export const ManageProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modal State
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    longDescription: string;
    thumbnail: string;
    technologies: string;
    category: ProjectCategory;
    githubUrl: string;
    liveDemoUrl: string;
    featured: boolean;
    order: number;
  }>({
    title: '',
    description: '',
    longDescription: '',
    thumbnail: '',
    technologies: '',
    category: 'Full Stack',
    githubUrl: '',
    liveDemoUrl: '',
    featured: false,
    order: 0,
  });

  const [uploading, setUploading] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  // Delete confirmation
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await projectService.getProjects({ limit: 100 });
      if (res.success && res.data) {
        setProjects(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openCreateModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      title: '',
      description: '',
      longDescription: '',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      technologies: 'React, TypeScript, Node.js, Express, MongoDB',
      category: 'Full Stack',
      githubUrl: '',
      liveDemoUrl: '',
      featured: false,
      order: projects.length + 1,
    });
    setFormError(null);
    setShowModal(true);
  };

  const openEditModal = (project: IProject) => {
    setIsEditing(true);
    setCurrentId(project._id);
    setFormData({
      title: project.title,
      description: project.description,
      longDescription: project.longDescription || '',
      thumbnail: project.thumbnail,
      technologies: project.technologies.join(', '),
      category: project.category,
      githubUrl: project.githubUrl || '',
      liveDemoUrl: project.liveDemoUrl || '',
      featured: project.featured,
      order: project.order || 0,
    });
    setFormError(null);
    setShowModal(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const res = await uploadService.uploadFile(file);
      if (res.success && res.data) {
        setFormData((prev) => ({
          ...prev,
          thumbnail: `${BACKEND_URL}${res.data.url}`,
        }));
      }
    } catch (err: any) {
      alert('Failed to upload file: ' + (err.message || 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      setFormError('Title and description are required.');
      return;
    }

    try {
      setSaving(true);
      setFormError(null);

      const techArray = formData.technologies
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        ...formData,
        technologies: techArray,
      };

      if (isEditing && currentId) {
        await projectService.updateProject(currentId, payload);
      } else {
        await projectService.createProject(payload);
      }

      setShowModal(false);
      await fetchProjects();
    } catch (err: any) {
      setFormError(err.response?.data?.message || err.message || 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await projectService.deleteProject(deleteId);
      setShowDeleteModal(false);
      setDeleteId(null);
      await fetchProjects();
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner message="Loading projects table..." />;
  }

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Manage Projects</h2>
          <p className="text-muted small mb-0">
            Create, update, or remove portfolio projects.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={openCreateModal}
          className="btn-primary-gradient d-flex align-items-center gap-2 rounded-pill px-4"
        >
          <BsPlusCircle />
          <span>Add New Project</span>
        </Button>
      </div>

      <Card className="custom-card p-4">
        <div className="mb-4" style={{ maxWidth: '350px' }}>
          <InputGroup size="sm">
            <InputGroup.Text className="bg-transparent border-end-0">
              <BsSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-start-0"
            />
          </InputGroup>
        </div>

        <div className="table-responsive">
          <Table hover className="align-middle mb-0">
            <thead>
              <tr className="text-muted small">
                <th>Thumbnail</th>
                <th>Project Details</th>
                <th>Category</th>
                <th>Status</th>
                <th>Order</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr key={project._id}>
                  <td style={{ width: '80px' }}>
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="rounded-3 object-fit-cover shadow-sm"
                      style={{ width: '64px', height: '44px' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                  </td>
                  <td>
                    <div className="fw-bold">{project.title}</div>
                    <div className="text-muted small text-truncate" style={{ maxWidth: '320px' }}>
                      {project.description}
                    </div>
                    <div className="d-flex flex-wrap gap-1 mt-1">
                      {project.technologies.slice(0, 3).map((t, idx) => (
                        <span key={idx} className="badge bg-secondary-subtle text-secondary small" style={{ fontSize: '0.7rem' }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <Badge bg="primary-subtle" className="text-primary border border-primary border-opacity-25 rounded-pill px-2">
                      {project.category}
                    </Badge>
                  </td>
                  <td>
                    {project.featured ? (
                      <Badge bg="warning" text="dark" className="rounded-pill">
                        Featured
                      </Badge>
                    ) : (
                      <span className="text-muted small">Standard</span>
                    )}
                  </td>
                  <td className="fw-semibold">{project.order}</td>
                  <td className="text-end">
                    <div className="d-inline-flex gap-2">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => openEditModal(project)}
                        className="p-2"
                        title="Edit Project"
                      >
                        <BsPencil size={14} />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => {
                          setDeleteId(project._id);
                          setShowDeleteModal(true);
                        }}
                        className="p-2"
                        title="Delete Project"
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

      {/* Create / Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold fs-5">
              {isEditing ? 'Edit Project' : 'Create New Project'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            {formError && <Alert variant="danger">{formError}</Alert>}

            <Form.Group className="mb-3" controlId="projTitle">
              <Form.Label className="small fw-semibold">Project Title *</Form.Label>
              <Form.Control
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. CloudPulse APM Platform"
              />
            </Form.Group>

            <Row className="gy-3 mb-3">
              <Col md={6}>
                <Form.Group controlId="projCategory">
                  <Form.Label className="small fw-semibold">Category *</Form.Label>
                  <Form.Select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ProjectCategory })}
                  >
                    <option value="Full Stack">Full Stack</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Cloud/DevOps">Cloud/DevOps</option>
                    <option value="AI/ML">AI/ML</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="projOrder">
                  <Form.Label className="small fw-semibold">Display Order Priority</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 0 })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="projShortDesc">
              <Form.Label className="small fw-semibold">Short Description (for cards) *</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief summary of what this application does..."
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="projLongDesc">
              <Form.Label className="small fw-semibold">Technical Architecture Details (Optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={formData.longDescription}
                onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                placeholder="Deep dive into system design, endpoints, database schema, scaling decisions..."
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="projTech">
              <Form.Label className="small fw-semibold">Technologies (Comma-separated) *</Form.Label>
              <Form.Control
                type="text"
                required
                value={formData.technologies}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                placeholder="React, TypeScript, Node.js, Express, MongoDB, Docker"
              />
            </Form.Group>

            {/* Thumbnail URL and Upload */}
            <Form.Group className="mb-3" controlId="projThumbnail">
              <Form.Label className="small fw-semibold">Thumbnail Image URL *</Form.Label>
              <InputGroup className="mb-2">
                <Form.Control
                  type="text"
                  required
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  placeholder="https://... or upload below"
                />
              </InputGroup>
              <div className="d-flex align-items-center gap-2">
                <Form.Control
                  type="file"
                  size="sm"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
                {uploading && <span className="small text-muted">Uploading...</span>}
              </div>
            </Form.Group>

            <Row className="gy-3 mb-3">
              <Col md={6}>
                <Form.Group controlId="projGithub">
                  <Form.Label className="small fw-semibold">GitHub Repository URL</Form.Label>
                  <Form.Control
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/developer/repo"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="projDemo">
                  <Form.Label className="small fw-semibold">Live Production Demo URL</Form.Label>
                  <Form.Control
                    type="url"
                    value={formData.liveDemoUrl}
                    onChange={(e) => setFormData({ ...formData, liveDemoUrl: e.target.value })}
                    placeholder="https://demo.app"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Check
              type="checkbox"
              id="projFeatured"
              label="Feature this project on the Home Page"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="fw-medium small mt-2"
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={saving} className="btn-primary-gradient">
              {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Project'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered size="sm">
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 fw-bold">Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body className="small text-muted">
          Are you sure you want to delete this project? This action cannot be undone.
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
