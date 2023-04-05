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
import Slider from "react-slick";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../css/slickstyle.css";
import "../css/styles.css";
import "../css/homeslider.css";
import { returnAllGameGenres } from "../utils/gameGenre";
import { useSelector } from "react-redux";
import { selectAllGames } from "../features/games/gamesSlice";

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

  const games = useSelector(selectAllGames);
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
                      <CardImg
                        className="cardImage"
                        alt={game.name}
                        src={game.cover}
                        style={{
                          width: "100%",
                          height: "400px",
                          margin: "0 auto",
                          display: "block",
                        }}
                        top
                      />

                      <CardBody style={{ height: "6rem" }}>
                        <CardTitle tag="h5">{game.name}</CardTitle>
                        <CardSubtitle className="mb-2 text-muted" tag="h6">
                          <div>{returnAllGameGenres(game.genre)}</div>
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
