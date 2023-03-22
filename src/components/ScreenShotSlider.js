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
import { Link, useParams } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../css/slickstyle.css";
import "../css/maxHeight.css";
import "../css/styles.css";

const ScreenShotSlider = () => {
  // Slick Slider Settings ----> Begin
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
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
  const { activeGame } = useParams();
  const screenshotUrls = games[activeGame].screenshots;
  return (
    <div>
      <Container>
        <Row>
          <h3 className="my-4 pb-2 px-1">
            Artwork from Games: Videos, Screenshots, Covers
          </h3>
          <hr></hr>
        </Row>
        <Row>
          <Col>
            <Slider {...settings}>
              {screenshotUrls.map((screenshot, index) => (
                <React.Fragment key={index}>
                  <Card key={games[activeGame]}>
                    <CardImg
                      alt={games[activeGame].name}
                      src={screenshot}
                      top
                      width="100%"
                    />
                    <CardBody>
                      <CardTitle tag="h5">{games[activeGame].name}</CardTitle>
                    </CardBody>
                  </Card>
                </React.Fragment>
              ))}
            </Slider>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ScreenShotSlider;