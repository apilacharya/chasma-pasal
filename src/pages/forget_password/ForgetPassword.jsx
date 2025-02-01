// import React, { useState } from 'react';
// import { toast } from 'react-toastify';
// import { forgotPasswordApi, verifyOtpApi } from '../../apis/api';

// const ForgotPassword = () => {
//   const [phone, setPhone] = useState('');
//   const [isSent, setIsSent] = useState(false);
//   const [otp, setOtp] = useState('');
//   const [newPassword, setNewPassword] = useState('');

//   const handleSendOtp = (e) => {
//     e.preventDefault();

//     forgotPasswordApi({ phone }).then((res) => {
//       if (res.status === 200) {
//         toast.success(res.data.message);
//         setIsSent(true);
//       }
//     }).catch((error) => {
//       if (error.response.status === 400 || 500) {
//         toast.error(error.response.data.message);
//       }
//     });
//   };

//   const handleVerifyOtp = (e) => {
//     e.preventDefault();

//     const data = {
//       'phone': phone,
//       'otp': otp,
//       'newPassword': newPassword,
//     };

//     verifyOtpApi(data).then((res) => {
//       if (res.status === 200) {
//         toast.success(res.data.message);
//       }
//     }).catch((error) => {
//       if (error.response.status === 400 || 500) {
//         toast.error(error.response.data.message);
//       }
//     });
//   };

//   return (
//     <div style={{
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       justifyContent: 'center',
//       height: '100vh',
//       background: 'linear-gradient(to bottom, #ffa500, #fff)',
//       position: 'relative',
//       color: '#fff',
//     }}>
//       <div style={{
//         position: 'absolute',
//         top: '20px',
//         left: '20px',
//         textAlign: 'center',
//       }}>

//       </div>
//       <div style={{
//         background: 'rgba(255, 255, 255, 0.9)',
//         padding: '20px',
//         borderRadius: '8px',
//         boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//         textAlign: 'center',
//         maxWidth: '400px',
//         width: '100%',
//         color: '#333',
//       }}>
//         <h2 style={{ marginBottom: '20px' }}>Forgot Password</h2>
//         <form>
//           <div style={{ marginBottom: '15px', textAlign: 'left' }}>
//             <label htmlFor="phone" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Phone</label>
//             <div style={{ display: 'flex', alignItems: 'center' }}>
//               <span style={{ marginRight: '10px', fontWeight: 'bold' }}>+977</span>
//               <input
//                 disabled={isSent}
//                 onChange={(e) => setPhone(e.target.value)}
//                 type="number"
//                 className="form-control"
//                 placeholder="Enter valid phone number"
//                 style={{
//                   width: '100%',
//                   padding: '10px',
//                   border: '1px solid #ccc',
//                   borderRadius: '4px',
//                   background: '#f9f9f9',
//                 }}
//               />
//             </div>
//           </div>
//           <button
//             disabled={isSent}
//             onClick={handleSendOtp}
//             className="btn btn-danger mt-2 w-100"
//             style={{
//               backgroundColor: '#28a745',
//               color: 'white',
//               padding: '10px 20px',
//               border: 'none',
//               borderRadius: '4px',
//               cursor: 'pointer',
//               fontSize: '1rem',
//               width: '100%',
//             }}
//           >
//             Send OTP
//           </button>

