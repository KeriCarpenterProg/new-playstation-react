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
import "../css/styles.css";
import "../css/homeslider.css";
import { returnAllGameGenres } from "../utils/gameGenre";

const PopularGamesSlider = () => {
  // Slick Slider Settings ----> Begin
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
    initialSlide: 2,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 800,
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
              {games.map((games, index) => (
                <React.Fragment className="fragment" key={index}>
                  <Link to={`/games/${games.id}`}>
                    <Card className="card" key={games}>
                      <CardImg
                        id="cardImage"
                        className="cardImage"
                        alt={games.name}
                        src={games.cover}
                        style={{
                          width: "100%",
                          height: "400px",
                          margin: "0 auto",
                          display: "block",
                        }}
                        top
                      />

                      <CardBody style={{ height: "6rem" }}>
                        <CardTitle tag="h5">{games.name}</CardTitle>
                        <CardSubtitle className="mb-2 text-muted" tag="h6">
                          <div>
                            <b>Genre: </b>
                            {returnAllGameGenres(games.genre)}
                          </div>
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
