import Header from "./Header";
import Footer from "./Footer";

const Layout = (props) => {
  return (
    <div style={{position: "relative", minHeight:"100vh", paddingBottom: "calc(50px + 1rem)"}}>
      <Header />
        {props.children}
      <Footer />
    </div>
  );
}

export default Layout;