//           {isSent && (
//             <>
//               <hr />
//               <p>OTP has been sent to {phone} ✅</p>
//               <div style={{ marginBottom: '15px', textAlign: 'left' }}>
//                 <label htmlFor="otp" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>OTP</label>
//                 <input
//                   onChange={(e) => setOtp(e.target.value)}
//                   type="number"
//                   className="form-control"
//                   placeholder="Enter valid OTP Code!"
//                   style={{
//                     width: '100%',
//                     padding: '10px',
//                     border: '1px solid #ccc',
//                     borderRadius: '4px',
//                     background: '#f9f9f9',
//                   }}
//                 />
//               </div>
//               <div style={{ marginBottom: '15px', textAlign: 'left' }}>
//                 <label htmlFor="newPassword" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>New Password</label>
//                 <input
//                   onChange={(e) => setNewPassword(e.target.value)}
//                   type="password"
//                   className="form-control mt-2"
//                   placeholder="Set New Password!"
//                   style={{
//                     width: '100%',
//                     padding: '10px',
//                     border: '1px solid #ccc',
//                     borderRadius: '4px',
//                     background: '#f9f9f9',
//                   }}
//                 />
//               </div>
//               <button
//                 onClick={handleVerifyOtp}
//                 className="btn btn-primary w-100 mt-2"
//                 style={{
//                   backgroundColor: '#007bff',
//                   color: 'white',
//                   padding: '10px 20px',
//                   border: 'none',
//                   borderRadius: '4px',
//                   cursor: 'pointer',
//                   fontSize: '1rem',
//                   width: '100%',
//                 }}
//               >
//                 Verify OTP & Set Password
//               </button>
//             </>
//           )}
//         </form>
//       </div>

//     </div>
//   );
// };

// export default ForgotPassword;

import React, { useState } from "react";
import { toast } from "react-toastify";
import { forgotPasswordApi, verifyOtpApi } from "../../apis/api";

const ForgotPassword = () => {
  const [phone, setPhone] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSendOtp = (e) => {
    e.preventDefault();

    forgotPasswordApi({ phone })
      .then((res) => {
        if (res.status === 200) {
          toast.success(res.data.message);
          setIsSent(true);
        }
      })
      .catch((error) => {
        if (error.response.status === 400 || 500) {
          toast.error(error.response.data.message);
        }
      });
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();

    const data = {
      phone: phone,
      otp: otp,
      newPassword: newPassword,
    };

    verifyOtpApi(data)
      .then((res) => {
        if (res.status === 200) {
          toast.success(res.data.message);
        }
      })
      .catch((error) => {
        if (error.response.status === 400 || 500) {
          toast.error(error.response.data.message);
        }
      });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "white",
        color: "#333",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          textAlign: "center",
        }}
      ></div>
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          maxWidth: "400px",
          width: "100%",
          border: "1px solid #ccc",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Forgot Password</h2>
        <form>
          <div style={{ marginBottom: "15px", textAlign: "left" }}>
            <label
              htmlFor='phone'
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              Phone
            </label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ marginRight: "10px", fontWeight: "bold" }}>
                +977
              </span>
              <input
                disabled={isSent}
                onChange={(e) => setPhone(e.target.value)}
                type='number'
                className='form-control'
                placeholder='Enter valid phone number'
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  background: "#f9f9f9",
                }}
              />
            </div>
          </div>
          <button
            disabled={isSent}
            onClick={handleSendOtp}
            className='btn btn-danger mt-2 w-100'
            style={{
              backgroundColor: "black",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "1rem",
              width: "100%",
            }}
          >
            Send OTP
          </button>

          {isSent && (
            <>
              <hr />
              <p>OTP has been sent to {phone} ✅</p>
              <div style={{ marginBottom: "15px", textAlign: "left" }}>
                <label
                  htmlFor='otp'
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  OTP
                </label>
                <input
                  onChange={(e) => setOtp(e.target.value)}
                  type='number'
                  className='form-control'
                  placeholder='Enter valid OTP Code!'
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    background: "#f9f9f9",
                  }}
                />
              </div>
              <div style={{ marginBottom: "15px", textAlign: "left" }}>
                <label
                  htmlFor='newPassword'
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  New Password
                </label>
                <input
                  onChange={(e) => setNewPassword(e.target.value)}
                  type='password'
                  className='form-control mt-2'
                  placeholder='Set New Password!'
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    background: "#f9f9f9",
                  }}
                />
              </div>
              <button
                onClick={handleVerifyOtp}
                className='btn btn-primary w-100 mt-2'
                style={{
                  backgroundColor: "black",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "1rem",
                  width: "100%",
                }}
              >
                Verify OTP & Set Password
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
