import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  FETCH_DEPARTMENT_DATA_ERROR,
  PRODUCT_ADDED_TO_CHECKOUT_SUCCESS,
} from "../../../constants/constants";
import * as useDepartments from "../../../hooks/useDepartments";
import * as useProducts from "../../../hooks/useProducts";
import * as checkoutApi from "../../../services/checkoutApi";
import ProductList from "../ProductList";
import dataSet from "../../../__mocksData__/mockDataSet.json";

describe("Product List component", () => {
  const mockUseDepartments = jest.spyOn(useDepartments, "useDepartments");
  const mockUseProducts = jest.spyOn(useProducts, "useProducts");

  beforeEach(() => {
    mockUseDepartments.mockReturnValue(dataSet.departmentsData);

    mockUseProducts.mockReturnValue(dataSet.productsData);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("Should render without crashing", () => {
    render(<ProductList />);

    const pageTitle = screen.getByText(/my products/i);
    const deptFilter = screen.getByText(/filter by department/i);
    const brandFilter = screen.getByText(/filter by brand/i);

    expect(pageTitle).toBeInTheDocument();
    expect(deptFilter).toBeInTheDocument();
    expect(brandFilter).toBeInTheDocument();
  });

  describe("products on the page", () => {
    it("should render products when the useProducts Hook returns data", () => {
      render(<ProductList />);

      const products = screen.getAllByText(/description/i);
      expect(products).toHaveLength(4);
      expect(screen.getByText(/matte black/i)).toBeInTheDocument();
      expect(screen.getByText(/rose sun hat/i)).toBeInTheDocument();
      expect(screen.getByText(/9.99/i)).toBeInTheDocument();
    });

    it("should show an error message when there is a problem fetching the data from eith hook", async () => {
      mockUseDepartments.mockReturnValueOnce([
        [],
        [false, FETCH_DEPARTMENT_DATA_ERROR],
      ]);

      render(<ProductList />);
      const errorMsg = await screen.findByText(
        "Cannot load filter by department filters."
      );
      expect(errorMsg).toBeInTheDocument();
    });

    it("should successfully add a product to the checkout when the Add to Checkout button is clicked", async () => {
      const mockAddItemToCheckout = jest.spyOn(
        checkoutApi,
        "addItemToCheckout"
      );

      mockAddItemToCheckout.mockReturnValue(PRODUCT_ADDED_TO_CHECKOUT_SUCCESS);

      render(<ProductList />);
      const addBtn = screen.getAllByText(/add to checkout/i)[0];
      await userEvent.click(addBtn);

      expect(mockAddItemToCheckout).toHaveBeenCalledWith(
        dataSet.productsData[0][0]
      );
    });

    it("should filter products displayed on page when filters are checked and unchecked", async () => {
      render(<ProductList />);
      const checkboxes = screen.getAllByRole("checkbox");
      expect(await screen.findAllByText(/description/i)).toHaveLength(4);
      userEvent.click(checkboxes[0]);
      expect(await screen.findAllByText(/description/i)).toHaveLength(2);
      userEvent.click(checkboxes[0]);
      expect(await screen.findAllByText(/description/i)).toHaveLength(4);
    });
  });

  //==========
});
