import React, { useEffect, useState } from "react";
import { getAllProducts } from "../../apis/api";
import FooterCard from "../../components/FooterCard";
import ProductCard from "../../components/ProductCard";
import Form from "react-bootstrap/Form";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import "./Style.css";

const Banner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    "/assets/images/s1.png",
    "/assets/images/s2.png",
    "/assets/images/s3.jpeg",
    "/assets/images/s4.png",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // 8000ms = 8s

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className='banner-container' style={{ height: "250px" }}>
      <img
        src={images[currentIndex]}
        alt='banner'
        className='banner-image  object-fit-cover h-100'
      />
    </div>
  );
};

const categories = [
  { name: "Mens", img: "/assets/icon/mens.jpeg" },
  { name: "Women", img: "/assets/icon/women.jpeg" },
  { name: "Kids", img: "/assets/icon/kids.jpeg" },
];

const Pagination = ({ currentPage, totalPages, paginate }) => {
  return (
    <div className='pagination-container'>
      <button
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lt;
      </button>
      <input
        type='number'
        value={currentPage}
        onChange={(e) => paginate(Number(e.target.value))}
        min='1'
        max={totalPages}
        className='page-input'
      />
      <span>of {totalPages}</span>
      <button
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>
    </div>
  );
};

const Dashboard = () => {
  // State for all fetched products
  const [products, setProducts] = useState([]); //array
  const [productsToRender, setProductsToRender] = useState([]); //array
  const [userInput, setUserInput] = useState("");
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  const user = JSON.parse(localStorage.getItem("userData"));

  // Call API initially (page load) - set all fetched products to state
  useEffect(() => {
    getAllProducts()
      .then((res) => {
        //response : res.data.products (all products)
        setProducts(res.data.data);
        setProductsToRender(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (userInput.trim()) {
      setProductsToRender(
        products.filter(
          (product) =>
            product.productName
              .toLowerCase()
              .includes(userInput.toLowerCase()) ||
            product.productPrice == Number(userInput.toLowerCase()) ||
            product.productCategory.toLowerCase() == userInput.toLowerCase()
        )
      );
    } else {
      setProductsToRender(products);
    }
  }, [userInput]);

  // Calculate the products to display on the current page
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = productsToRender.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Change page
  const paginate = (pageNumber) => {
    if (pageNumber < 1) pageNumber = 1;
    if (pageNumber > Math.ceil(products.length / productsPerPage))
      pageNumber = Math.ceil(products.length / productsPerPage);
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className='dashboard'>
        <Banner />
        <div className='d-flex justify-content-between align-items-center'>
          <h4 className='pb-4 text-xl font-bold ms-5 mt-5'>Our Products</h4>
          <Form className='d-flex position-relative'>
            <Form.Control
              type='text'
              placeholder='Search Products'
              className='me-2 border-1 border-black'
              // aria-label='Search'
              value={userInput}
              onChange={(e) => {
                setUserInput(e.target.value);
              }}
              style={{ minWidth: "200px" }}
            />
            <FaSearch
              className='position-absolute top-50 end-0 translate-middle-y me-3'
              style={{ color: "gray" }}
            />
          </Form>
        </div>

        <div className='row  container'>
          {currentProducts.map((singleProduct, index) => (
            <div key={index} className='col-12 p-1 col-sm-6 col-lg-3 px-2 py-2'>
              <ProductCard productInformation={singleProduct} color={"green"} />
            </div>
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(products.length / productsPerPage)}
          paginate={paginate}
        />

        {user?.isAdmin ? (
          <div style={{ position: "fixed", bottom: "80px", right: "40px" }}>
            <button
              style={{
                backgroundColor: "red",
                padding: "15px",
                borderRadius: "30px",
                outline: "none",
                border: "2px solid black",
              }}
            >
              <a
                href='/admin'
                style={{ textDecoration: "none", color: "white" }}
              >
                Manage Products
              </a>
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
      <FooterCard />
    </>
  );
};

export default Dashboard;
