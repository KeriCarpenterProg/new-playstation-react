import React from "react";
import { Container, Row, Col } from "reactstrap";
import games from "../utils/helpers";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../css/slickstyle.css";

const PopularGamesSlider = () => {
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
        <h1>Popular Games Right Now</h1>
        <hr></hr>
      </Row>
      <Row>
        <Col>
        <Slider {...settings}>
          {games.map((i, index) => (
            <React.Fragment key={index}>
              <Link to={`/games/${i.id}`}>
                <div className="card" key={i}>
                  <img src={i.cover} alt={i.name} />
                  <h5>{i.name}</h5>
                </div>
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

export default PopularGamesSlider;
