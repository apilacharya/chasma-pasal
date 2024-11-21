import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    addToCartApi,
    createReviewApi,
    getReviewsByProductID,
    getSingleProduct,
    getUserDataById,
} from '../../apis/api';
import ProductDescription from './ProdictDescription';

jest.mock('../../apis/api', () => ({
    addToCartApi: jest.fn(),
    createReviewApi: jest.fn(),
    getReviewsByProductID: jest.fn(),
    getSingleProduct: jest.fn(),
    getUserDataById: jest.fn(),
}));

jest.mock('react-toastify', () => ({
    toast: {
        error: jest.fn(),
        success: jest.fn(),
    },
}));

const mockUser = {
    id: 'user123',
    fullname: 'Test User',
};

localStorage.setItem('userData', JSON.stringify(mockUser));

describe('ProductDescription', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders loading state initially', () => {
        render(
            <Router>
                <ProductDescription />
            </Router>
        );
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('fetches and displays product details and reviews', async () => {
        const mockProduct = {
            productName: 'Test Product',
            productPrice: 100,
            productCategory: 'Test Category',
            productDescription: 'Test Description',
            productImage: 'test.jpg',
        };

        const mockReviews = [
            {
                userID: 'user123',
                rating: 4,
                review: 'Great product!',
            },
        ];

        getSingleProduct.mockResolvedValue({ data: { data: mockProduct } });
        getReviewsByProductID.mockResolvedValue({ data: { review: mockReviews } });
        getUserDataById.mockResolvedValue({ data: { user: mockUser } });

        render(
            <Router>
                <ProductDescription />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByText('Test Product')).toBeInTheDocument();
            expect(screen.getByText('Rs.100')).toBeInTheDocument();
            expect(screen.getByText('Test Category')).toBeInTheDocument();
            expect(screen.getByText('Test Description')).toBeInTheDocument();
            expect(screen.getByText('Great product!')).toBeInTheDocument();
        });
    });

    test('handles adding items to cart', async () => {
        const mockProduct = {
            productName: 'Test Product',
            productPrice: 100,
            productCategory: 'Test Category',
            productDescription: 'Test Description',
            productImage: 'test.jpg',
        };

        getSingleProduct.mockResolvedValue({ data: { data: mockProduct } });
        getReviewsByProductID.mockResolvedValue({ data: { review: [] } });

        addToCartApi.mockResolvedValue({ data: { success: true } });

        render(
            <Router>
                <ProductDescription />
            </Router>
        );

        await waitFor(() => screen.getByText('Test Product'));

        fireEvent.click(screen.getByText('Add to cart'));

        await waitFor(() => {
            expect(addToCartApi).toHaveBeenCalledWith(expect.any(FormData));
            expect(toast.success).toHaveBeenCalledWith('Item added to cart successfully!');
        });
    });

    test('handles review submission', async () => {
        const mockProduct = {
            productName: 'Test Product',
            productPrice: 100,
            productCategory: 'Test Category',
            productDescription: 'Test Description',
            productImage: 'test.jpg',
        };

        getSingleProduct.mockResolvedValue({ data: { data: mockProduct } });
        getReviewsByProductID.mockResolvedValue({ data: { review: [] } });

        createReviewApi.mockResolvedValue({ data: { success: true, message: 'Review submitted!' } });

        render(
            <Router>
                <ProductDescription />
            </Router>
        );

        await waitFor(() => screen.getByText('Test Product'));

        fireEvent.change(screen.getByPlaceholderText('Write your review'), {
            target: { value: 'Amazing product!' },
        });
        fireEvent.click(screen.getByText('Submit Review'));

        await waitFor(() => {
            expect(createReviewApi).toHaveBeenCalledWith(expect.any(FormData));
            expect(toast.success).toHaveBeenCalledWith('Review submitted!');
        });
    });
});
