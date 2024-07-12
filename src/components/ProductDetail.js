// src/components/ProductDetail.js
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BackToTopButton from "./BackToTopButton";
import "../css/ProductDetail.css";
import {
  fetchProductsByCategory,
  fetchImageProducts,
  fetchProductDetail,
  fetchCategories,
} from "./HandleAPI_User";
import { addToCart } from "./HandleAPI_User";
import Swal from "sweetalert2";
import ReactImageMagnify from "react-image-magnify";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const [primaryImage, setPrimaryImage] = useState("");
  const [availableProducts, setAvailableProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4;
  const totalPages = Math.ceil(availableProducts.length / productsPerPage);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productDetail = await fetchProductDetail(id);
        const categoriesData = await fetchCategories();

        const mergedProduct = (product) => {
          const category = categoriesData.find(
            (cat) => cat.id_category === product.id_category
          );
          return {
            ...product,
            category_name: category ? category.category_name : "Unknown",
          };
        };

        const mergedProductDetail = mergedProduct(productDetail);
        const productsData = await fetchProductsByCategory(
          mergedProductDetail.category_name
        );
        const imagesData = await fetchImageProducts(productDetail.id_product);

        setProduct(mergedProductDetail);
        setAvailableProducts(productsData);
        setProductImages(imagesData);
        const mainImageUrl = `http://localhost:4000${productDetail.image}`;
        setMainImage(mainImageUrl);
        setPrimaryImage(mainImageUrl);
      } catch (error) {
        console.error("Error fetching product data", error);
      }
    };

    fetchData();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const handlePageChange = (action) => {
    if (action === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (action === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });

  const handleAddToCart = async (product) => {
    if (quantity > product.stock) {
      Swal.fire({
        title: "Error!",
        text: "Stok produk kosong.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    addToCart(product, quantity);
  };

  if (!product) {
    return null;
  }

  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = availableProducts.slice(startIndex, endIndex);

  return (
    <>
      <Navbar />
      <section className="py-5">
        <div className="container px-4 px-lg-5 my-5">
          <div className="row gx-4 gx-lg-5 align-items-center">
            <div className="col-md-6">
              <div id="imageMagnifyer">
                <ReactImageMagnify
                  {...{
                    smallImage: {
                      alt: "Wristwatch by Ted Baker London",
                      isFluidWidth: true,
                      src: mainImage,
                    },
                    largeImage: {
                      src: mainImage,
                      width: 1000,
                      height: 1500,
                    },
                    isHintEnabled: true,
                  }}
                />
              </div>

              <div className="d-flex flex-wrap mt-3 justify-content-center">
                <img
                  src={primaryImage}
                  alt="Product"
                  className="img-thumbnail me-2"
                  style={{ width: "5rem", cursor: "pointer" }}
                  onClick={() => setMainImage(`${primaryImage}`)}
                />
                {productImages.map((img, index) => (
                  <img
                    key={index}
                    src={`http://localhost:4000${img.image}`}
                    alt={`Thumbnail ${index}`}
                    className="img-thumbnail me-2"
                    style={{ width: "5rem", cursor: "pointer" }}
                    onClick={() =>
                      setMainImage(`http://localhost:4000${img.image}`)
                    }
                  />
                ))}
              </div>
            </div>
            <div className="col-md-6">
              <h1 className="display-5 fw-bolder">{product.product_name}</h1>

              <div className="fs-5 mb-5">
                <h6>Stok : {product.stock}</h6>
                <span>{formatter.format(product.price)}</span>
              </div>
              <div className="product-description mb-3">
                <div
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
              <div className="d-flex">
                <input
                  className="form-control text-center me-3"
                  id="inputQuantity"
                  type="number"
                  defaultValue={1}
                  min={1}
                  max={product.stock}
                  style={{ maxWidth: "4rem" }}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                />
                <button
                  className="btn btn-outline-dark flex-shrink-0"
                  type="button"
                  onClick={() => handleAddToCart(product)}
                >
                  <i className="me-1" />
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Related items section */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="fw-bolder mb-4">Produk Serupa</h2>
          <div className="product-slider">
            <div className="slider-container">
              <button
                className="slider-button prev"
                onClick={() => handlePageChange("prev")}
                disabled={currentPage === 1}
              >
                {"<"}
              </button>
              <div className="our-products-section product-cards">
                <div className="row g-4 justify-content-center row-cols-1 row-cols-md-2 row-cols-lg-4 p-2">
                  {currentProducts
                    .filter(
                      (currentProduct) =>
                        currentProduct.id_product !== product.id_product
                    )
                    .map((currentProduct) => (
                      <div className="col" key={currentProduct.id_product}>
                        <Link
                          to={`/product/${currentProduct.id_product}`}
                          className="text-decoration-none"
                        >
                          <div className="card card-product">
                            <div className="card-body">
                              <div className="text-center position-relative">
                                <img
                                  src={`http://localhost:4000${currentProduct.image}`}
                                  alt="Product"
                                  className="mb-3 img-fluid card-img-top"
                                />
                              </div>
                              <div className="text-small mb-1">
                                <Link
                                  to={`/category/${currentProduct.category_name}`}
                                  className="text-decoration-none text-muted"
                                >
                                  <small>{currentProduct.category_name}</small>
                                </Link>
                              </div>
                              <h5 className="card-title fs-6">
                                {currentProduct.product_name}
                              </h5>

                              <div className="d-flex justify-content-between align-items-center mt-3">
                                <div>
                                  <span className="text-dark">
                                    {formatter.format(currentProduct.price)}
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
              </div>
              <button
                className="slider-button next"
                onClick={() => handlePageChange("next")}
                disabled={currentPage === totalPages}
              >
                {">"}
              </button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <BackToTopButton />
    </>
  );
};

export default ProductDetail;
