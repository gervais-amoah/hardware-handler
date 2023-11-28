import { renderHook } from "@testing-library/react-hooks";
import * as productApi from "../../services/productApi";
import { useProducts } from "../useProducts";
import mockDataSet from "../../__mocksData__/mockDataSet.json";

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

  it("should return a list of products and filters br brand when the product API r4enturns", async () => {
    const { result } = await renderUseProductsHook();
    const [products, filteredByBrand, [loading, error]] = result.current;

    expect(products.length).toEqual(mockDataSet.productsData[0].length);
    expect(filteredByBrand.length).toEqual(mockDataSet.productsData[1].length);
    expect(products).toStrictEqual(mockDataSet.productsData[0]);
    expect(filteredByBrand).toStrictEqual(mockDataSet.productsData[1]);
    expect(error).not.toBeTruthy();
    expect(loading).not.toBeTruthy();
  });
});
