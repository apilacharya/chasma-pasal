import React from "react";
import { Link } from "react-router-dom";

const AdminNav = () => {
    const user = JSON.parse(localStorage.getItem("userData"));
    const handleLogout = () => {
        localStorage.removeItem("userData");
        window.location.href = "/login"; // Redirect to login page after logout
    };

    return (
        <>

            <nav
                className='sidebar pe-0 h-100'
                style={{ flexGrow: "0", minHeight: "100vh" }}
            >
                <ul className='navbar-nav flex-column'>
                    {/* <li className="nav-item"><Link to="/dashboard" className="nav-link">Dashboard</Link></li> */}
                    <div className='logo mb-3'>
                        <Link className='navbar-brand d-flex align-items-center ms-1'>
                            <img
                                src='/assets/icon/tipsy.png'
                                alt='Logo'
                                width='40'
                                height='40'
                            // className=' align-text-top'
                            />
                            <h2 className='ml-1'>Tipsy</h2>
                        </Link>
                    </div>
                    <li className='nav-item'>
                        <Link
                            to='/admin'
                            className='nav-link'
                            style={{ fontSize: "1rem" }}
                        >
                            Products
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link
                            to='/admin/order'
                            className='nav-link'
                            style={{ fontSize: "1rem" }}
                        >
                            Orders
                        </Link>
                    </li>
                    {/* <li className="nav-item"><Link to="/statistics" className="nav-link">Statistics</Link></li> */}
                    {/* <li className="nav-item"><Link to="/reviews" className="nav-link">Reviews</Link></li> */}
                    <li className='nav-item'>
                        <Link
                            to='/admin/customers'
                            className='nav-link'
                            style={{ fontSize: "1rem" }}
                        >
                            Customers
                        </Link>
                    </li>

                    {/* <li className="nav-item"><Link to="/profile" className="nav-link">Profile</Link></li> */}
                    <li className='nav-item'>
                        <Link
                            onClick={handleLogout}
                            className='nav-link'
                            style={{ fontSize: "1rem" }}
                        >
                            Log Out
                        </Link>
                    </li>
                </ul>
            </nav>
        </>
    );
};

export default AdminNav;