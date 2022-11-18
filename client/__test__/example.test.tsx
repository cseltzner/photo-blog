import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import Navbar from "../components/navbar/Navbar";
import TestComponent from "../components/testComponent";

describe("ensure react testing library is functioning", () => {
  test("renders an image in the navbar", () => {
    render(<Navbar />);

    const logo = screen.getByRole("navigation", { name: /seltzport brand/i });
    expect(logo).toBeInTheDocument();
  });

  test("ensure mock service worker is functioning", async () => {
    render(<TestComponent />);

    const button = await screen.findByRole("button", { name: "1" });
    expect(button).toBeInTheDocument();
  });
});

export {};
