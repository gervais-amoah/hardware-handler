import { faShoppingCart, faTools } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { CheckoutItemsContext } from "../../context/CheckoutItemsContext";
import "./Navbar.css";

const Navbar = () => {
  const checkoutItemsContext = useContext(CheckoutItemsContext);

  return (
    <nav className="navbar">
      <div className="navbar-home-link">
        <NavLink exact="true" to="/">
          Hardware Handler
          <FontAwesomeIcon className="navbar-icon" icon={faTools} />
        </NavLink>
      </div>
      <span className="navbar-links-wrapper">
        <NavLink exact="true" to="/my-products">
          My Products
        </NavLink>
        <NavLink exact="true" to="/new-product-form">
          Add New Products
        </NavLink>
        <NavLink className="navbar-link" exact="true" to="/checkout">
          Checkout
          <FontAwesomeIcon className="navbar-icon" icon={faShoppingCart} />
          {checkoutItemsContext.checkoutCount > 0 ? (
            <p className="navbar-checkout-count">
              : {checkoutItemsContext.checkoutCount}
            </p>
          ) : null}
        </NavLink>
      </span>
    </nav>
  );
};

export default Navbar;
