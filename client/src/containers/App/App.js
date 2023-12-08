import React, { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CheckoutItemsContext } from "../../context/CheckoutItemsContext";
import { useCheckout } from "../../hooks/useCheckout";
import Checkout from "../Checkout/Checkout";
import Home from "../Home/Home";
import Navbar from "../Navbar/Navbar";
import ProductForm from "../ProductForm/ProductForm";
import ProductList from "../ProductList/ProductList";
import "./App.css";

function App() {
  const [checkoutUpdated, setCheckoutUpdated] = useState(false);

  const { error, checkoutItems, checkoutCount, setCheckoutItems } =
    useCheckout(checkoutUpdated);

  useEffect(() => {
    if (checkoutCount) setCheckoutUpdated(false);
  }, [checkoutCount]);

  async function updateCheckoutCount() {
    setCheckoutUpdated(true);
  }

  return (
    <Router>
      <ToastContainer />
      <section className="app-wrapper">
        <CheckoutItemsContext.Provider
          value={{
            error,
            checkoutItems,
            checkoutCount,
            setCheckoutItems,
            updateCheckoutCount,
          }}
        >
          <Navbar />
          <article className="app-container">
            <Routes>
              <Route exact="true" path="/" element={<Home />} />
              <Route path="/my-products" element={<ProductList />} />

              <Route
                exact="true"
                path="/new-product-form"
                element={<ProductForm />}
              />
              <Route exact="true" path="/checkout" element={<Checkout />} />
            </Routes>
          </article>
        </CheckoutItemsContext.Provider>
      </section>
    </Router>
  );
}

export default App;
