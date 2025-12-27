import { Col } from "reactstrap";
import React, { useState, useEffect } from 'react'

const Loading = ({ message = 'Loading...', showExtendedMessage = false }) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!showExtendedMessage) return;

    const interval = setInterval(() => {
      setElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [showExtendedMessage]);

  const getProgressMessage = () => {
    if (!showExtendedMessage) {
      return message;
    }

    if (elapsed < 5) {
      return message;
    } else if (elapsed < 15) {
      return (
        <>
          <div className="mb-2">{message}</div>
          <small className="text-muted">
            First visit? The database is waking up...
          </small>
        </>
      );
    } else if (elapsed < 30) {
      return (
        <>
          <div className="mb-2">Still loading...</div>
          <small className="text-muted">
            This can take up to a minute on first visit. Everything is working normally!
          </small>
        </>
      );
    } else {
      return (
        <>
          <div className="mb-2">Almost there...</div>
          <small className="text-muted">
            The database is warming up. This is normal for the first load.
            <br />
            Thanks for your patience! 🎮
          </small>
        </>
      );
    }
  };

  return (
    <Col className="text-center py-5">
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '50vh' }}>
        <i className="fa fa-spinner fa-pulse fa-3x fa-fw text-primary mb-3" />
        <h4 className="text-muted">{getProgressMessage()}</h4>
        {showExtendedMessage && elapsed >= 5 && (
          <div className="mt-3">
            <small className="text-muted">Elapsed: {elapsed}s</small>
          </div>
        )}
      </div>
    </Col>
  )
}

export default Loading;