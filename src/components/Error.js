import { Col } from "reactstrap";
import React from 'react'

const Error = ({ errMsg }) => {
    return (
        <Col>
            <h4>{errMsg}</h4>
        </Col>
    )
}

export default Error;