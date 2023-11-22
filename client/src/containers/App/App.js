import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "../Navbar/Navbar";
import Home from "../Home/Home";
import ProductList from "../ProductList/ProductList";
import ProductForm from "../ProductForm/ProductForm";
import Checkout from "../Checkout/Checkout";
import * as checkoutApi from "../../services/checkoutApi";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

class App extends Component {
  constructor() {
    super();

    this.state = {
      checkoutCount: 0,
      loading: true,
      error: false,
    };
  }

  componentDidMount = async () => {
    const checkoutCount = await checkoutApi.getCheckoutCount();
    if (Number(checkoutCount) || checkoutCount === 0) {
      this.setState({ checkoutCount, loading: false, error: false });
    } else {
      this.setState({ loading: false, error: true });
    }
  };

  updateCheckoutCount = async () => {
    const checkoutCount = await checkoutApi.getCheckoutCount();
    if (Number(checkoutCount) || checkoutCount === 0) {
      this.setState({ checkoutCount, loading: false, error: false });
    } else {
      this.setState({ loading: false, error: true });
    }
  };

  render() {
    const { checkoutCount } = this.state;
    const { updateCheckoutCount } = this;

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
}

export default App;
