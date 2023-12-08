import { renderHook } from "@testing-library/react-hooks";
import * as productApi from "../../services/productApi";
import { useProducts } from "../useProducts";
import mockDataSet from "../../__mocksData__/mockDataSet.json";
import { FETCH_PRODUCT_DATA_ERROR } from "../../constants/constants";

const renderUseProductsHook = async () => {
  const { result, waitForNextUpdate } = renderHook(() => useProducts());
  await waitForNextUpdate();
  return { result, waitForNextUpdate };
};

describe("the useProducts Hook", () => {
  const getAllProductsMock = jest.spyOn(productApi, "getAllProducts");

  beforeEach(() => {
    getAllProductsMock.mockResolvedValue(mockDataSet.productsData[0]);
  });

  afterEach(() => jest.resetAllMocks());

  it("should return a list of products and filters by brand when the product API returns", async () => {
    const { result } = await renderUseProductsHook();
    const [products, filteredByBrand, [loading, error]] = result.current;

    expect(products.length).toEqual(mockDataSet.productsData[0].length);
    expect(filteredByBrand.length).toEqual(mockDataSet.productsData[1].length);
    expect(products).toStrictEqual(mockDataSet.productsData[0]);
    expect(filteredByBrand).toStrictEqual(mockDataSet.productsData[1]);
    expect(error).not.toBeTruthy();
    expect(loading).not.toBeTruthy();
  });

  it("should return an error if the API fails to return data", async () => {
    getAllProductsMock.mockResolvedValueOnce(FETCH_PRODUCT_DATA_ERROR);
    const { result } = await renderUseProductsHook();

    const [products, filteredByBrand, [loading, error]] = result.current;

    expect(products).toEqual([]);
    expect(filteredByBrand).toEqual([]);
    expect(error).toEqual(FETCH_PRODUCT_DATA_ERROR);
    expect(loading).not.toBeTruthy();
  });
});
