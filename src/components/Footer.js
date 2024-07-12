import React from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faWhatsapp,
  faXTwitter,
  faFacebookF,
} from "@fortawesome/free-brands-svg-icons";
import logo from "../images/logo.png";
import "../css/Footer.css";

const Footer = () => {
  return (
    <>
      <footer>
        <div className="footer-1 py-4 text-light">
          <div className="container">
            <div className="row">
              <div className="col-12 col-lg-5 mb-4">
                <a className="navbar-brand">
                  <img
                    src={logo}
                    alt="Mebelin Furniture Logo"
                    style={{
                      width: "100px",
                      height: "auto",
                      marginBottom: "10px",
                    }}
                  />
                  <span style={{ display: "block", marginTop: "10px" }}>
                    <b>Mebelin Furniture</b>
                  </span>
                </a>
                <p
                  style={{
                    marginTop: "8px",
                    fontSize: "16px",
                    marginBottom: "15px",
                  }}
                >
                  <i>&quot;Sentuhan Indah untuk Rumah Anda.&quot; </i>
                </p>
                <p
                  style={{
                    marginTop: "8px",
                    fontSize: "16px",
                    marginBottom: "15px",
                  }}
                >
                  Toko furnitur terpercaya dengan pilihan
                  <br />
                  lengkap untuk setiap ruang dalam
                  <br />
                  rumah Anda.
                </p>
              </div>

              <div className="col-12 col-md-4 mb-4">
                <p className="h6 lh-p mb-3 font-weight-bold">PAGES</p>
                <ul className="footer mb-0 list-unstyled">
                  <li>
                    <HashLink to="/#" className="nav-link">
                      Home
                    </HashLink>
                  </li>
                  <li>
                    <HashLink to="/#hero" className="nav-link">
                      Tentang Kami
                    </HashLink>
                  </li>
                  <li>
                    <Link to="/all-products" className="nav-link">
                      Produk
                    </Link>
                  </li>
                  <li>
                    <HashLink to="/#faq" className="nav-link">
                      FAQS
                    </HashLink>
                  </li>
                </ul>
              </div>
              <div className="col-12 col-md-3">
                <ul className="mb-0 list-unstyled">
                  <div className="row mb-5">
                    <div className="col-12">
                      <h4 className="h6 text-wrapper mb-3 font-weight-bold">
                        CONTACT US
                      </h4>
                      <li className="p-0 mt-0">
                        <ul className="list-unstyled">
                          <li className="d-inline me-3">
                            <a
                              className="text-light link-nodecor"
                              target="_blank"
                              href="#"
                            >
                              <FontAwesomeIcon icon={faXTwitter} size="xl" />
                            </a>
                          </li>
                          <li className="d-inline me-3">
                            <a
                              className="text-light link-nodecor"
                              target="_blank"
                              href="#"
                            >
                              <FontAwesomeIcon icon={faFacebookF} size="xl" />
                            </a>
                          </li>
                          <li className="d-inline me-3">
                            <a
                              className="text-light link-nodecor"
                              target="_blank"
                              href="#"
                            >
                              <FontAwesomeIcon icon={faInstagram} size="xl" />
                            </a>
                          </li>
                          <li className="d-inline me-3">
                            <a
                              className="text-light link-nodecor"
                              target="_blank"
                              href="#"
                            >
                              <FontAwesomeIcon icon={faWhatsapp} size="xl" />
                            </a>
                          </li>
                        </ul>
                      </li>
                    </div>
                  </div>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-2 py-3 text-light privacy">
          <p className="text-center px-5 mb-0 d-flex flex-column flex-sm-row justify-content-center">
            <span className="mb-1 mb-sm-0">
              © 2024 Mebelin Furniture. All Rights Reserved.
            </span>
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
