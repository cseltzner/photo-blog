import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/router";
import AlertContextTestProvider from "../../test-utils/context/AlertContextTestProvider";
import Login from "../../../pages/admin/login";
import { rest } from "msw";
import { apiProxy } from "../../../utils/apiProxy";
import { server } from "../../../mocks/server";
import { loginComponentStrings as strings } from "../../../strings/components/auth/loginComponentStrings";

// Stub out router.push()
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));
const push = jest.fn();
(useRouter as jest.Mock).mockImplementation(() => ({
  push,
}));

beforeEach(() => {
  localStorage.clear();
  localStorage.removeItem("token");
});

describe("Login component", () => {
  test("page title changes on page load", () => {
    render(<Login />);
    expect(document.title).toBe(strings.html_pageTitle);
  });

  test("component renders correctly", () => {
    render(<Login />);

    const header = screen.getByRole("heading", { name: strings.html_header });
    expect(header).toBeInTheDocument();

    const logo = screen.getByAltText(strings.html_logoAlt);
    expect(logo).toBeInTheDocument();

    const usernameInput = screen.getByPlaceholderText(
      strings.html_usernamePlaceholder
    );
    expect(usernameInput).toBeInTheDocument();

    const passwordInput = screen.getByPlaceholderText(
      strings.html_passwordPlaceholder
    );
    expect(passwordInput).toBeInTheDocument();

    const demoSignInButton = screen.getByText(strings.html_demoAdminText);
    expect(demoSignInButton).toBeInTheDocument();

    const signInButton = screen.getByRole("button", {
      name: strings.html_signInButton,
    });
    expect(signInButton).toBeInTheDocument();
  });

  test("signing in as demo admin sets an arbitrary localstorage token", async () => {
    render(<Login />);

    const demoSignInButton = screen.getByText(strings.html_demoAdminText);
    await userEvent.click(demoSignInButton);

    expect(localStorage.getItem("token")).toBe(strings.demoToken);
  });

  test("signing in as demo admin routes to home page", async () => {
    render(<Login />);

    const demoSignInButton = screen.getByText(strings.html_demoAdminText);
    await userEvent.click(demoSignInButton);
    expect(push).toHaveBeenCalledWith("/");
  });

  test("attempting to sign in with no username and no password will generate error alert with 2 error messages", async () => {
    render(
      <AlertContextTestProvider>
        <Login />
      </AlertContextTestProvider>
    );

    const signInButton = screen.getByRole("button", {
      name: strings.html_signInButton,
    });
    await userEvent.click(signInButton);

    const alert = await screen.findByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveAttribute("id", "alert-error");

    const listItems = await screen.findAllByRole("listitem");
    expect(listItems).toHaveLength(2);
    expect(listItems[0]).toHaveTextContent(strings.alert_usernameNeeded);
    expect(listItems[1]).toHaveTextContent(strings.alert_passwordNeeded);
  });

  test("attempting to sign in with no username will generate alert error", async () => {
    render(
      <AlertContextTestProvider>
        <Login />
      </AlertContextTestProvider>
    );

    const passwordInput = screen.getByPlaceholderText(/password/i);
    await userEvent.type(passwordInput, "test password");

    const signInButton = screen.getByRole("button", {
      name: strings.html_signInButton,
    });
    await userEvent.click(signInButton);

    const alert = await screen.findByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveAttribute("id", "alert-error");

    const listItems = await screen.findAllByRole("listitem");
    expect(listItems).toHaveLength(1);
    expect(listItems[0]).toHaveTextContent(strings.alert_usernameNeeded);
  });

  test("attempting to sign in with no password will generate alert error", async () => {
    render(
      <AlertContextTestProvider>
        <Login />
      </AlertContextTestProvider>
    );

    const usernameInput = screen.getByPlaceholderText(/username/i);
    await userEvent.type(usernameInput, "test username");

    const signInButton = screen.getByRole("button", {
      name: strings.html_signInButton,
    });
    await userEvent.click(signInButton);

    const alert = await screen.findByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveAttribute("id", "alert-error");

    const listItems = await screen.findAllByRole("listitem");
    expect(listItems).toHaveLength(1);
    expect(listItems[0]).toHaveTextContent(strings.alert_passwordNeeded);
  });

  test("server error generates alert error", async () => {
    // Returns status code 500
    server.use(
      rest.post(apiProxy.concat("/user/auth"), (req, res, ctx) => {
        return res.once(ctx.status(500));
      })
    );

    render(
      <AlertContextTestProvider>
        <Login />
      </AlertContextTestProvider>
    );

    const usernameInput = screen.getByPlaceholderText(
      strings.html_usernamePlaceholder
    );
    await userEvent.type(usernameInput, "test username");

    const passwordInput = screen.getByPlaceholderText(
      strings.html_passwordPlaceholder
    );
    await userEvent.type(passwordInput, "test password");

    const signInButton = screen.getByRole("button", {
      name: strings.html_signInButton,
    });
    await userEvent.click(signInButton);

    const alert = await screen.findByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveAttribute("id", "alert-error");

    const listItems = await screen.findAllByRole("listitem");
    expect(listItems).toHaveLength(1);
    expect(listItems[0]).toHaveTextContent(strings.alert_serverError);
  });

  test("Invalid body error generates alert error", async () => {
    // Returns status code 400
    server.use(
      rest.post(apiProxy.concat("/user/auth"), (req, res, ctx) => {
        return res.once(ctx.status(400));
      })
    );

    render(
      <AlertContextTestProvider>
        <Login />
      </AlertContextTestProvider>
    );

    const usernameInput = screen.getByPlaceholderText(
      strings.html_usernamePlaceholder
    );
    await userEvent.type(usernameInput, "test username");

    const passwordInput = screen.getByPlaceholderText(
      strings.html_passwordPlaceholder
    );
    await userEvent.type(passwordInput, "test password");

    const signInButton = screen.getByRole("button", {
      name: strings.html_signInButton,
    });
    await userEvent.click(signInButton);

    const alert = await screen.findByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveAttribute("id", "alert-error");

    const listItems = await screen.findAllByRole("listitem");
    expect(listItems).toHaveLength(1);
    expect(listItems[0]).toHaveTextContent(strings.alert_invalidBodyError);
  });

  test("invalid password error generates alert error", async () => {
    // Returns status code 401
    server.use(
      rest.post(apiProxy.concat("/user/auth"), (req, res, ctx) => {
        return res.once(ctx.status(401));
      })
    );

    render(
      <AlertContextTestProvider>
        <Login />
      </AlertContextTestProvider>
    );

    const usernameInput = screen.getByPlaceholderText(
      strings.html_usernamePlaceholder
    );
    await userEvent.type(usernameInput, "fake username");

    const passwordInput = screen.getByPlaceholderText(
      strings.html_passwordPlaceholder
    );
    await userEvent.type(passwordInput, "fake password");

    const signInButton = screen.getByRole("button", {
      name: strings.html_signInButton,
    });
    await userEvent.click(signInButton);

    const alert = await screen.findByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveAttribute("id", "alert-error");

    const listItems = await screen.findAllByRole("listitem");
    expect(listItems).toHaveLength(1);
    expect(listItems[0]).toHaveTextContent(strings.alert_invalidPasswordError);
  });

  test("user not found error generates alert error", async () => {
    // Returns status code 404
    server.use(
      rest.post(apiProxy.concat("/user/auth"), (req, res, ctx) => {
        return res.once(ctx.status(404));
      })
    );

    render(
      <AlertContextTestProvider>
        <Login />
      </AlertContextTestProvider>
    );

    const usernameInput = screen.getByPlaceholderText(
      strings.html_usernamePlaceholder
    );
    await userEvent.type(usernameInput, "fake username");

    const passwordInput = screen.getByPlaceholderText(
      strings.html_passwordPlaceholder
    );
    await userEvent.type(passwordInput, "fake password");

    const signInButton = screen.getByRole("button", {
      name: strings.html_signInButton,
    });
    await userEvent.click(signInButton);

    const alert = await screen.findByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveAttribute("id", "alert-error");

    const listItems = await screen.findAllByRole("listitem");
    expect(listItems).toHaveLength(1);
    expect(listItems[0]).toHaveTextContent(strings.alert_invalidUsernameError);
  });

  test("successful sign in should show alert success message", async () => {
    // Returns token
    server.use(
      rest.post(apiProxy.concat("/user/auth"), (req, res, ctx) => {
        return res.once(ctx.delay(), ctx.json({ token: "test token" }));
      })
    );

    render(
      <AlertContextTestProvider>
        <Login />
      </AlertContextTestProvider>
    );

    const usernameInput = screen.getByPlaceholderText(
      strings.html_usernamePlaceholder
    );
    await userEvent.type(usernameInput, "fake username");

    const passwordInput = screen.getByPlaceholderText(
      strings.html_passwordPlaceholder
    );
    await userEvent.type(passwordInput, "fake password");

    const signInButton = screen.getByRole("button", {
      name: strings.html_signInButton,
    });

    await userEvent.click(signInButton);

    const alert = await screen.findByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveAttribute("id", "alert-success");

    const alertText = await screen.findByText(strings.alert_loginSuccess);
    expect(alertText).toBeInTheDocument();
  });

  test("successful sign in should route to home page", async () => {
    // Returns token
    server.use(
      rest.post(apiProxy.concat("/user/auth"), (req, res, ctx) => {
        return res.once(ctx.delay(), ctx.json({ token: "test token" }));
      })
    );

    render(
      <AlertContextTestProvider>
        <Login />
      </AlertContextTestProvider>
    );

    const usernameInput = screen.getByPlaceholderText(
      strings.html_usernamePlaceholder
    );
    await userEvent.type(usernameInput, "fake username");

    const passwordInput = screen.getByPlaceholderText(
      strings.html_passwordPlaceholder
    );
    await userEvent.type(passwordInput, "fake password");

    const signInButton = screen.getByRole("button", {
      name: strings.html_signInButton,
    });

    await userEvent.click(signInButton);

    expect(push).toBeCalled();
  });

  test("successful sign in should store token in localstorage", async () => {
    // Returns token
    const testToken = "test token";
    server.use(
      rest.post(apiProxy.concat("/user/auth"), (req, res, ctx) => {
        return res.once(ctx.delay(), ctx.json({ token: testToken }));
      })
    );

    render(
      <AlertContextTestProvider>
        <Login />
      </AlertContextTestProvider>
    );

    const usernameInput = screen.getByPlaceholderText(
      strings.html_usernamePlaceholder
    );
    await userEvent.type(usernameInput, "fake username");

    const passwordInput = screen.getByPlaceholderText(
      strings.html_passwordPlaceholder
    );
    await userEvent.type(passwordInput, "fake password");

    const signInButton = screen.getByRole("button", {
      name: strings.html_signInButton,
    });

    await userEvent.click(signInButton);

    expect(localStorage.getItem("token")).toBe(testToken);
  });

  test("connection error should generate alert error", async () => {
    localStorage.setItem("token", "test network error token");
    // No server response
    server.use(
      rest.post(apiProxy.concat("/user/auth"), (req, res, ctx) => {
        throw new Error();
      })
    );

    render(
      <AlertContextTestProvider>
        <Login />
      </AlertContextTestProvider>
    );

    const usernameInput = screen.getByPlaceholderText(
      strings.html_usernamePlaceholder
    );
    await userEvent.type(usernameInput, "fake username");

    const passwordInput = screen.getByPlaceholderText(
      strings.html_passwordPlaceholder
    );
    await userEvent.type(passwordInput, "fake password");

    const signInButton = screen.getByRole("button", {
      name: strings.html_signInButton,
    });

    await userEvent.click(signInButton);

    const alert = await screen.findByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveAttribute("id", "alert-error");

    const listItems = await screen.findAllByRole("listitem");
    expect(listItems).toHaveLength(1);
    expect(listItems[0]).toHaveTextContent(strings.alert_authenticationError);
  });
});

export {};
