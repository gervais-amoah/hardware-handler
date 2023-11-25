import React, { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Checkout from "../Checkout/Checkout";
import Home from "../Home/Home";
import Navbar from "../Navbar/Navbar";
import ProductForm from "../ProductForm/ProductForm";
import ProductList from "../ProductList/ProductList";
import "./App.css";
import { useCheckout } from "../../hooks/useCheckout";

function App() {
  const [checkoutUpdated, setCheckoutUpdated] = useState(false);

  const { checkoutCount } = useCheckout(checkoutUpdated);

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
        <Navbar checkoutCount={checkoutCount} />
        <article className="app-container">
          <Routes>
            <Route exact="true" path="/" element={<Home />} />
            <Route
              path="/my-products"
              element={
                <ProductList updateCheckoutCount={updateCheckoutCount} />
              }
            />

            <Route
              exact="true"
              path="/new-product-form"
              element={<ProductForm />}
            />
            <Route
              exact="true"
              path="/checkout"
              element={<Checkout updateCheckoutCount={updateCheckoutCount} />}
            />
          </Routes>
        </article>
      </section>
    </Router>
  );
}

export default App;
