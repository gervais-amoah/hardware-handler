import { createContext } from "react";

export const CheckoutItemsContext = createContext({
  error: null,
  checkoutItems: [],
  checkoutCount: 0,
  setCheckoutItems: () => {},
  updateCheckoutCount: () => {},
});
