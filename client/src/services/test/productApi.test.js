import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import dataSet from "../../__mocksData__/mockDataSet.json";
import {
  ADD_NEW_PRODUCT_ERROR,
  ADD_NEW_PRODUCT_SUCCESS,
  FETCH_PRODUCT_DATA_ERROR,
} from "../../constants/constants";
import * as productApi from "../productApi";

describe("Testing the productApi service", () => {
  let mock;
  beforeEach(() => (mock = new MockAdapter(axios)));

  it("should return all products when getAllProducts is called", async () => {
    const mockAllProducts = dataSet.productsData[0];
    mock.onGet("/products").reply(200, mockAllProducts);

    const actualProducts = await productApi.getAllProducts();
    expect(actualProducts).toEqual(mockAllProducts);
  });

  it("should return an error message when the getAllProducts call fails", async () => {
    mock.onGet("/products").reply(500, FETCH_PRODUCT_DATA_ERROR);

    const actualResponse = await productApi.getAllProducts();
    expect(actualResponse).toEqual(FETCH_PRODUCT_DATA_ERROR);
  });

  it("should return success message when addNewProduct is called", async () => {
    const productToAdd = dataSet.productsData[0][0];
    mock.onPost(`/products/`, productToAdd).reply(201, ADD_NEW_PRODUCT_SUCCESS);

    const actualProducts = await productApi.addNewProduct(productToAdd);
    expect(actualProducts).toEqual(ADD_NEW_PRODUCT_SUCCESS);
  });

  it("should return an error message when the addNewProduct call fails", async () => {
    const productToAdd = dataSet.productsData[0][0];
    mock.onPost(`/products/`, {}).reply(500, ADD_NEW_PRODUCT_ERROR);

    const actualResponse = await productApi.addNewProduct();
    expect(actualResponse).toEqual(ADD_NEW_PRODUCT_ERROR);
  });
});
