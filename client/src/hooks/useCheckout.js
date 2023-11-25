import { useEffect, useState } from "react";
import { getAllCheckoutItems } from "../services/checkoutApi";
import { FETCH_CHECKOUT_PRODUCTS_ERROR } from "../constants/constants";

export function useCheckout() {
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCheckoutItems() {
      const allCheckoutItems = await getAllCheckoutItems();

      if (allCheckoutItems !== FETCH_CHECKOUT_PRODUCTS_ERROR) {
        setCheckoutItems(allCheckoutItems);
      } else {
        setError(FETCH_CHECKOUT_PRODUCTS_ERROR);
      }
    }

    fetchCheckoutItems();
  }, []);

  return {
    checkoutItems,
    setCheckoutItems,
    checkoutCount: checkoutItems.length,
    error,
  };
}
