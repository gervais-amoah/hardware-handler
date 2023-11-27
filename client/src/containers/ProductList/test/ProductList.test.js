import { prettyDOM, render, screen } from "@testing-library/react";
import * as useDepartments from "../../../hooks/useDepartments";
import * as useProducts from "../../../hooks/useProducts";
import ProductList from "../ProductList";

describe("Product List component", () => {
  // const mockUseDepartments = jest.spyOn(useDepartments, "useDepartments");
  // const mockUseProducts = jest.spyOn(useProducts, "useProducts");

  // beforeEach(() => {
  //   mockUseDepartments.mockReturnValue({
  //     departments: [
  //       {
  //         id: 45,
  //         name: "Garden Tools",
  //       },
  //       {
  //         id: 56,
  //         name: "Appliances",
  //       },
  //     ],
  //     error: null,
  //   });

  //   mockUseProducts.mockReturnValue({
  //     products: [
  //       {
  //         brand: "Gnome Gardening",
  //         departmentId: 45,
  //         description: "A trowel above all others.",
  //         id: 1,
  //         name: "Polka Dot Trowel",
  //         retailPrice: 999,
  //       },
  //       {
  //         brand: "Gnome Gardening",
  //         departmentId: 45,
  //         description:
  //           "Protect yourself from sun burn while gardening with a wide brimmed, lightweight sun hat.",
  //         id: 2,
  //         name: "Rose Sun Hat",
  //         retailPrice: 2495,
  //       },
  //       {
  //         brand: "SL",
  //         departmentId: 56,
  //         description:
  //           "This fridge keeps your food at the perfect temperature guaranteed.",
  //         id: 3,
  //         name: "Stainless Steel Refrigerator",
  //         retailPrice: 229900,
  //       },
  //       {
  //         brand: "Swirl Pool",
  //         departmentId: 56,
  //         description:
  //           "Clothes have never been so clean, and a washer has never looked so stylish cleaning them.",
  //         id: 4,
  //         name: "Matte Black Connected Washing Machine",
  //         retailPrice: 45050,
  //       },
  //     ],
  //     filtersByBrand: [
  //       { name: "Gnome Gardening", value: "Gnome Gardening" },
  //       { name: "SL", value: "SL" },
  //       { name: "Swirl Pool", value: "Swirl Pool" },
  //     ],
  //     error: null,
  //   });
  // });

  // afterEach(() => jest.resetAllMocks());

  it("Should render without crashing", () => {
    const view = render(<ProductList />);
    console.log(prettyDOM(view.container.firstChild));

    const pageTitle = screen.getByText(/my products/i);
    const deptFilter = screen.getByText(/filter by department/i);
    const brandFilter = screen.getByText(/filter by brand/i);

    expect(pageTitle).toBeInTheDocument();
    expect(deptFilter).toBeInTheDocument();
    expect(brandFilter).toBeInTheDocument();
  });
});
