import React from "react";
import "./App.css";
import CampsiteDirectoryPage from "./pages/CampsiteDirectoryPage";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App">
      <Header />
      <CampsiteDirectoryPage />
      <Footer />
    </div>
  );
}

export default App;
