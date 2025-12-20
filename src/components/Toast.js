import React, { useEffect } from 'react';
import { Alert } from 'reactstrap';

const Toast = ({ message, type = 'info', onClose, duration = 5000 }) => {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!message) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        minWidth: '300px',
        maxWidth: '500px',
        animation: 'slideIn 0.3s ease-out'
      }}
    >
      <Alert color={type} toggle={onClose} className="mb-0 shadow-lg">
        <div className="d-flex align-items-center">
          {type === 'success' && <i className="fa fa-check-circle mr-2" />}
          {type === 'danger' && <i className="fa fa-exclamation-circle mr-2" />}
          {type === 'warning' && <i className="fa fa-exclamation-triangle mr-2" />}
          {type === 'info' && <i className="fa fa-info-circle mr-2" />}
          <span>{message}</span>
        </div>
      </Alert>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Toast;

