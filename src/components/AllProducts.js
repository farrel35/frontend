import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BackToTopButton from "./BackToTopButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import "../css/AllProduct.css";
import {
  fetchProducts,
  fetchAllProducts,
  fetchCategories,
  addToCart,
} from "./HandleAPI_User";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(15);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await fetchProducts();
        const categoriesData = await fetchCategories();

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

    fetchData();
  }, []);

  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    try {
      const productsData = await fetchAllProducts(category);
      const mergedProducts = productsData.map((product) => {
        const category = categories.find(
          (cat) => cat.id_category === product.id_category
        );
        return {
          ...product,
          category_name: category ? category.category_name : "Unknown",
        };
      });
      setProducts(mergedProducts);
    } catch (error) {
      setProducts([]);
    }
  };

  if (!products) {
    return;
  }

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(products.length / productsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <Navbar />
      <div className="container-allproduct">
        <div className="row align-items-start">
          <div className="col-12">
            <h1 className="my-4">Semua Produk</h1>
          </div>
          <div className="col-md-2">
            <div className="card-category">
              <div className="card-header">Kategori</div>
              <ul className="list-group list-group-flush">
                <li
                  className={`list-group-item ${
                    selectedCategory === "" ? "active" : ""
                  }`}
                  onClick={() => handleCategoryClick("")}
                >
                  Semua Produk
                </li>
                {categories.map((category) => (
                  <li
                    key={category.id_category}
                    className={`list-group-item ${
                      selectedCategory === category.category_name
                        ? "active"
                        : ""
                    }`}
                    onClick={() => handleCategoryClick(category.category_name)}
                  >
                    {category.category_name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="col-md-10">
            <section id="all-products" className="all-products-section">
              <div id="our-products" className="our-products-section">
                <div className="row g-4 row-cols-1 row-cols-md-2 row-cols-lg-5">
                  {currentProducts.length === 0 ? (
                    <p>Tidak ada produk di Kategori {selectedCategory}</p>
                  ) : (
                    currentProducts.map((product) => (
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
                    ))
                  )}
                </div>
              </div>
              <nav>
                <ul className="pagination mt-5">
                  {pageNumbers.map((number) => (
                    <li key={number} className="page-item">
                      <a
                        onClick={() => paginate(number)}
                        href="#!"
                        className="page-link"
                      >
                        {number}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </section>
          </div>
        </div>
      </div>
      <Footer />
      <BackToTopButton />
    </>
  );
};

export default AllProducts;
