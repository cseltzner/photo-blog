import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import Navbar from "../components/navbar/Navbar";

describe("example test", () => {
  test("renders an image in the navbar", () => {
    render(<Navbar />);

    const logo = screen.getByRole("navigation", { name: /seltzport brand/i });
    expect(logo).toBeInTheDocument();
  });
});

export {};
