import { Navbar, NavbarBrand, NavbarToggler, Collapse, Nav, NavItem, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { NavLink } from "react-router-dom";
import NucampLogo from "../app/assets/img/logo.png";
import { useState } from "react";
const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div>
      <Navbar className="dark bg-dark" color="dark" sticky="top" expand="md" >
        <NavbarBrand className="me-5" href="/">Playstation Games</NavbarBrand>
        <NavbarToggler onClick={() => setMenuOpen(!menuOpen)}/>
        <Collapse isOpen={menuOpen} navbar>
          <Nav navbar className="ms-5">
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
              <DropdownMenu right>
                <DropdownItem>God of War: Ragnarok</DropdownItem>
                <DropdownItem>Minecraft</DropdownItem>
                <DropdownItem>Spider Man</DropdownItem>
                <DropdownItem>God of War</DropdownItem>
                <DropdownItem>Death Stranding</DropdownItem>
                <DropdownItem>Call of Duty</DropdownItem>
                <DropdownItem>Uncharted</DropdownItem>
                <DropdownItem>The Last of Us Part II</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
