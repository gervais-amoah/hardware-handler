import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {
  FETCH_CHECKOUT_PRODUCTS_ERROR,
  PRODUCT_ADDED_TO_CHECKOUT_SUCCESS,
  PRODUCT_ALREADY_IN_CHECKOUT_ERROR,
  REMOVE_PRODUCT_FROM_CHECKOUT_ERROR,
} from "../../constants/constants";
import * as checkoutApi from "../checkoutApi";

describe("Testing the checkoutApi service", () => {
  let mock;

  beforeEach(() => (mock = new MockAdapter(axios)));

  afterEach(() => {
    mock.restore();
  });

  it("should return all checkout items when getAllCheckoutItems is called successfully", async () => {
    const mockAllCheckoutItems = [
      { productId: 1, quantity: 2 },
      { productId: 2, quantity: 1 },
    ];
    mock.onGet("/checkout").reply(200, mockAllCheckoutItems);

    const actualCheckoutItems = await checkoutApi.getAllCheckoutItems();

    expect(actualCheckoutItems).toEqual(mockAllCheckoutItems);
  });

  it("should return an error message when getAllCheckoutItems call fails", async () => {
    mock.onGet("/checkout").reply(500, FETCH_CHECKOUT_PRODUCTS_ERROR);

    const actualResponse = await checkoutApi.getAllCheckoutItems();

    expect(actualResponse).toEqual(FETCH_CHECKOUT_PRODUCTS_ERROR);
  });

  it("should return an error when adding a product that already exists in the checkout", async () => {
    const existingItem = { id: 1, productId: 1, quantity: 2 };
    const newItem = { id: 1, brand: "Gnome Gardening" };

    mock.onGet("/checkout").reply(200, [existingItem]);

    const actualResponse = await checkoutApi.addItemToCheckout(newItem);

    expect(actualResponse).toEqual(PRODUCT_ALREADY_IN_CHECKOUT_ERROR);
  });

  it("should return success when adding a new product to the checkout", async () => {
    const newItem = {
      brand: "SL",
      departmentId: 56,
      description:
        "This fridge keeps your food at the perfect temperature guaranteed.",
      productId: 3,
      id: 3,
      quantity: 1,
      name: "Stainless Steel Refrigerator",
      retailPrice: 229900,
    };

    mock.onGet("/checkout").reply(200, []);
    mock.onPost("/checkout/", { ...newItem, quantity: 1 }).reply(201);

    const actualResponse = await checkoutApi.addItemToCheckout(newItem);

    expect(actualResponse).toEqual(PRODUCT_ADDED_TO_CHECKOUT_SUCCESS);
  });

  it("should return remaining items when removing a product from the checkout", async () => {
    const itemIdToRemove = 1;
    const mockAllCheckoutItems = [
      { id: 1, productId: 1, quantity: 2 },
      { id: 2, productId: 2, quantity: 1 },
    ];

    mock.onGet("/checkout").reply(200, mockAllCheckoutItems);
    mock.onDelete(`/checkout/${itemIdToRemove}`).reply(200);

    const remainingCheckoutItems = await checkoutApi.removeProductFromCheckout(
      itemIdToRemove
    );

    expect(remainingCheckoutItems).toEqual([
      { id: 2, productId: 2, quantity: 1 },
    ]);
  });

  it("should return an error when removing a product from the checkout fails", async () => {
    const itemIdToRemove = 1;

    mock.onGet("/checkout").reply(200, []);
    mock.onDelete(`/checkout/${itemIdToRemove}`).reply(500);

    const actualResponse = await checkoutApi.removeProductFromCheckout(
      itemIdToRemove
    );

    expect(actualResponse).toEqual(REMOVE_PRODUCT_FROM_CHECKOUT_ERROR);
  });
});
