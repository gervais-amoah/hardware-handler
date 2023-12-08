import { useEffect, useState } from "react";
import { getAllCheckoutItems } from "../services/checkoutApi";
import { FETCH_CHECKOUT_PRODUCTS_ERROR } from "../constants/constants";

export function useCheckout(checkoutUpdated) {
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [checkoutCount, setCheckoutCount] = useState(0);
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
  }, [checkoutUpdated]);

  useEffect(() => {
    const count = checkoutItems.length;
    if (Number(count) || count === 0) setCheckoutCount(count);
  }, [checkoutItems]);

  return {
    error,
    checkoutItems,
    checkoutCount,
    setCheckoutItems,
  };
}
