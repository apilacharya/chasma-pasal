import React from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const FooterCard = () => {
  return (
    <>
      <div id='footer' className='w-100' style={{ backgroundColor: "#212529" }}>
        <div className='container text-light bg-dark pb-0'>
          <div className='upper-footer  row'>
            <div className='need-help col-12 col-md-8 col-lg-4 mb-5'>
              <div className='help-box p-3'>
                <h5>Need Help?</h5>
                <div
                  className='underline'
                  style={{
                    height: "2px",
                    width: "30px",
                    backgroundColor: "#D29062",
                  }}
                ></div>
                <div className='details mt-5 d-flex align-items-center gap-4'>
                  <div className='text m-0 p-0'>
                    <p className='text-light'>Got Questions? Call us 24/7!</p>
                    <span className=' fw-bold' style={{ color: "#D29062" }}>
                      Call Us:{" "}
                    </span>
                    <span className='fw-bold '> (+977) 9860708090</span>
                  </div>
                </div>
              </div>
              <div className='contact-info mt-5'>
                <h5>Contact Info</h5>
                <div
                  className='underline'
                  style={{
                    height: "2px",
                    width: "30px",
                    backgroundColor: "#D29062",
                  }}
                ></div>

                <p className='mt-4 text-light'>Email: chasmapasal@gmail.com</p>
                <p className='text-light'>Location: Kathmandu, Nepal</p>
              </div>

              <div className='social-links d-flex gap-3'>
                <a
                  href={"/"}
                  target='_blank'
                  className='link-box d-flex justify-content-center align-items-center p-1 rounded text-light'
                  style={{ width: "30px" }}
                >
                  <FaFacebook size={20} />
                </a>
                <a
                  href={"/"}
                  target='_blank'
                  className='link-box d-flex justify-content-center align-items-center p-1 rounded text-light'
                  style={{ width: "30px" }}
                >
                  <FaInstagram size={20} />
                </a>
                <a
                  href={"/"}
                  target='_blank'
                  className='link-box d-flex justify-content-center align-items-center p-1 rounded text-light'
                  style={{ width: "30px" }}
                >
                  <FaTwitter size={20} />
                </a>
              </div>
            </div>
            <div className='company-info  col-12 col-md-6 col-lg-2'>
              <div className=' p-3'>
                <h5>Company</h5>
                <div
                  className='underline'
                  style={{
                    height: "2px",
                    width: "30px",
                    backgroundColor: "#D29062",
                  }}
                ></div>

                <ul
                  className='mt-5 d-flex flex-column gap-4 ps-0'
                  style={{ listStyle: "none" }}
                >
                  <li>
                    <a
                      className='text-light'
                      style={{ textDecoration: "none" }}
                    >
                      Careers
                    </a>
                  </li>
                  <li>
                    <a
                      className='text-light'
                      style={{ textDecoration: "none" }}
                    >
                      Terms Of Use
                    </a>
                  </li>
                  <li>
                    <a
                      className='text-light'
                      style={{ textDecoration: "none" }}
                    >
                      Privacy Statement
                    </a>
                  </li>
                  <li>
                    <a
                      className='text-light'
                      style={{ textDecoration: "none" }}
                    >
                      Feedbacks
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className='support-info col-12 col-md-6 col-lg-2'>
              <div className=' p-3'>
                <h5>Support</h5>
                <div
                  className='underline'
                  style={{
                    height: "2px",
                    width: "30px",
                    backgroundColor: "#D29062",
                  }}
                ></div>

                <ul
                  className='mt-5 d-flex flex-column gap-4 ps-0'
                  style={{ listStyle: "none" }}
                >
                  <li>
                    <a
                      className='text-light'
                      style={{ textDecoration: "none" }}
                    >
                      Account
                    </a>
                  </li>
                  <li>
                    <a
                      className='text-light'
                      style={{ textDecoration: "none" }}
                    >
                      Legal
                    </a>
                  </li>
                  <li>
                    <a
                      className='text-light'
                      style={{ textDecoration: "none" }}
                    >
                      Affiliate Program
                    </a>
                  </li>
                  <li>
                    <a
                      className='text-light'
                      style={{ textDecoration: "none" }}
                    >
                      Privacy Policy
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className='subscription-info col-12 col-md-8 col-lg-4'>
              <div className=' p-3'>
                <h5>About Us</h5>
                <div
                  className='underline'
                  style={{
                    height: "2px",
                    width: "30px",
                    backgroundColor: "#D29062",
                  }}
                ></div>
                <p className='text-white'>
                  Chasma Pasal – Your one-stop shop for stylish and high-quality
                  eyewear. Explore a wide range of frames, sunglasses, and
                  prescription glasses to suit your style and vision needs. See
                  the world clearly with us!
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className=' w-100'>
          <div className='copyright-info text-light container bg-dark d-flex flex-column gap-4 align-items-center flex-lg-row justify-content-between pt-0 w-100 text-center'>
            <span className='text-center text-light w-100'>
              Chasma Pasal - {new Date().toISOString().split("-")[0]} &copy; All
              rights reserved.
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default FooterCard;
