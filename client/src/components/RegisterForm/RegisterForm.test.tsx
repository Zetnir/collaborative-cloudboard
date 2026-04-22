import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RegisterForm } from "../RegisterForm";

describe("RegisterForm", () => {
  it("should render all register form fields", () => {
    const mockSubmit = jest.fn();
    render(
      <RegisterForm onSubmit={mockSubmit} isLoading={false} error={null} />,
    );

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign up/i }),
    ).toBeInTheDocument();
  });

  it("should call onSubmit with form data excluding confirmPassword", async () => {
    const mockSubmit = jest.fn().mockResolvedValue(undefined);
    render(
      <RegisterForm onSubmit={mockSubmit} isLoading={false} error={null} />,
    );

    const firstNameInput = screen.getByLabelText(
      /first name/i,
    ) as HTMLInputElement;
    const lastNameInput = screen.getByLabelText(
      /last name/i,
    ) as HTMLInputElement;
    const usernameInput = screen.getByLabelText(
      /username/i,
    ) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/^email/i) as HTMLInputElement;
    const passwordInput = screen.getByDisplayValue("");
    const confirmPasswordInput = screen.getByLabelText(
      /confirm password/i,
    ) as HTMLInputElement;
    const submitButton = screen.getByRole("button", { name: /sign up/i });

    fireEvent.change(firstNameInput, { target: { value: "John" } });
    fireEvent.change(lastNameInput, { target: { value: "Doe" } });
    fireEvent.change(usernameInput, { target: { value: "johndoe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });

    // Get password inputs more specifically
    const inputs = screen.getAllByPlaceholderText(
      /••••••••/i,
    ) as HTMLInputElement[];
    fireEvent.change(inputs[0], { target: { value: "password123" } });
    fireEvent.change(inputs[1], { target: { value: "password123" } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        username: "johndoe",
        email: "john@example.com",
        password: "password123",
        firstName: "John",
        lastName: "Doe",
      });
    });
  });

  it("should show error when passwords don't match", async () => {
    const mockSubmit = jest.fn();
    render(
      <RegisterForm onSubmit={mockSubmit} isLoading={false} error={null} />,
    );

    const inputs = screen.getAllByPlaceholderText(
      /••••••••/i,
    ) as HTMLInputElement[];
    fireEvent.change(inputs[0], { target: { value: "password123" } });
    fireEvent.change(inputs[1], { target: { value: "different123" } });

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it("should disable submit button when passwords don't match", async () => {
    const mockSubmit = jest.fn();
    render(
      <RegisterForm onSubmit={mockSubmit} isLoading={false} error={null} />,
    );

    const inputs = screen.getAllByPlaceholderText(
      /••••••••/i,
    ) as HTMLInputElement[];
    const submitButton = screen.getByRole("button", {
      name: /sign up/i,
    }) as HTMLButtonElement;

    fireEvent.change(inputs[0], { target: { value: "password123" } });
    fireEvent.change(inputs[1], { target: { value: "different123" } });

    await waitFor(() => {
      expect(submitButton.disabled).toBe(true);
    });
  });

  it("should display error message", () => {
    const mockSubmit = jest.fn();
    const errorMessage = "Email already exists";
    render(
      <RegisterForm
        onSubmit={mockSubmit}
        isLoading={false}
        error={errorMessage}
      />,
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("should disable form when loading", () => {
    const mockSubmit = jest.fn();
    render(
      <RegisterForm onSubmit={mockSubmit} isLoading={true} error={null} />,
    );

    const firstNameInput = screen.getByLabelText(
      /first name/i,
    ) as HTMLInputElement;
    const submitButton = screen.getByRole("button", {
      name: /creating account/i,
    }) as HTMLButtonElement;

    expect(firstNameInput.disabled).toBe(true);
    expect(submitButton.disabled).toBe(true);
  });
});
