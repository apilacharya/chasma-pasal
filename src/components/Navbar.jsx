import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Link } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";

import { Link as ScrollLink } from "react-scroll";

const NavbarComponent = () => {
  const user = JSON.parse(localStorage.getItem("userData"));

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name_asc");
  const [products, setProducts] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    window.location.href = "/login"; // Redirect to login page after logout
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    applySearchSort(products, value, sortBy);
  };

  const handleSort = (value) => {
    setSortBy(value);
    applySearchSort(products, searchQuery, value);
  };

  const applySearchSort = (products, searchQuery, sortBy) => {
    let filteredProducts = products;
    if (searchQuery) {
      filteredProducts = filteredProducts.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (sortBy === "price_asc") {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name_asc") {
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "name_desc") {
      filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
    }
    setProducts(filteredProducts);
  };

  return (
    // <nav
    //   className='navbar d-flex justify-content-between align-items-center navbar-expand-lg navbar-light ps-5 pt-2 pb-2'
    //   style={{ backgroundColor: "black" }}
    // >
    //   <Link className='navbar-brand d-flex align-items-center ms-1' to='/'>
    //     <img
    //       src='/assets/icon/main-logo.png'
    //       alt='Logo'
    //       height={70}
    //       className='d-inline-block align-text-top'
    //     />
    //     {/* <span className='ml-1'>Chasma-Pasal</span> */}
    //   </Link>
    //   <button
    //     className='navbar-toggler'
    //     type='button'
    //     data-bs-toggle='collapse'
    //     data-bs-target='#navbarNav'
    //     aria-controls='navbarNav'
    //     aria-expanded='false'
    //     aria-label='Toggle navigation'
    //   >
    //     <RxHamburgerMenu color='white' size={30} />
    //   </button>

    //   <div
    //     className='collapse navbar-collapse d-flex flex-row align-items-center justify-content-end gap-5 pe-5'
    //     id='navbarNav'
    //   >
    //     <form className='w-25 position-relative' role='search'>
    //       <input
    //         onSearch={handleSearch}
    //         type='text'
    //         className='form-control me-2'
    //         placeholder='Search'
    //         aria-label='Search'
    //       />
    //       <FaSearch
    //         className='position-absolute top-50 end-0 translate-middle-y me-3'
    //         style={{ color: "black" }}
    //       />
    //     </form>
    //     <div>
    //       <Link to='/cart' className='nav-link'>
    //         <FaShoppingCart size={28} style={{ color: "white" }} />
    //       </Link>
    //     </div>
    //     <form className='d-flex' role='search'>
    //       {user ? (
    //         <div className='dropdown'>
    //           <a
    //             className='btn  dropdown-toggle'
    //             style={{ background: "white", color: "black" }}
    //             role='hover'
    //             data-bs-toggle='dropdown'
    //             aria-expanded='false'
    //           >
    //             Hello, {user.username}
    //           </a>
    //           <ul className='dropdown-menu'>
    //             <li>
    //               <a className='dropdown-item' href='/profile'>
    //                 Profile
    //               </a>
    //             </li>
    //             <li>
    //               <a className='dropdown-item' href='/orderlist'>
    //                 Orders
    //               </a>
    //             </li>
    //             <li>
    //               <a className='dropdown-item' href='/address'>
    //                 Address
    //               </a>
    //             </li>
    //             <li>
    //               <a className='dropdown-item' href='/cart'>
    //                 Cart
    //               </a>
    //             </li>
    //             <li>
    //               <hr
    //                 className='dropdown-divider'
    //                 style={{ background: "red" }}
    //               />
    //             </li>
    //             <li>
    //               <Link
    //                 onClick={handleLogout}
    //                 className='dropdown-item'
    //                 to='/login'
    //               >
    //                 Logout
    //               </Link>
    //             </li>
    //           </ul>
    //         </div>
    //       ) : (
    //         <Link
    //           to='/login'
    //           className='btn'
    //           style={{
    //             backgroundColor: "white",

    //             color: "black",
    //           }}
    //         >
    //           Login
    //         </Link>
    //       )}
    //     </form>
    //   </div>
    // </nav>

    <Navbar expand='lg' className='py-3 bg-black'>
      <Container className='bg-black'>
        {/* Logo */}
        <Link to='/'>
          <Navbar.Brand className='d-flex align-items-center'>
            <img
              src='/assets/icon/main-logo.png'
              alt='Logo'
              height={50}
              className='me-2'
            />
          </Navbar.Brand>
        </Link>

        {/* Toggler */}
        <Navbar.Toggle aria-controls='navbarNav'>
          <RxHamburgerMenu size={30} className='text-white' />
        </Navbar.Toggle>

        {/* Navbar Collapse */}
        <Navbar.Collapse id='navbarNav'>
          <Nav className='ms-auto d-flex align-items-center gap-4'>
            {/* Search Box */}
            {/* <Form className='d-flex position-relative'>
              <Form.Control
                type='search'
                placeholder='Search'
                className='me-2'
                aria-label='Search'
                onChange={handleSearch}
                style={{ minWidth: "200px" }}
              />
              <FaSearch
                className='position-absolute top-50 end-0 translate-middle-y me-3'
                style={{ color: "gray" }}
              />
            </Form> */}

            {/* Cart Icon */}
            <Nav.Link>
              <Link to='/cart'>
                <FaShoppingCart size={24} className='text-white' />
              </Link>
            </Nav.Link>

            {/* User Dropdown */}
            {user ? (
              <NavDropdown
                title={`Hello, ${user.username}`}
                className='btn btn-sm btn-light py-0 text-xs'
              >
                <NavDropdown.Item as={Link} to='/profile'>
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to='/orderlist'>
                  Orders
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to='/address'>
                  Address
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to='/cart'>
                  Cart
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout} as={Link} to='/login'>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Link to='/login'>
                <Button variant='light'>Login</Button>
              </Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
