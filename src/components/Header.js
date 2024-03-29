import {
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import "../css/header.css";
import { useSelector } from "react-redux";
import { selectAllGames } from "../features/games/gamesSlice";

const Header = () => {

  const [menuOpen, setMenuOpen] = useState(false);
  const toggle = () => setMenuOpen(!menuOpen);

  const games = useSelector(selectAllGames);

  return (
    <div>
      <Navbar dark={true} color="dark" sticky="top" expand="xl">
        <NavbarBrand href="/">Playstation Games</NavbarBrand>
        <NavbarToggler onClick={toggle}></NavbarToggler>
        <Collapse isOpen={menuOpen} navbar>
          <Nav navbar>
            <NavItem>
              <NavLink className="nav-link" to="/">
                <i className="fa fa-home fa-md" /> Home
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="nav-link" to="/about">
                <i className="fa fa-info fa-md" /> About
              </NavLink>
            </NavItem>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Playstation Games
              </DropdownToggle>
              <DropdownMenu end>
                {games.map((i, index) => (
                  <React.Fragment key={index}>
                    <DropdownItem role={navigator}>
                      <Link to={`/games/${i.id}`} className="dropLink">
                        {i.name}
                      </Link>
                    </DropdownItem>
                  </React.Fragment>
                ))}
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
