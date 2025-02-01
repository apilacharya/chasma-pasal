import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getallOrdersApi,
  getSingleProduct,
  updateOrderApi,
} from "../../../apis/api";
import AdminNav from "../../../components/AdminNav";
import FooterCard from "../../../components/FooterCard";
import OrderDetailsModal from "./OrderDetailModel";

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [productsCache, setProductsCache] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getallOrdersApi();
        setOrders(data.data.orders || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        toast.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (orders.length === 0) return;

      const productPromises = orders.flatMap((order) =>
        (order.carts || []).map(async (item) => {
          const productId = item.productID;
          if (!productsCache[productId]) {
            try {
              const product = await getSingleProduct(productId);
              setProductsCache((prev) => ({
                ...prev,
                [productId]: product.data.data,
              }));
              return { productId, product: product.data.data };
            } catch (error) {
              console.error("Error fetching product details:", error);
              return {
                productId,
                product: { productName: "Unknown", price: 0 },
              };
            }
          }
          return { productId, product: productsCache[productId] };
        })
      );

      await Promise.all(productPromises);
    };

    fetchProductDetails();
  }, [orders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const updatedOrder = orders.find((order) => order._id === orderId);
      if (updatedOrder) {
        updatedOrder.status = newStatus;
        await updateOrderApi(orderId, { status: newStatus });
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? updatedOrder : order
          )
        );
        toast.success("Order status updated successfully");
      }
    } catch (err) {
      console.error("Error updating order status:", err);
      toast.error("Failed to update order status");
    }
  };

  const handleViewClick = (order) => {
    setSelectedOrder(order);
    setModalShow(true);
  };

  return (
    <>
      <div className='container-fluid'>
        <style>
          {`
                .container-fluid {
                    background-color: #FFFFFF;
                }

                .page-title {
                    color: #000000;
                    font-size: 2rem;
                    margin-bottom: 1rem;
                }

                .order-table {
                    border-collapse: separate;
                    border-spacing: 0 1rem;
                    width: 100%;
                }

                .table thead th {
                    background-color: black;
                    color: #FFFFFF;
                    font-weight: bold;
                }

                .table tbody tr {
                    background-color: #D8CEC4;
                    border-bottom: 1px solid #000000;
                }

                .table tbody tr:nth-child(even) {
                    background-color: #F5F5F5;
                }

                .product-item {
                    padding: 0.5rem;
                }

                .status-select {
                    width: 100%;
                }

                .view-btn {
                    background-color: black;
                    color: #FFFFFF;
                    border: none;
                    padding: 0.5rem 1rem;
                    cursor: pointer;
                }

                .view-btn:hover {
                    background-color: #D8CEC4;
                }

                @media (max-width: 768px) {
                    .order-table {
                        font-size: 0.875rem;
                    }
                }
                `}
        </style>

        <div className='row'>
          <AdminNav />
          <main className='col-md-9 ms-sm-auto col-lg-10 px-md-2 mt-2'>
            {loading ? (
              <div className='text-center'>Loading...</div>
            ) : (
              <div className='table-responsive'>
                <h1 className='page-title'>User Order Management</h1>

                <table className='table table-striped table-bordered order-table'>
                  <thead>
                    <tr>
                      <th className='bg-black'>Order Id</th>
                      <th className='bg-black'>Products Name</th>
                      <th className='bg-black'>Payment Method</th>
                      <th className='bg-black'>Status</th>
                      <th className='bg-black'>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td>{order._id}</td>
                        <td>
                          {order.carts && order.carts.length > 0 ? (
                            order.carts.map((item) => {
                              const product = productsCache[item.productID];
                              return product ? (
                                <div key={item._id} className='product-item'>
                                  <p>{product.productName || "Unknown"}</p>
                                </div>
                              ) : (
                                <p key={item._id}>Product details loading...</p>
                              );
                            })
                          ) : (
                            <p>No products</p>
                          )}
                        </td>
                        <td>{order.paymentType}</td>
                        <td>
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order._id, e.target.value)
                            }
                            className='form-select status-select'
                          >
                            <option value='pending'>Pending</option>
                            {/* <option value="confirm">Confirm</option> */}
                            <option value='shipping'>Shipping</option>
                            <option value='delivered'>Delivered</option>
                            <option value='cancel'>Canceled</option>
                          </select>
                        </td>
                        <td>
                          <button
                            className='view-btn'
                            onClick={() => handleViewClick(order)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </main>
        </div>
        <OrderDetailsModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          order={selectedOrder}
          productsCache={productsCache}
        />
      </div>
      <FooterCard />
    </>
  );
};

export default ViewOrders;
