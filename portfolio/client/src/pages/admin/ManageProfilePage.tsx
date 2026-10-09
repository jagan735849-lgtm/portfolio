import React, { useEffect, useState } from 'react';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { BsSave, BsCheckCircle } from 'react-icons/bs';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { profileService } from '../../services/profileService';
import { uploadService } from '../../services/uploadService';
import { BACKEND_URL } from '../../utils/config';

export const ManageProfilePage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Upload states
  const [uploadingAvatar, setUploadingAvatar] = useState<boolean>(false);
  const [uploadingResume, setUploadingResume] = useState<boolean>(false);

  const [formData, setFormData] = useState<{
    name: string;
    title: string;
    tagline: string;
    bio: string;
    avatarUrl: string;
    resumeUrl: string;
    email: string;
    phone: string;
    location: string;
    availableForHire: boolean;
    yearsOfExperience: number;
    socialGithub: string;
    socialLinkedin: string;
    socialTwitter: string;
    socialWebsite: string;
    strengthsText: string;
    projectsCompleted: number;
    satisfiedClients: number;
    codeCommits: number;
  }>({
    name: '',
    title: '',
    tagline: '',
    bio: '',
    avatarUrl: '',
    resumeUrl: '',
    email: '',
    phone: '',
    location: '',
    availableForHire: true,
    yearsOfExperience: 5,
    socialGithub: '',
    socialLinkedin: '',
    socialTwitter: '',
    socialInstagram: '',
    socialWebsite: '',
    strengthsText: '',
    careerObjective: '',
    projectsCompleted: 35,
    satisfiedClients: 20,
    codeCommits: 3000,
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await profileService.getProfile();
      if (res.success && res.data) {
        const p = res.data;
        setFormData({
          name: p.name || '',
          title: p.title || '',
          tagline: p.tagline || '',
          bio: p.bio || '',
          avatarUrl: p.avatarUrl || '',
          resumeUrl: p.resumeUrl || '',
          email: p.email || '',
          phone: p.phone || '',
          location: p.location || '',
          availableForHire: p.availableForHire ?? true,
          yearsOfExperience: p.yearsOfExperience || 5,
          socialGithub: p.socialLinks?.github || '',
          socialLinkedin: p.socialLinks?.linkedin || '',
          socialTwitter: p.socialLinks?.twitter || '',
          socialInstagram: p.socialLinks?.instagram || '',
          socialWebsite: p.socialLinks?.website || '',
          strengthsText: (p.strengths || []).join('\n'),
          careerObjective: p.careerObjective || '',
          projectsCompleted: p.stats?.projectsCompleted || 35,
          satisfiedClients: p.stats?.satisfiedClients || 20,
          codeCommits: p.stats?.codeCommits || 3000,
        });
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingAvatar(true);
      const res = await uploadService.uploadFile(file);
      if (res.success && res.data) {
        setFormData((prev) => ({
          ...prev,
          avatarUrl: `${BACKEND_URL}${res.data.url}`,
        }));
      }
    } catch (err: any) {
      alert('Upload failed: ' + (err.message || 'Unknown error'));
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingResume(true);
      const res = await uploadService.uploadFile(file);
      if (res.success && res.data) {
        setFormData((prev) => ({
          ...prev,
          resumeUrl: `${BACKEND_URL}${res.data.url}`,
        }));
      }
    } catch (err: any) {
      alert('Upload failed: ' + (err.message || 'Unknown error'));
    } finally {
      setUploadingResume(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSuccessMsg(null);
      setErrorMsg(null);

      const strengthsArray = formData.strengthsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        name: formData.name,
        title: formData.title,
        tagline: formData.tagline,
        bio: formData.bio,
        avatarUrl: formData.avatarUrl,
        resumeUrl: formData.resumeUrl,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        availableForHire: formData.availableForHire,
        yearsOfExperience: formData.yearsOfExperience,
        socialLinks: {
          github: formData.socialGithub,
          linkedin: formData.socialLinkedin,
          twitter: formData.socialTwitter,
          instagram: formData.socialInstagram,
          website: formData.socialWebsite,
        },
        strengths: strengthsArray,
        careerObjective: formData.careerObjective,
        stats: {
          projectsCompleted: formData.projectsCompleted,
          satisfiedClients: formData.satisfiedClients,
          yearsExperience: formData.yearsOfExperience,
          codeCommits: formData.codeCommits,
        },
      };

      const res = await profileService.updateProfile(payload);
      if (res.success) {
        setSuccessMsg('Portfolio profile updated successfully!');
      } else {
        setErrorMsg('Failed to update profile');
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading profile configuration..." />;
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Portfolio Profile Settings</h2>
        <p className="text-muted small mb-0">
          Customize your bio, headline, contact coordinates, resume link, and metrics.
        </p>
      </div>

      {successMsg && (
        <Alert variant="success" className="d-flex align-items-center gap-2 mb-4">
          <BsCheckCircle size={18} />
          <div>{successMsg}</div>
        </Alert>
      )}

      {errorMsg && <Alert variant="danger" className="mb-4">{errorMsg}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row className="gy-4">
          <Col lg={8}>
            <Card className="custom-card p-4 mb-4">
              <h5 className="fw-bold mb-3">Core Identity & Introduction</h5>

              <Row className="gy-3 mb-3">
                <Col md={6}>
                  <Form.Group controlId="profName">
                    <Form.Label className="small fw-semibold">Display Name *</Form.Label>
                    <Form.Control
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="profTitle">
                    <Form.Label className="small fw-semibold">Professional Title *</Form.Label>
                    <Form.Control
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3" controlId="profTagline">
                <Form.Label className="small fw-semibold">Hero Tagline *</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="profBio">
                <Form.Label className="small fw-semibold">Comprehensive Bio *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  required
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="profStrengths">
                <Form.Label className="small fw-semibold">Core Strengths (One per line)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={formData.strengthsText}
                  onChange={(e) => setFormData({ ...formData, strengthsText: e.target.value })}
                />
              </Form.Group>
            </Card>

            <Card className="custom-card p-4 mb-4">
              <h5 className="fw-bold mb-3">Contact & Location</h5>

              <Row className="gy-3 mb-3">
                <Col md={6}>
                  <Form.Group controlId="profEmail">
                    <Form.Label className="small fw-semibold">Public Contact Email *</Form.Label>
                    <Form.Control
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="profPhone">
                    <Form.Label className="small fw-semibold">Phone Number</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="gy-3 mb-3">
                <Col md={6}>
                  <Form.Group controlId="profLoc">
                    <Form.Label className="small fw-semibold">Location *</Form.Label>
                    <Form.Control
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="profYears">
                    <Form.Label className="small fw-semibold">Years of Experience</Form.Label>
                    <Form.Control
                      type="number"
                      value={formData.yearsOfExperience}
                      onChange={(e) => setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value, 10) || 0 })}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Check
                type="checkbox"
                id="profAvailable"
                label="Mark as 'Available for new opportunities' on hero badge"
                checked={formData.availableForHire}
                onChange={(e) => setFormData({ ...formData, availableForHire: e.target.checked })}
                className="fw-medium small"
              />
            </Card>

            <Card className="custom-card p-4 mb-4">
              <h5 className="fw-bold mb-3">Social Profiles</h5>

              <Row className="gy-3 mb-3">
                <Col md={6}>
                  <Form.Group controlId="profGithub">
                    <Form.Label className="small fw-semibold">GitHub URL</Form.Label>
                    <Form.Control
                      type="url"
                      value={formData.socialGithub}
                      onChange={(e) => setFormData({ ...formData, socialGithub: e.target.value })}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="profLinkedin">
                    <Form.Label className="small fw-semibold">LinkedIn URL</Form.Label>
                    <Form.Control
                      type="url"
                      value={formData.socialLinkedin}
                      onChange={(e) => setFormData({ ...formData, socialLinkedin: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="gy-3">
                <Col md={6}>
                  <Form.Group controlId="profTwitter">
                    <Form.Label className="small fw-semibold">Twitter / X URL</Form.Label>
                    <Form.Control
                      type="url"
                      value={formData.socialTwitter}
                      onChange={(e) => setFormData({ ...formData, socialTwitter: e.target.value })}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="profWeb">
                    <Form.Label className="small fw-semibold">Personal Website URL</Form.Label>
                    <Form.Control
                      type="url"
                      value={formData.socialWebsite}
                      onChange={(e) => setFormData({ ...formData, socialWebsite: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Right Column: Avatar, Resume & Stats */}
          <Col lg={4}>
            {/* Avatar Setting */}
            <Card className="custom-card p-4 mb-4">
              <h5 className="fw-bold mb-3">Profile Photo</h5>
              <div className="text-center mb-3">
                <img
                  src={formData.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
                  alt="Profile Avatar"
                  className="rounded-circle object-fit-cover shadow-sm p-1 border"
                  style={{ width: '130px', height: '130px' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
                  }}
                />
              </div>

              <Form.Group className="mb-2" controlId="profAvatarUrl">
                <Form.Label className="small fw-semibold">Avatar Image URL</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.avatarUrl}
                  onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                />
              </Form.Group>

              <div>
                <Form.Label className="small fw-semibold">Upload Local Image</Form.Label>
                <Form.Control
                  type="file"
                  size="sm"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={uploadingAvatar}
                />
                {uploadingAvatar && <span className="small text-muted">Uploading photo...</span>}
              </div>
            </Card>

            {/* Resume File */}
            <Card className="custom-card p-4 mb-4">
              <h5 className="fw-bold mb-3">Resume Document</h5>

              <Form.Group className="mb-2" controlId="profResumeUrl">
                <Form.Label className="small fw-semibold">Resume URL / Path</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.resumeUrl}
                  onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                />
              </Form.Group>

              <div>
                <Form.Label className="small fw-semibold">Upload PDF Resume</Form.Label>
                <Form.Control
                  type="file"
                  size="sm"
                  accept=".pdf"
                  onChange={handleResumeUpload}
                  disabled={uploadingResume}
                />
                {uploadingResume && <span className="small text-muted">Uploading PDF...</span>}
              </div>
            </Card>

            {/* Stats Metrics */}
            <Card className="custom-card p-4 mb-4">
              <h5 className="fw-bold mb-3">Key Metrics Counters</h5>

              <Form.Group className="mb-2" controlId="statProjects">
                <Form.Label className="small fw-semibold">Projects Completed</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.projectsCompleted}
                  onChange={(e) => setFormData({ ...formData, projectsCompleted: parseInt(e.target.value, 10) || 0 })}
                />
              </Form.Group>

              <Form.Group className="mb-2" controlId="statClients">
                <Form.Label className="small fw-semibold">Satisfied Clients</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.satisfiedClients}
                  onChange={(e) => setFormData({ ...formData, satisfiedClients: parseInt(e.target.value, 10) || 0 })}
                />
              </Form.Group>

              <Form.Group className="mb-2" controlId="statCommits">
                <Form.Label className="small fw-semibold">Git Commits Count</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.codeCommits}
                  onChange={(e) => setFormData({ ...formData, codeCommits: parseInt(e.target.value, 10) || 0 })}
                />
              </Form.Group>
            </Card>

            <Button
              type="submit"
              disabled={saving}
              className="btn-primary-gradient w-100 py-3 d-flex align-items-center justify-content-center gap-2 fs-6 shadow-sm"
            >
              <BsSave size={16} />
              <span>{saving ? 'Saving Profile...' : 'Save Profile Changes'}</span>
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
