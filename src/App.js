import { Routes, Route } from "react-router-dom";
import React from "react";
import "./App.css";
import ContactPage from "./pages/ContactPage";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import CampsiteDirectoryPage from "./pages/CampsiteDirectoryPage";
import CampsiteDetailPage from "./pages/CampsiteDetailPage";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />}></Route>
        <Route path="directory" element={<CampsiteDirectoryPage />}></Route>
        <Route path="directory/:campsiteId" element={<CampsiteDetailPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
