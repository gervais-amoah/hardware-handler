import React, { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as checkoutApi from "../../services/checkoutApi";
import Checkout from "../Checkout/Checkout";
import Home from "../Home/Home";
import Navbar from "../Navbar/Navbar";
import ProductForm from "../ProductForm/ProductForm";
import ProductList from "../ProductList/ProductList";
import "./App.css";
import { FETCH_CHECKOUT_COUNT_ERROR } from "../../constants/constants";

function App() {
  const [checkoutCount, setCheckoutCount] = useState(0);
  const [cartUpdated, setCartUpdated] = useState(false);

  useEffect(() => {
    async function fetchCheckoutItems() {
      const checkoutItemsCount = await checkoutApi.getCheckoutCount();

      if (
        Number(checkoutItemsCount) ||
        checkoutItemsCount === 0 ||
        checkoutItemsCount === FETCH_CHECKOUT_COUNT_ERROR
      ) {
        setCheckoutCount(checkoutItemsCount);
        setCartUpdated(false);
      }
    }

    fetchCheckoutItems();
  }, [cartUpdated]);

  async function updateCheckoutCount() {
    setCartUpdated(true);
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
