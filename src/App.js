import { Routes, Route } from "react-router-dom";
import React, { useEffect} from "react";
import { useDispatch } from "react-redux";
// import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SingleGamePage from "./pages/SingleGamePage";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ImportGamesPage from "./pages/ImportGamesPage";
import { fetchGames } from "./features/games/gamesSlice";
import { fetchComments } from "./features/comments/commentsSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchGames());
    dispatch(fetchComments());
  }, [dispatch]);


  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="*" element={<HomePage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/import" element={<ImportGamesPage />} />
        <Route path="/games/:activeGame" element={<SingleGamePage />}></Route>
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
