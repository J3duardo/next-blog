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
  a
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
      <div className="navbar-wrapper">
        <Navbar expand="md">
          <Link href="/">
            <NavbarBrand>
              <span className="text-white font-weight-bold">{appName}</span>
            </NavbarBrand>
          </Link>
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            {!auth ?
              <React.Fragment>
                <Nav className="ml-auto" navbar>
                  <NavItem>
                    <Link href="/blogs">
                      <a className="btn btn-generic mr-2">
                        Blogs
                      </a>
                    </Link>
                  </NavItem>
                  <NavItem>
                    <Link href="/contact">
                      <a className="btn btn-generic mr-2">
                        Contáctanos
                      </a>
                    </Link>
                  </NavItem>
                  <NavItem>
                    <Link href="/login">
                      <a className="btn btn-generic mr-2">
                        Iniciar sesión
                      </a>
                    </Link>
                  </NavItem>
                  <NavItem>
                    <Link href="/signup">
                      <a className="btn btn-action">
                        Registrarse
                      </a>
                    </Link>
                  </NavItem>
                </Nav>
              </React.Fragment>
              :
              auth && role === "user" ?
                <Nav className="ml-auto" navbar>
                  <NavItem>
                    <Link href="/blogs">
                      <a className="btn btn-generic mr-2">
                        Blogs
                      </a>
                    </Link>
                  </NavItem>
                  <NavItem>
                    <Link href="/user/create/blog">
                      <a className="btn btn-action mr-2">
                        Crear Blog
                      </a>
                    </Link>
                  </NavItem>
                  <NavItem>
                    <Link href="/user">
                      <a className="btn btn-generic mr-2">
                        Dashboard
                      </a>
                    </Link>
                  </NavItem>
                  <NavItem>
                    <Link href="/contact">
                      <a className="btn btn-generic mr-2">
                        Contactar
                      </a>
                    </Link>
                  </NavItem>
                  <button
                    className="btn btn-generic ml-auto"
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
                    <a className="btn btn-generic mr-2">
                      Blogs
                    </a>
                  </Link>
                </NavItem>
                <NavItem>
                  <Link href="/user/create/blog">
                    <a className="btn btn-action mr-2">
                      Crear Blog
                    </a>
                  </Link>
                </NavItem>
                <NavItem>
                  <Link href="/user">
                    <a className="btn btn-generic mr-2">
                      Dashboard
                    </a>
                  </Link>
                </NavItem>
                <NavItem>
                  <Link href="/admin">
                    <a className="btn btn-generic mr-2">
                      Administrar
                    </a>
                  </Link>
                </NavItem>
                <NavItem>
                  <Link href="/contact">
                    <a className="btn btn-generic mr-2">
                      Contáctanos
                    </a>
                  </Link>
                </NavItem>
                <button
                  className="btn btn-generic"
                  onClick={signoutHandler}
                >
                  Cerrar sesión
                </button>
              </Nav>
            }
          </Collapse>
        </Navbar>
      </div>
      <SearchBlogs />
    </div>
  );
}

export default Header;