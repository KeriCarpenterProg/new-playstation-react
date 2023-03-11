import React from "react";
import { Container, Row, Col } from "reactstrap";
import games from "../utils/helpers";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../css/slickstyle.css";
import "../css/recentlyreviewed.css";

const RecentlyReviewed = () => {
  return (
    <div>
      <Container>
        <Row>
          <h3 className="my-4 pb-2 px-1">Recently Reviewed</h3>
          <hr></hr>
        </Row>
        <Row className="py-3">
          <Col>
            <a
              href="page3.html"
              className="review-panel embed-responsive-16by9"
            >
              <div className="review-panel-caption">
                <p className="review-panel-title overflow-wrap">
                  The Last Of Us: Part 2 is great
                </p>
                <p className="review-panel-genres">Adventure/Shooter</p>
              </div>
              <div className="review-panel-rating">80%</div>
              <img
                src="https://images.igdb.com/igdb/image/upload/t_original/rqr5dxxw97zikyhdn2tq.jpg"
                alt=""
                className="w-100"
              ></img>
            </a>
          </Col>
          <Col>
            <a href="page3.html" className="review-panel embed-responsive-16by9">
              <div className="review-panel-caption">
                <p className="review-panel-title overflow-wrap">
                  Collossal Cave Adventure
                </p>
                <p className="review-panel-genres">Adventure/Shooter</p>
              </div>
              <div className="review-panel-rating">80%</div>
              <img
                src="https://images.igdb.com/igdb/image/upload/t_original/kazgjykzu18dhqjpspko.jpg"
                alt=""
                className="w-100"
              ></img>
            </a>
          </Col>
          <Col>
            <a href="page3.html" className="review-panel embed-responsive-16by9">
              <div className="review-panel-caption">
                <p className="review-panel-title overflow-wrap">
                  Witch on a Holy Night
                </p>
                <p className="review-panel-genres">Adventure/Shooter</p>
              </div>
              <div className="review-panel-rating">80%</div>
              <img
                src="https://images.igdb.com/igdb/image/upload/t_original/sc8i94.jpg"
                alt=""
                className="w-100"
              ></img>
            </a>
          </Col>
        </Row>
        <Row>
          <Col xs="8">
            <a href="page3.html" className="review-panel embed-responsive-16by9">
              <div className="review-panel-caption">
                <p className="review-panel-title overflow-wrap">
                  God of War Kratos and his Kid
                </p>
                <p className="review-panel-genres">Adventure/Shooter</p>
              </div>
              <div className="review-panel-rating">80%</div>
              <img
                src="https://images.igdb.com/igdb/image/upload/t_original/s2zdtxopibrfjbxvpj5h.jpg"
                alt=""
                className="w-100"
              ></img>
            </a>
          </Col>
          <Col>
            <a href="page3.html" className="review-panel embed-responsive-16by9">
              <div className="review-panel-caption">
                <p className="review-panel-title overflow-wrap">
                  God of War Kratos and his Kid
                </p>
                <p className="review-panel-genres">Adventure/Shooter</p>
              </div>
              <div className="review-panel-rating">80%</div>
              <img
                src="https://images.igdb.com/igdb/image/upload/t_original/kazgjykzu18dhqjpspko.jpg"
                alt=""
                className="w-100"
              ></img>
            </a>
            <a href="#" className="review-panel embed-responsive-16by9 mt-3">
              <div className="review-panel-caption">
                <p className="review-panel-title overflow-wrap">
                  The third card that I want to stack
                </p>
                <p className="review-panel-genres">Adventure/Shooter</p>
              </div>
              <div className="review-panel-rating">80%</div>
              <img
                src="https://images.igdb.com/igdb/image/upload/t_original/sc8i94.jpg"
                alt=""
                className="w-100"
              ></img>
            </a>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RecentlyReviewed;
