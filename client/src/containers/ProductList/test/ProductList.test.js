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

describe("Product List component", () => {
  const mockUseDepartments = jest.spyOn(useDepartments, "useDepartments");
  const mockUseProducts = jest.spyOn(useProducts, "useProducts");

  beforeEach(() => {
    mockUseDepartments.mockReturnValue([
      [
        {
          id: 45,
          name: "Garden Tools",
        },
        {
          id: 56,
          name: "Appliances",
        },
      ],
      [false, null],
    ]);

    mockUseProducts.mockReturnValue([
      [
        {
          brand: "Gnome Gardening",
          departmentId: 45,
          description: "A trowel above all others.",
          id: 1,
          name: "Polka Dot Trowel",
          retailPrice: 999,
        },
        {
          brand: "Gnome Gardening",
          departmentId: 45,
          description:
            "Protect yourself from sun burn while gardening with a wide brimmed, lightweight sun hat.",
          id: 2,
          name: "Rose Sun Hat",
          retailPrice: 2495,
        },
        {
          brand: "SL",
          departmentId: 56,
          description:
            "This fridge keeps your food at the perfect temperature guaranteed.",
          id: 3,
          name: "Stainless Steel Refrigerator",
          retailPrice: 229900,
        },
        {
          brand: "Swirl Pool",
          departmentId: 56,
          description:
            "Clothes have never been so clean, and a washer has never looked so stylish cleaning them.",
          id: 4,
          name: "Matte Black Connected Washing Machine",
          retailPrice: 45050,
        },
      ],
      [
        { name: "Gnome Gardening", value: "Gnome Gardening" },
        { name: "SL", value: "SL" },
        { name: "Swirl Pool", value: "Swirl Pool" },
      ],
      [false, null],
    ]);
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

      expect(mockAddItemToCheckout).toHaveBeenCalledWith({
        brand: "Gnome Gardening",
        departmentId: 45,
        description: "A trowel above all others.",
        id: 1,
        name: "Polka Dot Trowel",
        retailPrice: 999,
      });
    });
  });

  //==========
});
