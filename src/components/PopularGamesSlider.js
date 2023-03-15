import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardImgOverlay,
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
import "../css/styles.css";
import "../css/homeslider.css"
import { returnFirstGameGenre } from "../utils/gameGenre";

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
          <h3 className="my-4 pb-2 px-1">Popular Games Right Now</h3>
          <hr></hr>
        </Row>
        <Row>
          <Col>
            <Slider {...settings}>
              {games.map((game, index) => (
                <React.Fragment className="fragment" key={index}>
                  <Link to={`/games/${game.id}`}>
                    <Card className="card" key={game}>
                      <CardImg id="cardImage" className="cardImage"
                        alt={game.name}
                        src={game.cover}
                        style={{
                          width: "100%",
                          // width: "263px",
                          margin: "0 auto",
                          display: "block",
                        }}
                        top
                      />

                      <CardBody>
                        <CardTitle tag="h5">{game.name}</CardTitle>
                        <CardSubtitle className="mb-2 text-muted" tag="h6">
                          <div>{returnFirstGameGenre(game.genre)}</div>
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

export default PopularGamesSlider;
