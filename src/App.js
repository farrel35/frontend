import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";
import Navbar from "./components/Navbar";
import Carousel from "./components/Carousel";
import Body from "./components/Body";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Register from "./components/Register";
import Cart from "./components/Cart";
import ProductDetail from "./components/ProductDetail";
import ProductByCategory from "./components/ProductByCategory";
import AllProducts from "./components/AllProducts";
import BackToTopButton from "./components/BackToTopButton";
import Profile from "./components/Profile";
import AdminDashboard from "./components/Admin/AdminDashboard";
import Order from "./components/Order";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/all-products/" element={<AllProducts />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/category/:category" element={<ProductByCategory />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/order" element={<Order />} />
      </Routes>
    </Router>
  );
};

const Home = () => (
  <>
    <Navbar />
    <Carousel />
    <Body />
    <Footer />
    <BackToTopButton />
  </>
);

export default App;
