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
import "../css/maxHeight.css";
import "../css/styles.css";
import { selectAllGames, selectAllGameGenres } from "../features/games/gamesSlice";
import { useSelector } from "react-redux";

const RecommendedGamesSlider = () => {
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
                <React.Fragment key={index}>
                  <Link to={`/games/${game.id}`}>
                    <Card key={game}>
                      <CardImg
                        alt={game.name}
                        src={game.cover}
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
                        <CardTitle tag="h5">{game.name}</CardTitle>
                        <CardSubtitle className="mb-2 text-muted" tag="h6">
                          {selectAllGameGenres(game.genre)}
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

export default RecommendedGamesSlider;
