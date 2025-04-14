import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { FaEdit, FaTrash } from "react-icons/fa"; // Import icons
import { toast } from "react-toastify";
import {
  createAddress,
  deleteAddress,
  editAddress,
  getAddress,
} from "../../apis/api.js";
import FooterCard from "../../components/FooterCard.jsx";
import "./AddressForm.css"; // Import custom CSS for hover effect

const AddressForm = () => {
  const user = JSON.parse(localStorage.getItem("userData"));
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({
    userId: user ? user._id : "",
    city: "",
    address: "",
    landmark: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (user && user._id) {
        try {
          const response = await getAddress(user._id);
          if (response.data && Array.isArray(response.data.addresses)) {
            setAddresses(response.data.addresses.filter((addr) => addr)); // Filter out any null/undefined values
          } else {
            toast.error("No addresses found");
          }
        } catch (error) {
          console.error("Error fetching addresses:", error);
        }
      } else {
        toast.error("User not found");
      }
    };
    fetchAddresses();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle phone number separately to ensure valid format
    if (name === "phoneNumber") {
      // Remove any non-digit characters
      const cleanedValue = value.replace(/\D/g, "");
      // Ensure the value has exactly 10 digits
      if (cleanedValue.length <= 10) {
        setForm({ ...form, [name]: cleanedValue });
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAddressId) {
        // Edit existing address
        const response = await editAddress(editingAddressId, form);
        if (response.data.success) {
          toast.success(response.data.message);
          setAddresses(
            addresses.map((addr) =>
              addr._id === editingAddressId ? response.data.address : addr
            )
          );
        } else {
          toast.error(response.data.message);
        }
      } else {
        // Create new address
        const response = await createAddress(form);
        if (response.data.success) {
          toast.success("Address added successfully");
          setAddresses([...addresses, response.data.address]);
        } else {
          toast.error(response.data.message);
        }
      }
      resetForm();
    } catch (error) {
      toast.error("Failed to save address. Please try again.");
    }
  };

  const handleDelete = async (addressId) => {
    const confirmDialog = window.confirm(
      "Are you sure you want to delete this address?"
    );
    if (confirmDialog) {
      try {
        const response = await deleteAddress(addressId);
        if (response.data.success) {
          toast.success("Address deleted successfully");
          setAddresses(
            addresses.filter((address) => address._id !== addressId)
          );
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error("Failed to delete address. Please try again.");
      }
    }
  };

  const handleUpdate = (address) => {
    setForm({
      userId: address.userId,
      city: address.city,
      address: address.address,
      landmark: address.landmark,
    });
    setEditingAddressId(address._id);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setForm({
      userId: user ? user._id : "",
      city: "",
      address: "",
      landmark: "",
    });
    setEditingAddressId(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className=' p-4' style={{ backgroundColor: "white" }}>
        <div className='d-flex justify-content-between align-items-center mb-3'>
          <h1 className='h2' style={{ color: "#111" }}>
            Shipping Addresses
          </h1>
          <Button
            variant='primary'
            onClick={() => setIsModalOpen(true)}
            style={{ backgroundColor: "#111", borderColor: "#111" }}
          >
            Add Address
          </Button>
        </div>

        <Modal
          show={isModalOpen}
          onHide={resetForm}
          dialogClassName='modal-90w'
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {editingAddressId ? "Edit Address" : "Add New Address"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: "#F8F9FA" }} className='w-100'>
            <Form onSubmit={handleSubmit} className='w-100'>
              <Form.Group controlId='formCity' className='mb-3 w-100'>
                <Form.Label>City</Form.Label>
                <Form.Control
                  type='text'
                  name='city'
                  placeholder='Enter city'
                  value={form.city}
                  className='w-100'
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId='formAddress' className='mb-3 w-100'>
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type='text'
                  name='address'
                  className='w-100'
                  placeholder='Enter full address'
                  value={form.address}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId='formLandmark' className='mb-3 w-100'>
                <Form.Label>Landmark</Form.Label>
                <Form.Control
                  type='text'
                  name='landmark'
                  className='w-100'
                  placeholder='Enter landmark'
                  value={form.landmark}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Button variant='success' type='submit' className='w-100'>
                {editingAddressId ? "Update Address" : "Save Address"}
              </Button>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='danger' onClick={resetForm}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <div className='row'>
          {addresses.length > 0 ? (
            addresses.map((address, index) => {
              if (!address) {
                return null; // Skip if address is undefined
              }
              return (
                <div className='col-md-4 mb-4' key={address._id}>
                  <Card
                    className='address-card'
                    style={{ backgroundColor: "#5d5d5d" }}
                  >
                    <Card.Body>
                      <Card.Title style={{ color: "#111" }}>
                        <strong>Address {index + 1}</strong>
                      </Card.Title>
                      <Card.Text style={{ color: "black" }}>
                        <strong>City:</strong>{" "}
                        {address.city || "City not available"}
                        <br />
                        <strong>Address:</strong>{" "}
                        {address.address || "Address not available"}
                        <br />
                        <strong>Landmark:</strong>{" "}
                        {address.landmark || "Landmark not available"}
                      </Card.Text>
                      <div className='d-flex justify-content-between'>
                        <Button
                          variant='danger'
                          onClick={() => handleDelete(address._id)}
                          style={{
                            backgroundColor: "danger",
                            borderColor: "danger",
                          }}
                        >
                          <FaTrash />
                        </Button>
                        <Button
                          variant='primary'
                          onClick={() => handleUpdate(address)}
                          style={{
                            backgroundColor: "#111",
                            borderColor: "#111",
                          }}
                        >
                          <FaEdit />
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              );
            })
          ) : (
            <div className='col-12'>
              <div className='alert alert-info' role='alert'>
                No addresses available
              </div>
            </div>
          )}
        </div>
      </div>
      <FooterCard />
    </>
  );
};

export default AddressForm;
