import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
  BsFolderCheck,
  BsTools,
  BsBriefcase,
  BsEnvelope,
  BsEnvelopeExclamation,
  BsPlusCircle,
  BsArrowRight,
  BsPersonGear,
} from 'react-icons/bs';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { contactService } from '../../services/contactService';
import { IDashboardStats, IContactMessage } from '../../types';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<IDashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await contactService.getDashboardStats();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading dashboard telemetry..." />;
  }

  const counts = stats?.counts || {
    projects: 0,
    featuredProjects: 0,
    skills: 0,
    experience: 0,
    education: 0,
    messages: 0,
    unreadMessages: 0,
  };

  return (
    <div>
      {/* Title & Quick Actions */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Portfolio Control Panel</h2>
          <p className="text-muted small mb-0">
            Real-time content metrics and inquiries overview.
          </p>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <Link to="/admin/projects" className="btn btn-primary btn-sm d-flex align-items-center gap-2 rounded-pill px-3">
            <BsPlusCircle />
            <span>Manage Projects</span>
          </Link>
          <Link to="/admin/profile" className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2 rounded-pill px-3">
            <BsPersonGear />
            <span>Edit Profile</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="gy-4 mb-5">
        <Col sm={6} lg={3}>
          <Card className="custom-card p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <span className="text-muted small text-uppercase fw-semibold">Projects</span>
              <div className="p-2 rounded-3 bg-primary bg-opacity-10 text-primary">
                <BsFolderCheck size={20} />
              </div>
            </div>
            <div className="display-6 fw-bold mb-1">{counts.projects}</div>
            <div className="small text-muted">
              <span className="text-primary fw-medium">{counts.featuredProjects}</span> featured in showcase
            </div>
          </Card>
        </Col>

        <Col sm={6} lg={3}>
          <Card className="custom-card p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <span className="text-muted small text-uppercase fw-semibold">Skills</span>
              <div className="p-2 rounded-3 bg-info bg-opacity-10 text-info">
                <BsTools size={20} />
              </div>
            </div>
            <div className="display-6 fw-bold mb-1">{counts.skills}</div>
            <div className="small text-muted">Across 5 technical categories</div>
          </Card>
        </Col>

        <Col sm={6} lg={3}>
          <Card className="custom-card p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <span className="text-muted small text-uppercase fw-semibold">Timeline Entries</span>
              <div className="p-2 rounded-3 bg-success bg-opacity-10 text-success">
                <BsBriefcase size={20} />
              </div>
            </div>
            <div className="display-6 fw-bold mb-1">
              {counts.experience + counts.education}
            </div>
            <div className="small text-muted">
              {counts.experience} Experience & {counts.education} Education
            </div>
          </Card>
        </Col>

        <Col sm={6} lg={3}>
          <Card className="custom-card p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <span className="text-muted small text-uppercase fw-semibold">Messages</span>
              <div
                className={`p-2 rounded-3 ${
                  counts.unreadMessages > 0
                    ? 'bg-warning bg-opacity-10 text-warning'
                    : 'bg-secondary bg-opacity-10 text-secondary'
                }`}
              >
                {counts.unreadMessages > 0 ? (
                  <BsEnvelopeExclamation size={20} />
                ) : (
                  <BsEnvelope size={20} />
                )}
              </div>
            </div>
            <div className="display-6 fw-bold mb-1">{counts.messages}</div>
            <div className="small text-muted">
              <Badge bg={counts.unreadMessages > 0 ? 'warning' : 'secondary'} text={counts.unreadMessages > 0 ? 'dark' : 'light'}>
                {counts.unreadMessages} Unread
              </Badge>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Inquiries Section */}
      <Card className="custom-card p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h5 className="fw-bold mb-0">Recent Contact Inquiries</h5>
            <div className="text-muted small">Latest submissions received through the public contact form</div>
          </div>
          <Link
            to="/admin/messages"
            className="text-decoration-none text-primary fw-semibold small d-inline-flex align-items-center gap-1"
          >
            <span>View All Messages</span>
            <BsArrowRight size={13} />
          </Link>
        </div>

        {stats?.recentMessages && stats.recentMessages.length > 0 ? (
          <div className="table-responsive">
            <Table hover className="align-middle mb-0">
              <thead>
                <tr className="text-muted small">
                  <th>Status</th>
                  <th>Sender</th>
                  <th>Subject</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentMessages.map((msg: IContactMessage) => (
                  <tr key={msg._id}>
                    <td>
                      <Badge bg={msg.isRead ? 'secondary' : 'primary'} className="rounded-pill">
                        {msg.isRead ? 'Read' : 'New'}
                      </Badge>
                    </td>
                    <td>
                      <div className="fw-semibold">{msg.name}</div>
                      <div className="text-muted small">{msg.email}</div>
                    </td>
                    <td>
                      <div className="text-truncate" style={{ maxWidth: '350px' }}>
                        {msg.subject}
                      </div>
                    </td>
                    <td className="small text-muted">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-4 text-muted small">
            No contact messages received yet.
          </div>
        )}
      </Card>
    </div>
  );
};
