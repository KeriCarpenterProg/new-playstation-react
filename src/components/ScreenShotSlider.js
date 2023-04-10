import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardImg,
  CardBody,
  CardTitle,
} from "reactstrap";
import Slider from "react-slick";
import { useParams } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../css/slickstyle.css";
import "../css/maxHeight.css";
import "../css/styles.css";
import { useSelector } from "react-redux";
import { selectAllGames } from "../features/games/gamesSlice";

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
  const game = useSelector(selectAllGames)[activeGame];
  const screenshotUrls = game.screenshots;

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
                  <Card key={game}>
                    <CardImg
                      alt={game.name}
                      src={screenshot}
                      top
                      width="100%"
                    />
                    <CardBody>
                      <CardTitle tag="h5">{game.name}</CardTitle>
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