import { Routes, Route } from "react-router-dom";
import React, { useEffect} from "react";
import { useDispatch } from "react-redux";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SingleGamePage from "./pages/SingleGamePage";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ImportGamesPage from "./pages/ImportGamesPage";
import DatabasePage from "./pages/DatabasePage";
import RedisDemo from "./pages/RedisDemo";
import { fetchGames } from "./features/games/gamesSlice";
import { fetchComments } from "./features/comments/commentsSlice";
import ChatPage from "./pages/ChatPage";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import ProfilePicturePage from "./pages/ProfilePicturePage";

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
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/games/:activeGame" element={<SingleGamePage />}></Route>
        <Route path="/import" element={<ImportGamesPage />} />
        <Route path="/database" element={<DatabasePage />} />
        <Route path="/redis-demo" element={<RedisDemo />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile-picture" element={<ProfilePicturePage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
