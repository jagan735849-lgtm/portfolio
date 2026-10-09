import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Badge,
  Card,
  InputGroup,
  Form,
} from 'react-bootstrap';
import {
  BsSearch,
  BsTrash,
  BsEnvelopeOpen,
  BsEnvelope,
  BsEye,
} from 'react-icons/bs';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { contactService } from '../../services/contactService';
import { IContactMessage } from '../../types';

export const ManageMessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<IContactMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterRead, setFilterRead] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // View Modal
  const [selectedMessage, setSelectedMessage] = useState<IContactMessage | null>(null);
  const [showViewModal, setShowViewModal] = useState<boolean>(false);

  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const isReadParam =
        filterRead === 'read' ? true : filterRead === 'unread' ? false : undefined;
      const res = await contactService.getMessages({
        limit: 50,
        isRead: isReadParam,
        search: searchTerm.trim() ? searchTerm.trim() : undefined,
      });

      if (res.success && res.data) {
        setMessages(res.data);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [filterRead]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMessages();
  };

  const toggleReadStatus = async (msg: IContactMessage) => {
    try {
      const updated = !msg.isRead;
      await contactService.updateMessageStatus(msg._id, updated);
      setMessages((prev) =>
        prev.map((m) => (m._id === msg._id ? { ...m, isRead: updated } : m))
      );
      if (selectedMessage && selectedMessage._id === msg._id) {
        setSelectedMessage({ ...selectedMessage, isRead: updated });
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const openMessage = (msg: IContactMessage) => {
    setSelectedMessage(msg);
    setShowViewModal(true);
    if (!msg.isRead) {
      toggleReadStatus(msg);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await contactService.deleteMessage(deleteId);
      setShowDeleteModal(false);
      setDeleteId(null);
      if (selectedMessage && selectedMessage._id === deleteId) {
        setShowViewModal(false);
      }
      await fetchMessages();
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading inquiries..." />;
  }

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Contact Messages</h2>
          <p className="text-muted small mb-0">
            View inquiries and correspondence sent through your portfolio contact form.
          </p>
        </div>

        <div className="d-flex gap-2">
          <Button
            variant={filterRead === 'all' ? 'primary' : 'outline-secondary'}
            size="sm"
            className="rounded-pill px-3"
            onClick={() => setFilterRead('all')}
          >
            All
          </Button>
          <Button
            variant={filterRead === 'unread' ? 'primary' : 'outline-secondary'}
            size="sm"
            className="rounded-pill px-3"
            onClick={() => setFilterRead('unread')}
          >
            Unread
          </Button>
          <Button
            variant={filterRead === 'read' ? 'primary' : 'outline-secondary'}
            size="sm"
            className="rounded-pill px-3"
            onClick={() => setFilterRead('read')}
          >
            Read
          </Button>
        </div>
      </div>

      <Card className="custom-card p-4">
        <div className="mb-4" style={{ maxWidth: '350px' }}>
          <Form onSubmit={handleSearchSubmit}>
            <InputGroup size="sm">
              <InputGroup.Text className="bg-transparent border-end-0">
                <BsSearch />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search sender, subject, or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-start-0"
              />
            </InputGroup>
          </Form>
        </div>

        {messages.length === 0 ? (
          <div className="text-center py-5 text-muted small">
            No messages found matching your criteria.
          </div>
        ) : (
          <div className="table-responsive">
            <Table hover className="align-middle mb-0">
              <thead>
                <tr className="text-muted small">
                  <th>Status</th>
                  <th>Sender</th>
                  <th>Subject</th>
                  <th>Date</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((msg) => (
                  <tr
                    key={msg._id}
                    className={msg.isRead ? '' : 'table-active fw-medium'}
                    style={{ cursor: 'pointer' }}
                  >
                    <td onClick={() => openMessage(msg)}>
                      <Badge
                        bg={msg.isRead ? 'secondary-subtle' : 'primary'}
                        className={msg.isRead ? 'text-secondary rounded-pill' : 'rounded-pill'}
                      >
                        {msg.isRead ? 'Read' : 'New'}
                      </Badge>
                    </td>
                    <td onClick={() => openMessage(msg)}>
                      <div>{msg.name}</div>
                      <div className="small text-muted">{msg.email}</div>
                    </td>
                    <td onClick={() => openMessage(msg)}>
                      <div className="text-truncate" style={{ maxWidth: '340px' }}>
                        {msg.subject}
                      </div>
                      <div className="small text-muted text-truncate" style={{ maxWidth: '340px' }}>
                        {msg.message}
                      </div>
                    </td>
                    <td onClick={() => openMessage(msg)} className="small text-nowrap text-muted">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </td>
                    <td className="text-end">
                      <div className="d-inline-flex gap-2">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          className="p-2"
                          onClick={() => openMessage(msg)}
                          title="View Message"
                        >
                          <BsEye size={14} />
                        </Button>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          className="p-2"
                          onClick={() => toggleReadStatus(msg)}
                          title={msg.isRead ? 'Mark as Unread' : 'Mark as Read'}
                        >
                          {msg.isRead ? <BsEnvelope size={14} /> : <BsEnvelopeOpen size={14} />}
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="p-2"
                          onClick={() => {
                            setDeleteId(msg._id);
                            setShowDeleteModal(true);
                          }}
                          title="Delete Message"
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
        )}
      </Card>

      {/* View Message Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg" centered>
        {selectedMessage && (
          <>
            <Modal.Header closeButton>
              <Modal.Title className="fs-5 fw-bold">{selectedMessage.subject}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                <div>
                  <h6 className="fw-bold mb-0">{selectedMessage.name}</h6>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="small text-primary text-decoration-none"
                  >
                    {selectedMessage.email}
                  </a>
                </div>
                <div className="text-muted small">
                  {new Date(selectedMessage.createdAt).toLocaleString()}
                </div>
              </div>

              <div
                className="p-3 rounded-3 bg-body-tertiary mb-3 text-body"
                style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7' }}
              >
                {selectedMessage.message}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => toggleReadStatus(selectedMessage)}
              >
                {selectedMessage.isRead ? 'Mark as Unread' : 'Mark as Read'}
              </Button>
              <Button
                as="a"
                href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                variant="primary"
                size="sm"
                className="btn-primary-gradient"
              >
                Reply via Email
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered size="sm">
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 fw-bold">Delete Message</Modal.Title>
        </Modal.Header>
        <Modal.Body className="small text-muted">
          Are you sure you want to delete this message?
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
