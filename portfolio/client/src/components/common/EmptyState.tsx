import React from 'react';
import { Button } from 'react-bootstrap';
import { BsInbox } from 'react-icons/bs';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Data Available',
  description = 'There are currently no items matching your criteria.',
  actionText,
  onAction,
  icon,
}) => {
  return (
    <div className="text-center py-5 my-4">
      <div
        className="d-inline-flex align-items-center justify-content-center rounded-circle p-4 mb-3"
        style={{ backgroundColor: 'rgba(56, 189, 248, 0.08)', color: '#38bdf8' }}
      >
        {icon || <BsInbox size={48} />}
      </div>
      <h4 className="fw-bold mb-2">{title}</h4>
      <p className="text-muted mx-auto mb-4" style={{ maxWidth: '450px' }}>
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="outline-primary" onClick={onAction} className="rounded-pill px-4">
          {actionText}
        </Button>
      )}
    </div>
  );
};
