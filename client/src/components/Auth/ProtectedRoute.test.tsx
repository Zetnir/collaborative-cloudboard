import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import * as authHook from "../../hooks/useAuth";

jest.mock("../../hooks/useAuth");

const mockUseAuth = authHook.useAuth as jest.MockedFunction<
  typeof authHook.useAuth
>;

describe("ProtectedRoute", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render loading state when isLoading is true", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      token: null,
      isLoading: true,
      error: null,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      isAuthenticated: false,
    });

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </BrowserRouter>,
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("should render protected content when authenticated", () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: "1",
        username: "test",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
      },
      token: "test-token",
      isLoading: false,
      error: null,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      isAuthenticated: true,
    });

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </BrowserRouter>,
    );

    expect(screen.getByText(/protected content/i)).toBeInTheDocument();
  });

  it("should redirect to auth when not authenticated", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      isAuthenticated: false,
    });

    const { container } = render(
      <BrowserRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </BrowserRouter>,
    );

    // When redirected, the protected content should not be visible
    expect(screen.queryByText(/protected content/i)).not.toBeInTheDocument();
  });
});
