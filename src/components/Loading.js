import { Col } from "reactstrap";
import React from 'react'

const Loading = () => {
  return (
    <Col>
        <i className="fa fa-spinner fa-pulse fa-2x fa-fw" />
        <p>Loading...</p>
    </Col>
  )
}

export default Loading;