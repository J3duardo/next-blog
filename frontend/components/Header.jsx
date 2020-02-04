import React, { useState, useEffect } from "react";
import Link from "next/link";
import Router from "next/router";
import {APP_NAME} from "../config";
import {isAuth, signout} from "../actions/auth";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";

const Header = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    if(isAuth()) {
      setAuth(true);
    }
  }, []);

  const signoutHandler = async () => {
    await signout();
    setAuth(false);
    Router.push("/login");
  }

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className="mb-4">
      <Navbar color="light" light expand="md">
        <Link href="/">
          <NavbarBrand>
            <span>{APP_NAME}</span>
          </NavbarBrand>
        </Link>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          {!auth ?
            <React.Fragment>
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <Link href="/login">
                    <NavLink>
                      Iniciar sesión
                    </NavLink>
                  </Link>
                </NavItem>
                <NavItem>
                  <Link href="/signup">
                    <NavLink>
                      Registrarse
                    </NavLink>
                  </Link>
                </NavItem>
              </Nav>
            </React.Fragment>
            :
            <React.Fragment>
              <button
                className="btn btn-primary ml-auto"
                onClick={signoutHandler}
              >
                Cerrar sesión
              </button>
            </React.Fragment>
          }
        </Collapse>
      </Navbar>
    </div>
  );
}

export default Header;