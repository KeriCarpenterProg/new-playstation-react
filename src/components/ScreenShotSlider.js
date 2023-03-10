import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardSubtitle,
} from "reactstrap";
import games from "../utils/helpers";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../css/slickstyle.css";
import "../css/maxHeight.css";
import "../css/styles.css";

const ScreenshotSlider = () => {
const { screenshots } = games[0];

  // Slick Slider Settings ----> Begin
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 2,
    initialSlide: 3,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  // Slick Slider Settings ----> End

  return (
    <div>
      <Container>
        <Row>
          <hr/>
          <h3 className="my-4 pb-2 px-1">Game Artwork: Videos, Screenshots, Covers</h3>
          <hr></hr>
        </Row>
        <Row>
          <Col>
            <Slider {...settings}>
              {screenshots.map((screenshot, index) => (
                <React.Fragment key={index}>
                  <Link to={`/games/${games.id}`}>
                    <Card key={index}>
                      <CardImg
                        alt={screenshot}
                        src={screenshot}
                        style={{
                          width: "60%",
                          marginRight: "auto",
                          marginLeft: "auto",
                          display: "block",
                        }}
                        top
                        width="100%"
                      />

                      <CardBody>
                        <CardTitle tag="h5">{screenshot}</CardTitle>
                        <CardSubtitle className="mb-2 text-muted" tag="h6">
                          Action Adventure
                        </CardSubtitle>
                      </CardBody>
                    </Card>
                  </Link>
                </React.Fragment>
              ))}
            </Slider>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ScreenshotSlider;
