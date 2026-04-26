import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoginForm } from ".";

describe("LoginForm", () => {
  it("should render login form fields", () => {
    const mockSubmit = jest.fn();
    render(<LoginForm onSubmit={mockSubmit} isLoading={false} error={null} />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  it("should call onSubmit with form data", async () => {
    const mockSubmit = jest.fn().mockResolvedValue(undefined);
    render(<LoginForm onSubmit={mockSubmit} isLoading={false} error={null} />);

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(
      /password/i,
    ) as HTMLInputElement;
    const submitButton = screen.getByRole("button", { name: /log in/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  it("should display error message", () => {
    const mockSubmit = jest.fn();
    const errorMessage = "Invalid credentials";
    render(
      <LoginForm
        onSubmit={mockSubmit}
        isLoading={false}
        error={errorMessage}
      />,
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("should disable form when loading", () => {
    const mockSubmit = jest.fn();
    render(<LoginForm onSubmit={mockSubmit} isLoading={true} error={null} />);

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(
      /password/i,
    ) as HTMLInputElement;
    const submitButton = screen.getByRole("button", {
      name: /logging in/i,
    }) as HTMLButtonElement;

    expect(emailInput.disabled).toBe(true);
    expect(passwordInput.disabled).toBe(true);
    expect(submitButton.disabled).toBe(true);
  });

  it("should require email and password fields", () => {
    const mockSubmit = jest.fn();
    render(<LoginForm onSubmit={mockSubmit} isLoading={false} error={null} />);

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(
      /password/i,
    ) as HTMLInputElement;

    expect(emailInput.required).toBe(true);
    expect(passwordInput.required).toBe(true);
  });
});
