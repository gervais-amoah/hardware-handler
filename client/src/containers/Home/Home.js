import {
  faPlus,
  faShoppingCart,
  faToolbox,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div>
      <h1 className="home-title">Welcome to Hardware Handler!</h1>
      <span className="home-links-wrapper">
        <Link className="home-link" to="/my-products">
          <FontAwesomeIcon className="home-icon" icon={faToolbox} />
          <h2>My Products</h2>
        </Link>
        <Link className="home-link" to="/new-product-form">
          <FontAwesomeIcon className="home-icon" icon={faPlus} />
          <h2>Add New Products</h2>
        </Link>
        <Link className="home-link" to="/checkout">
          <FontAwesomeIcon className="home-icon" icon={faShoppingCart} />
          <h2>Checkout</h2>
        </Link>
      </span>
    </div>
  );
}

export default Home;
