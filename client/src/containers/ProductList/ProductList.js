import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import FilterSection from "../../components/FilterSection/FilterSection";
import Loader from "../../components/Loader/Loader";
import Product from "../../components/Product/Product";
import {
  MULTIPLE_ERRORS,
  PRODUCT_ADDED_TO_CHECKOUT_SUCCESS,
} from "../../constants/constants";
import { useDepartments } from "../../hooks/useDepartments";
import { useProducts } from "../../hooks/useProducts";
import * as checkoutApi from "../../services/checkoutApi";
import "./ProductList.css";

function ProductList({ updateCheckoutCount }) {
  const [errMsg, setErrMsg] = useState("");
  const [activeFilter, setActiveFilter] = useState([]);

  const [products, filtersByBrand, [loadingProducts, productsError]] =
    useProducts();
  const [filtersByDepartment, [loadingDepartments, departmentsError]] =
    useDepartments();

  useEffect(() => {
    if (productsError && departmentsError) {
      setErrMsg(MULTIPLE_ERRORS);
    } else if (productsError) setErrMsg(productsError);
  }, [productsError, departmentsError]);

  async function addItemToCheckout(product) {
    try {
      const productAdded = await checkoutApi.addItemToCheckout(product);
      if (productAdded === PRODUCT_ADDED_TO_CHECKOUT_SUCCESS) {
        updateCheckoutCount();
        toast.success(PRODUCT_ADDED_TO_CHECKOUT_SUCCESS);
      } else {
        toast.error(productAdded);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  function onFilterChange(filter) {
    setActiveFilter((prevFilters) =>
      prevFilters.includes(filter)
        ? prevFilters.filter((prevFilter) => prevFilter !== filter)
        : [...prevFilters, filter]
    );
  }

  const filteredList = React.useMemo(() => {
    if (
      activeFilter.length === 0 ||
      activeFilter.length === filtersByBrand.length + filtersByDepartment.length
    ) {
      return products;
    } else {
      return products.filter(
        (item) =>
          activeFilter.includes(item.brand) ||
          activeFilter.includes(item.departmentId)
      );
    }
  }, [activeFilter, filtersByBrand, filtersByDepartment, products]);

  return (
    <div className="product-list-container">
      <section className="filter-wrapper">
        <FilterSection
          title="Filter by Department"
          filters={filtersByDepartment}
          loading={loadingDepartments}
          error={departmentsError}
          activeFilter={activeFilter}
          onFilterChange={onFilterChange}
        />
        <FilterSection
          title="Filter by Brand"
          filters={filtersByBrand}
          loading={loadingProducts}
          error={productsError}
          activeFilter={activeFilter}
          onFilterChange={onFilterChange}
        />
      </section>

      <h1 className="product-list-header">My Products</h1>
      <section className="products-container">
        {errMsg && (
          <p className="product-list-message">
            {errMsg} Please refresh the page or try again later.
          </p>
        )}
        {loadingProducts && <Loader message="Loading product list..." />}
        <div className="product-list-product-wrapper">
          {!loadingProducts && !productsError && filteredList.length > 0 ? (
            filteredList.map((product) => (
              <Product
                key={product.id}
                product={product}
                addItemToCheckout={addItemToCheckout}
              />
            ))
          ) : !loadingProducts && !productsError && !departmentsError ? (
            <p className="product-list-message">
              There are no products that match your filters. Please clear some
              filters to see more producs.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}

export default ProductList;
