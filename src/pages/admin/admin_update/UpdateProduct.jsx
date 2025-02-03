import React, { useEffect, useState } from "react";
import { Button, Card, Form, Modal } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getSingleProduct, updateProduct } from "../../../apis/api";
import AdminNav from "../../../components/AdminNav";
import FooterCard from "../../../components/FooterCard";

const UpdateProduct = () => {
  const { id } = useParams();

  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productNewImage, setProductNewImage] = useState(null);
  const [previewNewImage, setPreviewNewImage] = useState(null);
  const [oldImage, setOldImage] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getSingleProduct(id)
      .then((res) => {
        setProductName(res.data.data.productName);
        setProductPrice(res.data.data.productPrice);
        setProductCategory(res.data.data.productCategory);
        setProductDescription(res.data.data.productDescription);
        setOldImage(res.data.data.productImage);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  const handleImage = (event) => {
    const file = event.target.files[0];
    setProductNewImage(file);
    setPreviewNewImage(URL.createObjectURL(file));
  };

  const handleUpdateProduct = () => {
    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("productPrice", productPrice);
    formData.append("productCategory", productCategory);
    formData.append("productDescription", productDescription);

    if (productNewImage) {
      formData.append("productImage", productNewImage);
    }

    updateProduct(id, formData)
      .then((res) => {
        if (res.status === 201) {
          toast.success(res.data.message);
        }
      })
      .catch((error) => {
        if (error.response.status === 500) {
          toast.error(error.response.data.message);
        } else if (error.response.status === 400) {
          toast.error(error.response.data.message);
        }
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setShowModal(true);
  };

  const handleConfirmUpdate = () => {
    setShowModal(false);
    handleUpdateProduct();
  };

  return (
    <>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-2 p-0'>
            <AdminNav />
          </div>
          <div className='col-7 d-flex flex-column align-items-center'>
            <h1 className='my-4' style={{ color: "black" }}>
              Update Product
            </h1>
            <div
              className='d-flex justify-content-between align-items-stretch'
              style={{
                maxWidth: "1100px",
                width: "95%",
                background: "black",
                borderRadius: "8px",
              }}
            >
              <div
                className='d-flex justify-content-center align-items-center'
                style={{ width: "50%", height: "600px" }}
              >
                <img
                  src={
                    previewNewImage ||
                    `http://localhost:3006/products/${oldImage}`
                  }
                  alt='Product Image'
                  style={{
                    maxHeight: "100%",
                    maxWidth: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
              <div
                className='d-flex justify-content-center align-items-center'
                style={{ width: "50%", height: "600px" }}
              >
                <Card
                  className='shadow-sm border-0'
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "#D8CEC4",
                  }}
                >
                  <Card.Body>
                    <Form onSubmit={handleSubmit}>
                      <Form.Group className='mb-3 w-100'>
                        <Form.Label>Product Name</Form.Label>
                        <Form.Control
                          type='text'
                          value={productName}
                          onChange={(e) => setProductName(e.target.value)}
                          style={{ borderColor: "black" }}
                          required
                        />
                      </Form.Group>

                      <Form.Group className='mb-3 w-100'>
                        <Form.Label>Product Price</Form.Label>
                        <Form.Control
                          type='number'
                          value={productPrice}
                          onChange={(e) => setProductPrice(e.target.value)}
                          style={{ borderColor: "black" }}
                          required
                        />
                      </Form.Group>

                      <Form.Group className='mb-3 w-100'>
                        <Form.Label>Category</Form.Label>
                        <Form.Select
                          value={productCategory}
                          onChange={(e) => setProductCategory(e.target.value)}
                          style={{ borderColor: "black" }}
                          required
                        >
                          <option value='' disabled>
                            Select a category
                          </option>
                          <option value='men'>Men</option>
                          <option value='women'>Women</option>
                          <option value='kids'>Kids</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className='mb-3 w-100'>
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          as='textarea'
                          rows={3}
                          value={productDescription}
                          onChange={(e) =>
                            setProductDescription(e.target.value)
                          }
                          style={{ borderColor: "black" }}
                          required
                        />
                      </Form.Group>

                      <Form.Group className='mb-3 w-100'>
                        <Form.Label>Product Image</Form.Label>
                        <Form.Control
                          type='file'
                          onChange={handleImage}
                          style={{ borderColor: "black" }}
                        />
                      </Form.Group>

                      <Button
                        type='submit'
                        className='w-100'
                        style={{
                          backgroundColor: "black",
                          borderColor: "black",
                        }}
                      >
                        Update Product
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </div>
          <FooterCard />
        </div>
      </div>

      {/* Modal for confirmation */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to update this product?</Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            style={{ background: "black", borderColor: "black" }}
            onClick={handleConfirmUpdate}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UpdateProduct;
