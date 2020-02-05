import {useEffect} from "react";
import Router from "next/router";
import {isAuth} from "../../actions/auth";

const Admin = (props) => {
  useEffect(() => {
    if(!isAuth()) {
      Router.push("/login")
    } else if(isAuth() && JSON.parse(isAuth()).role !== 1) {
      Router.push("/")
    }
  }, []);

  return (
    <React.Fragment>
      {props.children}
    </React.Fragment>
  )
}

export default Admin;