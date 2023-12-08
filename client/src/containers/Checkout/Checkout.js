import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import CheckoutItem from "../../components/CheckoutItem/CheckoutItem";
import Loader from "../../components/Loader/Loader";
import {
  FETCH_CHECKOUT_PRODUCTS_ERROR,
  PRODUCT_REMOVED_FROM_CHECKOUT_SUCCESS,
  REMOVE_PRODUCT_FROM_CHECKOUT_ERROR,
} from "../../constants/constants";
import { CheckoutFunctionContext } from "../../context/CheckoutFunctionContext";
import { CheckoutItemsContext } from "../../context/CheckoutItemsContext";
import * as checkoutApi from "../../services/checkoutApi";
import "./Checkout.css";

function Checkout() {
  const [loading, setLoading] = useState(true);

  const checkoutItemsContext = useContext(CheckoutItemsContext);

  useEffect(() => {
    if (checkoutItemsContext.checkoutCount > 0 || checkoutItemsContext.error)
      setLoading(false);
  }, [checkoutItemsContext.checkoutCount, checkoutItemsContext.error]);

  async function removeItemFromCheckout(id) {
    setLoading(true);

    const remainingCheckoutItems = await checkoutApi.removeProductFromCheckout(
      id
    );

    if (remainingCheckoutItems !== REMOVE_PRODUCT_FROM_CHECKOUT_ERROR) {
      checkoutItemsContext.setCheckoutItems(remainingCheckoutItems);
      checkoutItemsContext.updateCheckoutCount();
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
        {checkoutItemsContext.error && (
          <p className="checkout-message">
            {FETCH_CHECKOUT_PRODUCTS_ERROR} Please refresh the page or try again
            later.
          </p>
        )}
        {!loading & !checkoutItemsContext.error &&
          checkoutItemsContext.checkoutCount && (
            <div>
              <div className="checkout-header">
                <div>Product Information</div>
                <div>Suggested Retail Price</div>
                <div>Update Checkout</div>
              </div>
              <ul className="checkout-list-wrapper">
                <CheckoutFunctionContext.Provider
                  value={{ removeItemFromCheckout }}
                >
                  {checkoutItemsContext.checkoutItems.map((item) => (
                    <CheckoutItem key={item.id} item={item} />
                  ))}
                </CheckoutFunctionContext.Provider>
              </ul>
            </div>
          )}
        {!loading &&
          !checkoutItemsContext.error &&
          !checkoutItemsContext.checkoutCount && (
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
