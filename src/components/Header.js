import { Navbar, NavbarBrand } from "reactstrap";
import NucampLogo from "../app/assets/img/logo.png";

const Header = () => {
  return (
    <div>
      <Navbar dark color="primary" sticky="top" expand="md">
        <NavbarBrand href="/">
          <img src={NucampLogo} alt="nucamp logo" />
        </NavbarBrand>
      </Navbar>
    </div>
  );
};

export default Header;
