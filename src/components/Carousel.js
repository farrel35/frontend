import React from "react";
import image1 from "../images/secbaru.png";
import "../css/Carousel.css";

const Carousel = () => {
  return (
    <div
      id="carouselExampleIndicators"
      className="carousel slide"
      data-bs-ride="carousel"
    >
      <div className="carousel-inner">
        <div
          className="carousel-item active"
          style={{ backgroundImage: `url(${image1})` }}
        >
          <div className="container">
            <div className="carousel-caption text-end">
              <h1>
                Home <span>Furniture</span>
              </h1>
              <p>Make your house comfortable</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
