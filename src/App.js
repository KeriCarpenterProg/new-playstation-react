import { Routes, Route } from "react-router-dom";
import React from "react";
// import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SingleGamePage from "./components/SingleGamePage";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="*" element={<HomePage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/games/:activeGame" element={<SingleGamePage />}></Route>
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
