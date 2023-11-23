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
import FilterSection from "../../components/FilterSection/FilterSection";

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
      try {
        const allProducts = await productApi.getAllProducts();

        if (allProducts !== FETCH_PRODUCT_DATA_ERROR) {
          const filteredByBrand = formatFilters(allProducts, "brand").sort(
            (a, b) => a.name.localeCompare(b.name)
          );

          setProducts(allProducts);
          setFiltersByBrand(filteredByBrand);
          setProductsError(false);
        } else {
          setErrMsg(allProducts);
          setProductsError(true);
        }
      } catch (error) {
        setErrMsg(error.message);
        setProductsError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchAllDepartments() {
      try {
        const departments = await departmentApi.getAllDepartments();

        if (departments !== FETCH_DEPARTMENT_DATA_ERROR) {
          setFiltersByDepartment(departments);
          setDepartmentsError(false);
        } else {
          setErrMsg(departments);
          setDepartmentsError(true);
        }
      } catch (error) {
        setErrMsg(error.message);
        setDepartmentsError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchAllDepartments();
  }, []);

  useEffect(() => {
    if (productsError && departmentsError) {
      setErrMsg(MULTIPLE_ERRORS);
    }
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
          error={departmentsError}
          activeFilter={activeFilter}
          onFilterChange={onFilterChange}
        />
        <FilterSection
          title="Filter by Brand"
          filters={filtersByBrand}
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
        {loading && <Loader message="Loading product list..." />}
        <div className="product-list-product-wrapper">
          {!loading && !productsError && filteredList.length > 0 ? (
            filteredList.map((product) => (
              <Product
                key={product.id}
                product={product}
                addItemToCheckout={addItemToCheckout}
              />
            ))
          ) : !loading && !productsError && !departmentsError ? (
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
