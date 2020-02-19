import Layout from "../components/Layout";
import Link from "next/link";
import ContactForm from "../components/contactForm/ContactForm";

const Contact = () => {
  return (
    <Layout>
      <div className="container-fluid">
        <div className="row mx-0">
          <div className="col-md-8 offset-md-2">
            <h2 className="mb-3">Formulario de contacto</h2>
            <hr/>
            <ContactForm />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Contact;