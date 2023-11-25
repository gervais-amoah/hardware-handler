import { createContext } from "react";

export const CheckoutFunctionContext = createContext({
  addItemToCheckout: () => {},
  removeItemFromCheckout: () => {},
});
