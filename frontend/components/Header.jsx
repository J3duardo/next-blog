import React, { useState, useEffect } from "react";
import Link from "next/link";
import Router from "next/router";
import {isAuth, signout} from "../actions/auth";
import NProgress from "nprogress";
// import "../node_modules/nprogress/nprogress.css";
import SearchBlogs from "./blog/SearchBlogs";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from "reactstrap";

// Mostrar barra de progreso al cambiar de página
Router.onRouteChangeStart = (url) => NProgress.start();
Router.onRouteChangeComplete = (url) => NProgress.done();
Router.onRouteChangeError = (url) => NProgress.done();
NProgress.configure({ showSpinner: false });

const Header = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [auth, setAuth] = useState(false);
  const [role, setRole] = useState(null);
  const [appName, setAppName] = useState(process.env.APP_NAME)

  useEffect(() => {
    setAppName(process.env.APP_NAME);

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
            <span>{appName}</span>
          </NavbarBrand>
        </Link>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          {!auth ?
            <React.Fragment>
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <Link href="/blogs">
                    <NavLink>
                      Blogs
                    </NavLink>
                  </Link>
                </NavItem>
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
                <NavItem>
                  <Link href="/contact">
                    <NavLink>
                      Contactar
                    </NavLink>
                  </Link>
                </NavItem>
              </Nav>
            </React.Fragment>
            :
            auth && role === "user" ?
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <Link href="/blogs">
                    <NavLink>
                      Blogs
                    </NavLink>
                  </Link>
                </NavItem>
                <NavItem>
                  <Link href="/user/create/blog">
                    <NavLink>
                      Crear Blog
                    </NavLink>
                  </Link>
                </NavItem>
                <NavItem>
                  <Link href="/user">
                    <NavLink>
                      Dashboard
                    </NavLink>
                  </Link>
                </NavItem>
                <NavItem>
                  <Link href="/contact">
                    <NavLink>
                      Contactar
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
                <Link href="/blogs">
                  <NavLink>
                    Blogs
                  </NavLink>
                </Link>
              </NavItem>
              <NavItem>
                <Link href="/user/create/blog">
                  <NavLink>
                    Crear Blog
                  </NavLink>
                </Link>
              </NavItem>
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
              <NavItem>
                <Link href="/contact">
                  <NavLink>
                    Contactar
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
      <SearchBlogs />
    </div>
  );
}

export default Header;