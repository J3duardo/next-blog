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
  const [role, setRole] = useState(null)

  useEffect(() => {
    if(isAuth() && JSON.parse(isAuth()).role === 0) {
      setAuth(true);
      setRole("user");
    } else if(isAuth() && JSON.parse(isAuth()).role === 1) {
      setAuth(true);
      setRole("admin")
    }
  }, []);

  const signoutHandler = async () => {
    await signout();
    setAuth(false);
    setRole(null)
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
            auth && role === "user" ?
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <Link href="/user">
                    <NavLink>
                      Dashboard
                    </NavLink>
                  </Link>
                </NavItem>
                <button
                  className="btn btn-primary ml-auto"
                  onClick={signoutHandler}
                >
                  Cerrar sesión
                </button>                
              </Nav>
            :
            auth && role === "admin" &&
            <Nav className="ml-auto" navbar>
              <NavItem>
                <Link href="/user">
                  <NavLink>
                    Dashboard
                  </NavLink>
                </Link>
              </NavItem>
              <NavItem>
                <Link href="/admin">
                  <NavLink>
                    Administrar
                  </NavLink>
                </Link>
              </NavItem>
              <button
                className="btn btn-primary ml-auto"
                onClick={signoutHandler}
              >
                Cerrar sesión
              </button>
            </Nav>
          }
        </Collapse>
      </Navbar>
    </div>
  );
}

export default Header;