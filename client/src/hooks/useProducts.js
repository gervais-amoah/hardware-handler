import { useEffect, useState } from "react";
import { FETCH_PRODUCT_DATA_ERROR } from "../constants/constants";
import { getAllProducts } from "../services/productApi";
import { formatFilters } from "../helpers/formatFilters";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [productsFilteredByBrand, setProductsFilteredByBrand] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const allProducts = await getAllProducts();

        if (allProducts !== FETCH_PRODUCT_DATA_ERROR) {
          const filteredByBrand = formatFilters(allProducts, "brand").sort(
            (a, b) => a.name.localeCompare(b.name)
          );

          setProducts(allProducts);
          setProductsFilteredByBrand(filteredByBrand);
          setError(false);
        } else {
          setError(allProducts);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return [products, productsFilteredByBrand, [loading, error]];
}
