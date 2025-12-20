import { Col } from "reactstrap";
import React from 'react'

const Loading = ({ message = 'Loading...' }) => {
  return (
    <Col className="text-center py-5">
      <div className="d-flex flex-column align-items-center justify-content-center">
        <i className="fa fa-spinner fa-pulse fa-3x fa-fw text-primary mb-3" />
        <h4 className="text-muted">{message}</h4>
      </div>
    </Col>
  )
}

export default Loading;