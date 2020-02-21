const footerStyle = {
  position: "absolute",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "50px",
  padding: "0.5rem 1rem",
  bottom: 0,
  borderTop: "1px solid #ccc"
}

const Footer = () => {
  return (
    <div style={footerStyle} className="page-footer font-small footer-wrapper">
      <div className="footer-copyright text-white">&copy; {new Date().getFullYear()} - Desarrollado por Jesús Guzmán</div>
    </div>
  );
}

export default Footer;
