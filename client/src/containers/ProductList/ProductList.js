import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../../components/Loader/Loader";
import Product from "../../components/Product/Product";
import {
  FETCH_DEPARTMENT_DATA_ERROR,
  FETCH_PRODUCT_DATA_ERROR,
  MULTIPLE_ERRORS,
  PRODUCT_ADDED_TO_CHECKOUT_SUCCESS,
} from "../../constants/constants";
import { formatFilters } from "../../helpers/formatFilters";
import * as checkoutApi from "../../services/checkoutApi";
import * as departmentApi from "../../services/departmentApi";
import * as productApi from "../../services/productApi";
import "./ProductList.css";

function ProductList({ updateCheckoutCount }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departmentsError, setDepartmentsError] = useState(false);
  const [productsError, setProductsError] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [filtersByBrand, setFiltersByBrand] = useState([]);
  const [filtersByDepartment, setFiltersByDepartment] = useState([]);
  const [activeFilter, setActiveFilter] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const products = await productApi.getAllProducts();
      const filtersByDepartment = await departmentApi.getAllDepartments();

      if (
        products !== FETCH_PRODUCT_DATA_ERROR &&
        filtersByDepartment !== FETCH_DEPARTMENT_DATA_ERROR
      ) {
        const filtersByBrand = formatFilters(products, "brand").sort((a, b) => {
          const nameA = a.name.toUpperCase();
          const nameB = b.name.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });

        setProducts(products);
        setFiltersByBrand(filtersByBrand);
        setFiltersByDepartment(filtersByDepartment);
        setProductsError(false);
        setDepartmentsError(false);
      } else {
        if (products === FETCH_PRODUCT_DATA_ERROR) {
          setErrMsg(products);
          setProductsError(true);
        }
        if (filtersByDepartment === FETCH_DEPARTMENT_DATA_ERROR) {
          setErrMsg(filtersByDepartment);
          setDepartmentsError(true);
        }
        if (
          products === FETCH_PRODUCT_DATA_ERROR &&
          filtersByDepartment === FETCH_DEPARTMENT_DATA_ERROR
        ) {
          setErrMsg(MULTIPLE_ERRORS);
          setProductsError(true);
          setDepartmentsError(true);
        }
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  async function addItemToCheckout(product) {
    const productAdded = await checkoutApi.addItemToCheckout(product);
    if (productAdded === PRODUCT_ADDED_TO_CHECKOUT_SUCCESS) {
      updateCheckoutCount();
      toast.success(PRODUCT_ADDED_TO_CHECKOUT_SUCCESS);
    } else {
      toast.error(productAdded);
    }

    setLoading(false);
  }

  function onFilterChange(filter) {
    if (activeFilter.includes(filter)) {
      const filterIndex = activeFilter.indexOf(filter);
      const newFilter = [...activeFilter];
      newFilter.splice(filterIndex, 1);
      setActiveFilter(newFilter);
    } else {
      setActiveFilter([...activeFilter, filter]);
    }
  }

  let filteredList;

  if (
    activeFilter.length === 0 ||
    activeFilter.length === filtersByBrand.length + filtersByDepartment.length
  ) {
    filteredList = products;
  } else {
    filteredList = products.filter((item) => {
      return (
        activeFilter.includes(item.brand) ||
        activeFilter.includes(item.departmentId)
      );
    });
  }

  return (
    <div className="product-list-container">
      <section className="filter-wrapper">
        <p className="filter-title">Filter by Department</p>
        <div className="filter-data">
          {departmentsError ? (
            <p>Cannot load department filters.</p>
          ) : (
            filtersByDepartment.length &&
            filtersByDepartment.map((filter) => (
              <span key={filter.id} className="filter-item">
                <label htmlFor={filter.id}>{filter.name}</label>
                <input
                  className="filter-checkbox"
                  id={filter.id}
                  type="checkbox"
                  checked={activeFilter.includes(filter.id)}
                  onChange={() => onFilterChange(filter.id)}
                />
              </span>
            ))
          )}
        </div>
        <p className="filter-title">Filter by Brand</p>
        <div className="filter-data">
          {productsError ? (
            <p>Cannot load product brand filters.</p>
          ) : (
            filtersByBrand.length &&
            filtersByBrand.map((filter, index) => (
              <span key={index} className="filter-item">
                <label htmlFor={index}>{filter.name}</label>
                <input
                  className="filter-checkbox"
                  id={index}
                  type="checkbox"
                  checked={activeFilter.includes(filter.value)}
                  onChange={() => onFilterChange(filter.value)}
                />
              </span>
            ))
          )}
        </div>
      </section>
      <h1 className="product-list-header">My Products</h1>
      <section className="products-container">
        {productsError || departmentsError ? (
          <p className="product-list-message">
            {errMsg} Please refresh the page or try again later.
          </p>
        ) : null}
        {loading ? <Loader message="Loading product list..." /> : null}
        <div className="product-list-product-wrapper">
          {!loading && !productsError && filteredList.length
            ? filteredList.map((product) => (
                <Product
                  key={product.id}
                  product={product}
                  addItemToCheckout={addItemToCheckout}
                />
              ))
            : null}
          {!loading &&
          !productsError &&
          !departmentsError &&
          !filteredList.length ? (
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
