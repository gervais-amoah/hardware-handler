import { render, screen } from "@testing-library/react";
import App from "../App";
import * as useCheckout from "../../../hooks/useCheckout";

describe("Hardware Handler app", () => {
  it("should renders  without crashing", () => {
    render(<App />);
    const title = screen.getByText(/welcome to hardware handler/i);
    const productButton = screen.getAllByText(/my products/i);
    const newProductButton = screen.getAllByText(/add new products/i);
    const checkoutButton = screen.getAllByText(/checkout/i);

    expect(title).toBeInTheDocument();
    expect(productButton).toHaveLength(2);
    expect(newProductButton).toHaveLength(2);
    expect(checkoutButton).toHaveLength(2);
  });

  it("should display checkout count in the navbar when there are items in the checkout", () => {
    const mockUseCheckout = jest.spyOn(useCheckout, "useCheckout");

    mockUseCheckout.mockReturnValue({
      checkoutItems: [
        {
          brand: "Test brand",
          departmentId: 1,
          description: "My test description",
          id: 1,
          name: "A test name",
          productId: 1,
          quantity: 1,
          retailPrice: 1234,
        },
      ],
      error: null,
      checkoutCount: 1,
      setCheckoutItems: jest.fn(),
    });

    render(<App />);
    const checkoutCount = screen.getByText(/checkout: 1/i);
    expect(checkoutCount).toBeInTheDocument();
  });
});
