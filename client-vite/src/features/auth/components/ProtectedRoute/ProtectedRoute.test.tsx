import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import { ProtectedRoute } from "./ProtectedRoute";
import { useAuth } from "../../hooks/AuthContext";

jest.mock("../AuthContext");

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe("ProtectedRoute", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render loading state when isLoading is true", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: true,
      error: null,
      refreshAuth: jest.fn(),
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      isAuthenticated: false,
      clearError: jest.fn(),
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
        role: "user",
      },
      isLoading: false,
      error: null,
      refreshAuth: jest.fn(),
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      isAuthenticated: true,
      clearError: jest.fn(),
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
      isLoading: false,
      error: null,
      refreshAuth: jest.fn(),
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      isAuthenticated: false,
      clearError: jest.fn(),
    });

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </BrowserRouter>,
    );

    // When redirected, the protected content should not be visible
    expect(screen.queryByText(/protected content/i)).not.toBeInTheDocument();
  });

  it("should render content when user has required role", () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: "1",
        username: "admin",
        email: "admin@example.com",
        firstName: "Admin",
        lastName: "User",
        role: "admin",
      },
      isLoading: false,
      error: null,
      refreshAuth: jest.fn(),
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      isAuthenticated: true,
      clearError: jest.fn(),
    });

    render(
      <BrowserRouter>
        <ProtectedRoute requiredRoles={["admin"]}>
          <div>Admin Content</div>
        </ProtectedRoute>
      </BrowserRouter>,
    );

    expect(screen.getByText(/admin content/i)).toBeInTheDocument();
  });

  it("should redirect to unauthorized when user lacks required role", () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: "1",
        username: "user",
        email: "user@example.com",
        firstName: "Regular",
        lastName: "User",
        role: "user",
      },
      isLoading: false,
      error: null,
      refreshAuth: jest.fn(),
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      isAuthenticated: true,
      clearError: jest.fn(),
    });

    render(
      <BrowserRouter>
        <ProtectedRoute requiredRoles={["admin"]}>
          <div>Admin Content</div>
        </ProtectedRoute>
      </BrowserRouter>,
    );

    // Content should not be visible when role doesn't match
    expect(screen.queryByText(/admin content/i)).not.toBeInTheDocument();
  });
});
