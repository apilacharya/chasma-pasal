import '@testing-library/jest-dom'; // Import jest-dom
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUserApi } from "../../apis/api";
import Login from "./Login"; // Update the import path if necessary

// Mock the API and toast functions
jest.mock("../../apis/api", () => ({
    loginUserApi: jest.fn(),
}));
jest.mock("react-toastify", () => ({
    toast: {
        error: jest.fn(),
        success: jest.fn(),
    },
}));

describe("Login Component", () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test
    });

    test("renders login form", () => {
        render(
            <Router>
                <Login />
            </Router>
        );

        expect(screen.getByText("Welcome Back!")).toBeInTheDocument();
        expect(screen.getByText("Email Address")).toBeInTheDocument();
        expect(screen.getByText("Password")).toBeInTheDocument();
        expect(screen.getByText("Forgot Password?")).toBeInTheDocument();
        expect(screen.getByText("Sign Up")).toBeInTheDocument();
    });

    test("shows validation errors for empty fields", async () => {
        render(
            <Router>
                <Login />
            </Router>
        );

        fireEvent.click(screen.getByText("Login"));

        await waitFor(() => {
            expect(screen.getByText("Email is required")).toBeInTheDocument();
            expect(screen.getByText("password is required")).toBeInTheDocument();
        });
    });

    test("calls loginUserApi and handles successful login", async () => {
        const mockResponse = {
            data: {
                success: true,
                message: "Login successful",
                token: "mockToken",
                userData: { name: "Test User" },
            },
        };
        loginUserApi.mockResolvedValue(mockResponse);

        render(
            <Router>
                <Login />
            </Router>
        );

        fireEvent.change(screen.getByPlaceholderText("Email Address"), {
            target: { value: "test@example.com" },
        });
        fireEvent.change(screen.getByPlaceholderText("Password"), {
            target: { value: "password123" },
        });
        fireEvent.click(screen.getByText("Login"));

        await waitFor(() => {
            expect(loginUserApi).toHaveBeenCalledWith({
                email: "test@example.com",
                password: "password123",
            });
            expect(toast.success).toHaveBeenCalledWith("Login successful");
            expect(localStorage.getItem("token")).toBe("mockToken");
            expect(localStorage.getItem("userData")).toBe(
                JSON.stringify({ name: "Test User" })
            );
        });
    });

    test("shows error message on failed login", async () => {
        const mockResponse = {
            data: {
                success: false,
                message: "Invalid credentials",
            },
        };
        loginUserApi.mockResolvedValue(mockResponse);

        render(
            <Router>
                <Login />
            </Router>
        );

        fireEvent.change(screen.getByPlaceholderText("Email Address"), {
            target: { value: "test@example.com" },
        });
        fireEvent.change(screen.getByPlaceholderText("Password"), {
            target: { value: "wrongpassword" },
        });
        fireEvent.click(screen.getByText("Login"));

        await waitFor(() => {
            expect(loginUserApi).toHaveBeenCalledWith({
                email: "test@example.com",
                password: "wrongpassword",
            });
            expect(toast.error).toHaveBeenCalledWith("Invalid credentials");
        });
    });

    test("navigates to forgot password and register pages", () => {
        render(
            <Router>
                <Login />
            </Router>
        );

        fireEvent.click(screen.getByText("Forgot Password?"));
        expect(window.location.pathname).toBe("/");

        fireEvent.click(screen.getByText("Sign Up"));
        expect(window.location.pathname).toBe("/");
    });
});
