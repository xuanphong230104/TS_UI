import { render, screen, act, fireEvent } from "../../../tests/test-utils";
import Login from "./index";

describe("Login", () => {
  test("should render", () => {
    render(<Login />);
    const title = screen.getByText(/Transparent Test System/i);
    const text = screen.getByText(/Login/i);
    expect(title).toBeInTheDocument();
    expect(text).toBeInTheDocument();
  });

  test("should have input fields with placeholder text for username and password", () => {
    render(<Login />);

    const usernameInput = screen.getByPlaceholderText(/username/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });

  test("should show error messages when username and password are not filled in", async () => {
    render(<Login />);

    const submitButton = screen.getByRole("button", { name: /log in/i });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Use findByText to handle asynchronous rendering
    const usernameError = await screen.findByText(
      /please input your username!/i,
    );
    const passwordError = await screen.findByText(
      /please input your password!/i,
    );

    expect(usernameError).toBeInTheDocument();
    expect(passwordError).toBeInTheDocument();
  });
});
