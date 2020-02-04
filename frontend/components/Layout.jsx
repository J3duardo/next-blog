import Header from "./Header";

const Layout = (props) => {
  return (
    <React.Fragment>
      <Header />
        {props.children}
      <p>Footer</p>
    </React.Fragment>
  );
}

export default Layout;
