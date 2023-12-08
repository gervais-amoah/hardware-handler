import React, { useContext } from "react";
import { CheckoutFunctionContext } from "../../context/CheckoutFunctionContext";
import { formatPrice } from "../../helpers/formatPrice";
import "./CheckoutItem.css";

const CheckoutItem = ({ item }) => {
  const { name, brand, description, retailPrice } = item;
  const checkoutFunctionContext = useContext(CheckoutFunctionContext);

  return (
    <li className="checkout-item">
      <div>
        <div className="checkout-item-wrapper">
          <div className="checkout-item-data strong">{name}</div>
          <div className="checkout-item-data">
            <span className="strong">By: </span>
            <span>{brand}</span>
          </div>
          <div className="checkout-item-wrapper">{description}</div>
        </div>
      </div>
      <div className="checkout-item-price strong">
        {formatPrice(retailPrice)}
      </div>
      <div>
        <button
          className="primary"
          onClick={() =>
            checkoutFunctionContext.removeItemFromCheckout(item.id)
          }
        >
          Remove Product from Checkout
        </button>
      </div>
    </li>
  );
};

export default CheckoutItem;
