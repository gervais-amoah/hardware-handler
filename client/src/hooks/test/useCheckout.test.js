import { renderHook } from "@testing-library/react-hooks";
import * as checkoutApi from "../../services/checkoutApi";
import { useCheckout } from "../useCheckout";
import mockDataSet from "../../__mocksData__/mockDataSet.json";
import { FETCH_CHECKOUT_PRODUCTS_ERROR } from "../../constants/constants";

const renderUseCheckoutHook = async () => {
  const checkoutUpdated = true;
  const { result, waitForNextUpdate } = renderHook(() =>
    useCheckout(checkoutUpdated)
  );
  await waitForNextUpdate();
  return { result, waitForNextUpdate };
};

describe("the useCheckout hook", () => {
  const getAllCheckoutItemsMocked = jest.spyOn(
    checkoutApi,
    "getAllCheckoutItems"
  );

  beforeEach(() => {
    getAllCheckoutItemsMocked.mockResolvedValue(mockDataSet.checkout);
  });

  afterEach(() => jest.resetAllMocks());

  it("should return a list of products from the checkout when the 'checkout' API returns", async () => {
    const { result } = await renderUseCheckoutHook();
    const { error, checkoutItems, checkoutCount, setCheckoutItems } =
      result.current;

    expect(checkoutItems).toStrictEqual(mockDataSet.checkout);
    expect(checkoutCount).toStrictEqual(mockDataSet.checkout.length);
    expect(setCheckoutItems).toBeTruthy();
    expect(error).not.toBeTruthy();
  });

  it("should return an error if the 'checkout' API fails to return data", async () => {
    getAllCheckoutItemsMocked.mockResolvedValueOnce(
      FETCH_CHECKOUT_PRODUCTS_ERROR
    );

    const { result } = await renderUseCheckoutHook();
    const { error, checkoutItems, checkoutCount, setCheckoutItems } =
      result.current;

    expect(checkoutItems).toEqual([]);
    expect(checkoutCount).toEqual(0);
    expect(setCheckoutItems).toBeTruthy();
    expect(error).toEqual(FETCH_CHECKOUT_PRODUCTS_ERROR);
  });
});
