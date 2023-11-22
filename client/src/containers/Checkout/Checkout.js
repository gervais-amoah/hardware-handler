import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import CheckoutItem from "../../components/CheckoutItem/CheckoutItem";
import Loader from "../../components/Loader/Loader";
import {
  FETCH_CHECKOUT_PRODUCTS_ERROR,
  PRODUCT_REMOVED_FROM_CHECKOUT_SUCCESS,
  REMOVE_PRODUCT_FROM_CHECKOUT_ERROR,
} from "../../constants/constants";
import * as checkoutApi from "../../services/checkoutApi";
import "./Checkout.css";

function Checkout({ updateCheckoutCount }) {
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchCheckoutItems() {
      const allCheckoutItems = await checkoutApi.getAllCheckoutItems();

      if (allCheckoutItems !== FETCH_CHECKOUT_PRODUCTS_ERROR) {
        setCheckoutItems(allCheckoutItems);
        setError(false);
      } else {
        setError(true);
      }

      setLoading(false);
    }

    fetchCheckoutItems();
  }, []);

  async function removeItemFromCheckout(id) {
    const remainingCheckoutItems = await checkoutApi.removeProductFromCheckout(
      id
    );

    if (remainingCheckoutItems !== REMOVE_PRODUCT_FROM_CHECKOUT_ERROR) {
      setCheckoutItems(remainingCheckoutItems);
      updateCheckoutCount();
      toast.success(PRODUCT_REMOVED_FROM_CHECKOUT_SUCCESS);
    } else {
      toast.error(remainingCheckoutItems);
    }

    setLoading(false);
  }

  return (
    <div>
      <h1 className="checkout-title">Checkout Page</h1>
      <div>
        {loading && <Loader message="Fetching items to checkout..." />}
        {error && (
          <p className="checkout-message">
            {FETCH_CHECKOUT_PRODUCTS_ERROR} Please refresh the page or try again
            later.
          </p>
        )}
        {!loading & !error && checkoutItems.length && (
          <div>
            <div className="checkout-header">
              <div>Product Information</div>
              <div>Suggested Retail Price</div>
              <div>Update Checkout</div>
            </div>
            <ul className="checkout-list-wrapper">
              {checkoutItems.map((item) => (
                <CheckoutItem
                  key={item.id}
                  item={item}
                  removeItemFromCheckout={removeItemFromCheckout}
                />
              ))}
            </ul>
          </div>
        )}
        {!loading && !error && !checkoutItems.length && (
          <p className="checkout-message">
            The checkout is currently empty. Add some items from the&nbsp;
            <NavLink className="page-link" to="/my-products">
              My Products
            </NavLink>
            &nbsp;page.
          </p>
        )}
      </div>
    </div>
  );
}

export default Checkout;
