import { render, screen } from "@testing-library/react";
import App from "../App";

test("renders Hardware Handler without crashing", () => {
  render(<App />);
  const title = screen.getByText(/welcome to hardware handler/i);
  expect(title).toBeInTheDocument();
});
