import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";

const OrderDetailsModal = ({ show, onHide, order, productsCache }) => {
  if (!order) return null;

  // Calculate the subtotal dynamically
  const subtotal = order.carts.reduce((acc, item) => {
    const product = productsCache[item.productID];
    const price = product ? product.productPrice : 0; // Fallback to 0 if product price isn't available
    return acc + item.quantity * price;
  }, 0);

  const modalStyles = {
    dialog: {
      maxWidth: "90vw",
      margin: "1.75rem auto",
    },
    content: {
      backgroundColor: "#FFFFFF", // White background
      borderRadius: "10px",
      border: "1px solid #D29062", // Warm Brown border
    },
    header: {
      backgroundColor: "#D8CEC4", // Light Beige
      borderBottom: "1px solid #D29062", // Warm Brown
    },
    title: {
      color: "#000000", // Black
    },
    body: {
      color: "#000000", // Black text color
    },
    details: {
      marginBottom: "20px",
    },
    summary: {
      textAlign: "right",
      marginTop: "1rem",
    },
    table: {
      marginTop: "1rem",
    },
    tableHeader: {
      backgroundColor: "#D8CEC4", // Light Beige header
      color: "#000000", // Black text color
    },
    tableRowEven: {
      backgroundColor: "#F8F9FA", // Slightly gray for alternating rows
    },
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      dialogClassName='custom-modal'
      style={modalStyles.dialog}
    >
      <Modal.Header closeButton style={modalStyles.header}>
        <Modal.Title style={modalStyles.title}>
          Chasma Pasal Billing Voucher
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={modalStyles.body}>
        <div style={modalStyles.details}>
          <p>
            <strong>Order ID:</strong> {order._id}
          </p>
          <p>
            <strong>User Name:</strong> {order.userId.fullname}
          </p>
          <p>
            <strong>Phone Number:</strong> {order.userId.phone}
          </p>
          <p>
            <strong>Address:</strong> {order.address}
          </p>
          <p>
            <strong>Payment Method:</strong> {order.paymentType}
          </p>
          <p>
            <strong>Status:</strong> {order.status}
          </p>
        </div>
        <hr />
        <h5>Products:</h5>
        <Table striped bordered hover size='sm' style={modalStyles.table}>
          <thead>
            <tr style={modalStyles.tableHeader}>
              <th>#</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.carts &&
            Array.isArray(order.carts) &&
            order.carts.length > 0 ? (
              order.carts.map((item, index) => {
                const product = productsCache[item.productID];
                const price = product ? product.productPrice : 0; // Fallback to 0 if product price isn't available
                return (
                  <tr
                    key={item._id}
                    style={index % 2 === 0 ? {} : modalStyles.tableRowEven}
                  >
                    <td>{index + 1}</td>
                    <td>{product ? product.productName : "Unknown"}</td>
                    <td>{item.quantity}</td>
                    <td>{price}</td>
                    <td>{item.quantity * price}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan='5' className='text-center'>
                  No products
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        <hr />
        <div style={modalStyles.summary}>
          <p>
            <strong>Subtotal:</strong> {subtotal}
          </p>
          <p>
            <strong>Shipping:</strong> {order.total - subtotal}
          </p>
          <p>
            <strong>Total:</strong> {order.total}
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrderDetailsModal;
