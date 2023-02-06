import React from "react";
import "./App.css";
import { Container, Navbar, NavbarBrand } from "reactstrap";
import NucampLogo from "./app/assets/img/logo.png";

function App() {
  return (
    <div className="App">
      <Navbar dark color="primary" sticky="top" expand="md">
        <Container>
          <NavbarBrand href="/">
            <img src={NucampLogo} alt="nucamp logo" />
          </NavbarBrand>
        </Container>
      </Navbar>
      I'm ready for workshop!
    </div>
  );
}

export default App;
