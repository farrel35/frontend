import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSackDollar,
  faThumbsUp,
  faHandshake,
  faMedal,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import "../css/Body.css";
import heroImage from "../images/baru.png";
import banner1 from "../images/design1.png";
import banner2 from "../images/design2.png";
import AOS from "aos";
import "aos/dist/aos.css";
import { fetchProducts, fetchCategories } from "./HandleAPI_User";

const Body = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage] = useState(1);
  const productsPerPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await fetchProducts();
        const categoriesData = await fetchCategories();
        // console.log(categoriesData);
        const mergedProducts = productsData.map((product) => {
          const category = categoriesData.find(
            (cat) => cat.id_category === product.id_category
          );
          return {
            ...product,
            category_name: category ? category.category_name : "Unknown",
          };
        });

        setProducts(mergedProducts);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data product & category", error);
      }
    };

    AOS.init({
      duration: 1000,
      once: false,
    });

    fetchData();
  }, []);

  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });

  if (!products) {
    return;
  }

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  return (
    <>
      <div>
        <div className="container">
          {/* Bagian Why Choose Us */}
          <section id="why-choose-us" className="why-choose-us-section">
            <h2>
              <span>Layanan</span> Kami
            </h2>
            <div className="row g-4 row-cols-1 row-cols-md-2 row-cols-lg-4">
              <div className="col" data-aos="fade-up">
                <div className="card why-choose-us-card card-transition">
                  <div className="icon-wrapper mt-3">
                    <FontAwesomeIcon
                      icon={faMedal}
                      size="2x"
                      className="icon"
                    />
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">Kualitas</h5>
                    <p className="card-text">
                      Kami menyediakan produk berkualitas tinggi.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col" data-aos="fade-up" data-aos-delay="100">
                <div className="card why-choose-us-card card-transition">
                  <div className="icon-wrapper mt-3">
                    <FontAwesomeIcon
                      icon={faHandshake}
                      size="2x"
                      className="icon"
                    />
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">Pelayanan</h5>
                    <p className="card-text">
                      Memberikan layanan pelanggan yang terbaik.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col" data-aos="fade-up" data-aos-delay="200">
                <div className="card why-choose-us-card card-transition">
                  <div className="icon-wrapper mt-3">
                    <FontAwesomeIcon
                      icon={faThumbsUp}
                      size="2x"
                      className="icon"
                    />
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">Variasi</h5>
                    <p className="card-text">
                      Berbagai pilihan yang sesuai dengan kebutuhan Anda.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col" data-aos="fade-up" data-aos-delay="300">
                <div className="card why-choose-us-card card-transition">
                  <div className="icon-wrapper mt-3">
                    <FontAwesomeIcon
                      icon={faSackDollar}
                      size="2x"
                      className="icon"
                    />
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">Harga Terjangkau</h5>
                    <p className="card-text">
                      Dapatkan produk hebat dengan harga terjangkau.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <section id="hero" className="hero p-5">
          <div className="hero-image" data-aos="zoom-in-up">
            <img src={heroImage} alt="why chose us" />
          </div>
          <div className="hero-content " data-aos="zoom-in-down">
            <h2>
              {" "}
              <span>Kualitas Terbaik </span> untuk Kebutuhan Furnitur Anda
            </h2>
            <p>
              {" "}
              Kami mengutamakan kualitas dalam setiap produk furnitur kami.
              Berikut adalah keunggulan produk kami dalam memenuhi kebutuhan
              ruang Anda.
            </p>
            <ul className="hero-features">
              <li>
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  style={{ color: "#294b29" }}
                />{" "}
                Desain Elegan dan Berkualitas Terbaik
              </li>
              <li>
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  style={{ color: "#294b29" }}
                />{" "}
                Bahan Baku Berkualitas Tinggi dan Ramah Lingkungan
              </li>
              <li>
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  style={{ color: "#294b29" }}
                />{" "}
                Jaminan Kepuasan Pelanggan Sepenuhnya
              </li>
            </ul>
            <Link to="/all-products" className="btn btn-hero">
              Belanja Sekarang
            </Link>
          </div>
        </section>
        <div className="container">
          <section id="banner">
            <div className="row mt-5 mb-5">
              <div className="col-12 col-md-6 mb-3 mb-lg-0">
                <div
                  className="py-5 px-3 rounded"
                  style={{
                    background: `url(${banner1}) no-repeat`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div>
                    <h3 className="fw-bold mb-1">Sofa</h3>
                    {/* <p className="mb-4">
                      Get Upto
                      <span className="fw-bold">30%</span>
                      Off
                    </p> */}
                    <Link to="/all-products" className="btn btn-dark mt-4">
                      Shop Now
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6 mb-3 mb-lg-0">
                <div
                  className="py-5 px-3 rounded"
                  style={{
                    background: `url(${banner2}) no-repeat`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div>
                    <h3 className="fw-bold mb-1">Meja &amp; Kursi</h3>
                    {/* <p className="mb-4">
                      Get Upto
                      <span className="fw-bold">30%</span>
                      Off
                    </p> */}
                    <Link to="/all-products" className="btn btn-dark mt-4">
                      Shop Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Bagian Kategori */}
          <section id="category">
            {/* <hr /> */}
            <h1 className="h1-center">Kategori</h1>
            <div className="row g-4 row-cols-1 row-cols-md-3 row-cols-lg-4">
              {categories.map((category) => (
                <Link
                  to={`/category/${category.category_name}`}
                  className="text-decoration-none text-inherit"
                  key={category.id_category}
                >
                  <div className="col">
                    <div className="card card-product mb-lg-4">
                      <div className="card-body text-center py-8">
                        <img
                          src={`http://localhost:4000${category.image}`}
                          alt="Category"
                          className="mb-3 img-fluid card-img-top"
                        />
                        <div className="text-truncate">
                          {category.category_name}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {/* <hr /> */}
          </section>

          {/* Bagian Our Products */}
          <section id="our-products" className="our-products-section">
            <div className="our-products-header">
              <h1 className="h1-product">Produk Kami</h1>

              <Link to="/all-products" className="view-products-link">
                Lihat Semua Produk →
              </Link>
            </div>
            <div className="row g-4 row-cols-1 row-cols-md-3 row-cols-lg-4">
              {currentProducts.map((product) => (
                <div className="col" key={product.id_product}>
                  <Link
                    to={`/product/${product.id_product}`}
                    className="text-decoration-none"
                  >
                    <div className="card card-product">
                      <div className="card-body">
                        <div className="text-center position-relative">
                          <img
                            src={`http://localhost:4000${product.image}`}
                            alt="Product"
                            className="mb-3 img-fluid card-img-top"
                          />
                        </div>
                        <div className="text-small mb-1">
                          <Link
                            to={`/category/${product.category_name}`}
                            className="text-decoration-none text-muted"
                          >
                            <small>{product.category_name}</small>
                          </Link>
                        </div>
                        <h5 className="card-title fs-6">
                          {product.product_name}
                        </h5>

                        <div className="d-flex justify-content-between align-items-center mt-3">
                          <div>
                            <span className="text-dark">
                              {formatter.format(product.price)}
                            </span>
                          </div>
                          <div></div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Bagian FAQ */}
        <div className="container">
          <section id="faq" className="faq-section" data-aos="fade-up">
            <h1 className="faq-heading">
              Frequently Asked <span className="highlight-text">Question</span>
            </h1>
            <h5 className="faq-subheading">
              Berikut adalah beberapa pertanya terkait Mebelin Furniture
            </h5>
            <div className="faq-grid">
              <div className="accordion" id="faqAccordion">
                <div className="accordion-item" data-aos="flip-up">
                  <h2 className="accordion-header" id="headingOne">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseOne"
                      aria-expanded="true"
                      aria-controls="collapseOne"
                    >
                      Apa jenis bahan yang digunakan untuk produk furniture?
                    </button>
                  </h2>
                  <div
                    id="collapseOne"
                    className="accordion-collapse collapse show"
                    aria-labelledby="headingOne"
                    data-bs-parent="#faqAccordion"
                  >
                    <div className="accordion-body">
                      Kami menggunakan berbagai jenis bahan berkualitas tinggi
                      termasuk kayu solid, kayu lapis, MDF, dan bahan ramah
                      lingkungan lainnya untuk memastikan daya tahan dan
                      keindahan produk.
                    </div>
                  </div>
                </div>
                <div className="accordion-item" data-aos="flip-up">
                  <h2 className="accordion-header" id="headingTwo">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseTwo"
                      aria-expanded="false"
                      aria-controls="collapseTwo"
                    >
                      Apa saja jenis furniture yang Anda jual?
                    </button>
                  </h2>
                  <div
                    id="collapseTwo"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingTwo"
                    data-bs-parent="#faqAccordion"
                  >
                    <div className="accordion-body">
                      Kami menjual berbagai macam furniture untuk semua ruangan
                      di rumah Anda
                    </div>
                  </div>
                </div>
              </div>
              <div className="accordion" id="faqAccordion2">
                <div className="accordion-item" data-aos="flip-up">
                  <h2 className="accordion-header" id="headingThree">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseThree"
                      aria-expanded="false"
                      aria-controls="collapseThree"
                    >
                      Bagaimana cara merawat produk furniture?
                    </button>
                  </h2>
                  <div
                    id="collapseThree"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingThree"
                    data-bs-parent="#faqAccordion2"
                  >
                    <div className="accordion-body">
                      Untuk menjaga keindahan dan keawetan furniture, kami
                      menyarankan untuk membersihkannya dengan kain lembut dan
                      kering secara teratur dan menghindari penggunaan bahan
                      kimia keras. Kami juga menyediakan panduan perawatan
                      spesifik untuk setiap produk.
                    </div>
                  </div>
                </div>
                <div className="accordion-item" data-aos="flip-up">
                  <h2 className="accordion-header" id="headingFour">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseFour"
                      aria-expanded="false"
                      aria-controls="collapseFour"
                    >
                      Apakah Anda menawarkan layanan pengiriman?
                    </button>
                  </h2>
                  <div
                    id="collapseFour"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingFour"
                    data-bs-parent="#faqAccordion2"
                  >
                    <div className="accordion-body">
                      Ya, kami menawarkan layanan pengiriman ke seluruh
                      Indonesia dengan biaya yang bervariasi tergantung lokasi.
                      Kami juga menawarkan pengiriman gratis untuk pesanan di
                      atas jumlah tertentu.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Body;
