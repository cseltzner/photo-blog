import { server } from "./mocks/server";
import "whatwg-fetch";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";

const localStorageMock = new (class {
  store = {};
  setItem = (key, val) => (this.store[key] = val);
  getItem = (key) => this.store[key];
  removeItem = (key) => {
    delete this.store[key];
  };
  clear = () => (this.store = {});
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
