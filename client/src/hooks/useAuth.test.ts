import { renderHook, act, waitFor } from "@testing-library/react";
import { useAuth } from "./useAuth";
import { AuthService } from "../services/authService";

jest.mock("../services/authService");

const mockAuthService = new AuthService() as jest.Mocked<AuthService>;

describe("useAuth", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("should initialize with null user and token", () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("should login successfully", async () => {
    const mockUser = {
      id: "1",
      username: "testuser",
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
    };
    const mockToken = "test-token";

    mockAuthService.login.mockResolvedValueOnce({
      user: mockUser,
      token: mockToken,
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login({
        email: "test@example.com",
        password: "password123",
      });
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe(mockToken);
    expect(result.current.isAuthenticated).toBe(true);
    expect(localStorage.getItem("cloudboard_auth_token")).toBe(mockToken);
  });

  it("should register successfully", async () => {
    const mockUser = {
      id: "1",
      username: "newuser",
      email: "new@example.com",
      firstName: "New",
      lastName: "User",
    };
    const mockToken = "test-token";

    mockAuthService.register.mockResolvedValueOnce({
      user: mockUser,
      token: mockToken,
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.register({
        username: "newuser",
        email: "new@example.com",
        password: "password123",
        firstName: "New",
        lastName: "User",
      });
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe(mockToken);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it("should logout successfully", async () => {
    const mockUser = {
      id: "1",
      username: "testuser",
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
    };
    const mockToken = "test-token";

    mockAuthService.login.mockResolvedValueOnce({
      user: mockUser,
      token: mockToken,
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login({
        email: "test@example.com",
        password: "password123",
      });
    });

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem("cloudboard_auth_token")).toBeNull();
  });

  it("should handle login error", async () => {
    const errorMessage = "Invalid credentials";
    mockAuthService.login.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      try {
        await result.current.login({
          email: "test@example.com",
          password: "wrong",
        });
      } catch {
        // Error is expected
      }
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("should restore auth from localStorage on mount", async () => {
    const mockUser = {
      id: "1",
      username: "testuser",
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
    };
    const mockToken = "test-token";

    localStorage.setItem("cloudboard_auth_token", mockToken);
    localStorage.setItem("cloudboard_auth_user", JSON.stringify(mockUser));

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.token).toBe(mockToken);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });
});
