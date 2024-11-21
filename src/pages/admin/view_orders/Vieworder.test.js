import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { toast } from 'react-toastify';
import ViewOrders from './ViewOrders';
import { getallOrdersApi, getSingleProduct, updateOrderApi } from '../../../apis/api';

jest.mock('../../../apis/api');
jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

describe('ViewOrders Component', () => {
    const mockOrders = [
        {
            _id: 'order1',
            carts: [
                { _id: 'cart1', productID: 'product1' },
                { _id: 'cart2', productID: 'product2' },
            ],
            paymentType: 'Credit Card',
            status: 'pending',
        },
        {
            _id: 'order2',
            carts: [{ _id: 'cart3', productID: 'product3' }],
            paymentType: 'Paypal',
            status: 'shipping',
        },
    ];

    const mockProducts = {
        product1: { productName: 'Product 1' },
        product2: { productName: 'Product 2' },
        product3: { productName: 'Product 3' },
    };

    beforeEach(() => {
        getallOrdersApi.mockResolvedValue({ data: { orders: mockOrders } });
        getSingleProduct.mockImplementation((id) =>
            Promise.resolve({ data: { data: mockProducts[id] } })
        );
        updateOrderApi.mockResolvedValue({ data: { success: true } });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders loading state initially', async () => {
        render(<ViewOrders />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('fetches and displays orders', async () => {
        render(<ViewOrders />);
        
        await waitFor(() => expect(getallOrdersApi).toHaveBeenCalledTimes(1));

        await waitFor(() => {
            expect(screen.getByText('order1')).toBeInTheDocument();
            expect(screen.getByText('Product 1')).toBeInTheDocument();
            expect(screen.getByText('Product 2')).toBeInTheDocument();
            expect(screen.getByText('Credit Card')).toBeInTheDocument();
            expect(screen.getByText('pending')).toBeInTheDocument();
        });

        expect(screen.getByText('order2')).toBeInTheDocument();
        expect(screen.getByText('Product 3')).toBeInTheDocument();
        expect(screen.getByText('Paypal')).toBeInTheDocument();
        expect(screen.getByText('shipping')).toBeInTheDocument();
    });

    test('updates order status', async () => {
        render(<ViewOrders />);

        await waitFor(() => expect(getallOrdersApi).toHaveBeenCalledTimes(1));

        const statusSelects = screen.getAllByRole('combobox');
        fireEvent.change(statusSelects[0], { target: { value: 'shipping' } });

        await waitFor(() => expect(updateOrderApi).toHaveBeenCalledWith('order1', { status: 'shipping' }));

        expect(toast.success).toHaveBeenCalledWith('Order status updated successfully');
    });

    test('handles view order button click', async () => {
        render(<ViewOrders />);

        await waitFor(() => expect(getallOrdersApi).toHaveBeenCalledTimes(1));

        const viewButtons = screen.getAllByRole('button', { name: /view/i });
        fireEvent.click(viewButtons[0]);

        expect(screen.getByText('Order Details')).toBeInTheDocument(); // Assuming your modal displays this text
    });
});
