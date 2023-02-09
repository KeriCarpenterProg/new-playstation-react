import React from "react";
import "./App.css";
import CampsitesList from "./features/campsites/CampsitesLists";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App">
      <Header />
      <CampsitesList></CampsitesList>
      <Footer />
    </div>
  );
}

export default App;
