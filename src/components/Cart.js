import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BackToTopButton from "./BackToTopButton";
import "../css/Cart.css";
import {
  fetchUserData,
  fetchProducts,
  fetchCart,
  deleteCartItem,
  updateCartQuantity,
  checkoutCart,
} from "./HandleAPI_User";
import Swal from "sweetalert2";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState("");

  const ongkir = 500000;
  const [userData, setUserData] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    name: userData.username,
    address: "",
    phoneNumber: "",
    paymentMethod: "",
  });

  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await fetchUserData();

        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    getUserData();
  }, []);

  useEffect(() => {
    const getCart = async () => {
      try {
        const cartData = await fetchCart();
        const productsData = await fetchProducts();

        if (!cartData) {
          return;
        }
        const mergedCartItems = cartData.map((cartItem) => {
          const product = productsData.find(
            (product) => product.id_product === cartItem.id_product
          );
          return {
            ...cartItem,
            ...product,
          };
        });

        setCartItems(mergedCartItems);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    getCart();
  }, []);

  useEffect(() => {
    if (userData) {
      setShippingInfo({
        name: userData.username || "",
        address: userData.alamat || "",
        phoneNumber: userData.no_hp || "",
        paymentMethod: "",
      });
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure shippingInfo is defined and has necessary properties
    if (
      !shippingInfo ||
      !shippingInfo.name ||
      !shippingInfo.phoneNumber ||
      !shippingInfo.address
    ) {
      setError("Shipping information is incomplete.");
      return;
    }

    // Check if any item has an invalid quantity
    for (const item of cartItems) {
      if (item.quantity > item.stock) {
        setError(`Stok ${item.product_name} tinggal ${item.stock}.`);
        return;
      }
    }

    const formData = new FormData();
    formData.append("nama_penerima", shippingInfo.name);
    formData.append("tlp_penerima", shippingInfo.phoneNumber);
    formData.append("alamat_penerima", shippingInfo.address);
    formData.append("ongkir", ongkir);
    formData.append("grand_total", total);
    formData.append("total_bayar", parseFloat(total) + ongkir);

    try {
      await checkoutCart(cartItems, formData);
    } catch (error) {
      console.error("Failed to place order:", error);
      setError("Failed to place order. Please try again.");
    }
  };

  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });

  const total = cartItems
    .reduce((acc, item) => acc + item.quantity * parseFloat(item.price), 0)
    .toFixed(2);

  const increaseQuantity = async (id_product) => {
    const itemToUpdate = cartItems.find(
      (item) => item.id_product === id_product
    );
    if (!itemToUpdate) return;

    if (itemToUpdate.quantity >= itemToUpdate.stock) {
      Swal.fire({
        title: "Error!",
        text: "Tidak bisa menambah barang.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
    const updatedCartItems = cartItems.map((item) =>
      item.id_product === id_product && item.quantity < item.stock // Assuming there's a 'stock' property for each item
        ? {
            ...item,
            quantity: item.quantity + 1,
            totalPrice: item.totalPrice + parseFloat(item.price),
          }
        : item
    );

    setCartItems(updatedCartItems);

    try {
      const itemToUpdate = updatedCartItems.find(
        (item) => item.id_product === id_product
      );
      if (itemToUpdate) {
        await updateCartQuantity(itemToUpdate.id_cart, itemToUpdate.quantity);
      }
    } catch (error) {
      console.error("Failed to update cart quantity:", error);
      // Handle error as needed, e.g., revert UI changes
    }
  };

  const decreaseQuantity = async (id_product) => {
    const updatedCartItems = cartItems.map((item) =>
      item.id_product === id_product && item.quantity > 1
        ? {
            ...item,
            quantity: item.quantity - 1,
            totalPrice: item.totalPrice - parseFloat(item.price),
          }
        : item
    );

    setCartItems(updatedCartItems);

    try {
      const itemToUpdate = updatedCartItems.find(
        (item) => item.id_product === id_product
      );
      if (itemToUpdate) {
        await updateCartQuantity(itemToUpdate.id_cart, itemToUpdate.quantity);
      }
    } catch (error) {
      console.error("Failed to update cart quantity:", error);
      // Handle error as needed, e.g., revert UI changes
    }
  };

  const handleDeleteCartItem = (id_cart) => {
    deleteCartItem(id_cart);
  };

  const renderItems = () => {
    return cartItems.map((item) => (
      <div key={item.id_cart} className="cart-card mb-3">
        <div className="row justify-content-between align-items-center mb-3">
          <div className="col-8 d-flex align-items-center">
            <Link to={`/product/${item.id_product}`}>
              <img
                src={`http://localhost:4000${item.image}`}
                className="img-fluid rounded-3"
                alt="Shopping item"
                style={{ width: "75px" }}
              />
            </Link>
            <div className="ms-3">
              <Link
                to={`/product/${item.id_product}`}
                className="text-dark text-decoration-none"
              >
                <h5 className="cart-item-title">{item.product_name}</h5>
              </Link>

              <p className="small mb-0">Quantity: {item.quantity}</p>
            </div>
          </div>
          <div className="col-3 d-flex justify-content-center align-items-center">
            <div className="d-flex">
              <button
                onClick={() => decreaseQuantity(item.id_product)}
                className="btn btn-danger btn-sm"
              >
                -
              </button>
              <button
                onClick={() => increaseQuantity(item.id_product)}
                className="btn btn-primary btn-sm ms-2"
              >
                +
              </button>
            </div>
          </div>
          <div className="col-1 d-flex justify-content-end align-items-center">
            <a
              href="#!"
              className="ms-3 text-danger"
              onClick={() => handleDeleteCartItem(item.id_cart)}
            >
              <i className="fas fa-trash-alt"></i>
            </a>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <>
      <Navbar />
      <div className="container py-5 h-100 mt-5 cart-container">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col">
            <div className="cart-card">
              <div className="row">
                <div className="col-lg-7">
                  <h5 className="mb-3">
                    <Link to="/" className="cart-text-body cart-a-none">
                      <i className="fas fa-long-arrow-alt-left me-2"></i>
                      Continue shopping
                    </Link>
                  </h5>
                  <hr />

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                      <p className="mb-1">Shopping cart</p>
                      <p className="mb-0">
                        You have {cartItems.length} items in your cart
                      </p>
                    </div>
                  </div>

                  {renderItems()}
                </div>

                <div className="col-lg-5">
                  <div className="cart-card cart-bg-green text-white rounded-3 cart-sticky-shipping">
                    <div className="cart-card-body">
                      {error && (
                        <div className="alert alert-danger">{error}</div>
                      )}
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="mb-0">Shipping Details</h5>
                      </div>

                      <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Nama Penerima"
                            name="name"
                            value={shippingInfo.name}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="mb-3">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Alamat Penerima"
                            name="address"
                            value={shippingInfo.address}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="mb-3">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="No Penerima"
                            name="phoneNumber"
                            value={shippingInfo.phoneNumber}
                            onChange={handleInputChange}
                          />
                        </div>
                        <button
                          type="submit"
                          className="btn cart-btn-success btn-block"
                        >
                          Checkout
                        </button>
                      </form>

                      <hr />

                      <div className="d-flex justify-content-between">
                        <span>Subtotal</span>
                        <span>{formatter.format(total)}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Ongkir</span>
                        <span>{formatter.format(ongkir)}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Total</span>
                        <span>
                          {formatter.format(parseFloat(total) + ongkir)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <BackToTopButton />
    </>
  );
};

export default Cart;
