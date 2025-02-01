import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { registerUserApi } from "../../apis/api";
import FooterCard from "../../components/FooterCard";
import "./Register.css";

const Register = () => {
  //usestate
  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setuserName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //usestate error messages
  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [userNameError, setuserNameError] = useState("");
  const [ageError, setAgeError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  //making function to change value
  const handleFullName = (e) => {
    setFullName(e.target.value);
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleuserName = (e) => {
    setuserName(e.target.value);
  };
  const handleAge = (e) => {
    setAge(e.target.value);
  };
  const handlePhone = (e) => {
    setPhone(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  //validaation
  var validate = () => {
    var isValid = true;
    if (fullname.trim() === "") {
      setFullNameError("Please enter your full name");
      isValid = false;
    }
    if (email.trim() === "") {
      setEmailError("Please enter your email");
      isValid = false;
    }
    if (username.trim() === "") {
      setuserNameError("Please enter your userName");
      isValid = false;
    }
    if (age.trim() === "") {
      setAgeError("Please enter your age");
      isValid = false;
    }
    if (phone.trim() === "") {
      setPhoneError("Please enter your phone number");
      isValid = false;
    }
    if (password.trim() === "") {
      setPasswordError("Please enter your password");
      isValid = false;
    }
    if (confirmPassword.trim() === "") {
      setConfirmPasswordError("Please confirm your password");
      isValid = false;
    }
    if (confirmPassword.trim() !== password.trim()) {
      setConfirmPasswordError("Password does not match");
      isValid = false;
    }
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    //checking data in console
    console.log(fullname, email, username, age, phone, password);

    //validate
    var isValidated = validate();
    if (!isValidated) {
      return;
    }
    const data = {
      fullname: fullname,
      email: email,
      username: username,
      age: age,
      phone: phone,
      password: password,
    };
    registerUserApi(data)
      .then((res) => {
        //recived data: success message
        if (res.data.success === false) {
          toast.error(res.data.message);
        } else {
          toast.success(res.data.message);
        }
      })
      .catch((err) => {
        //error message
        toast.error(err.response.data.message);
      });
  };

  return (
    <>
      <div className='registration-container'>
        <div className='form-wrapper'>
          <h2>Create an Account</h2>
          <form className='registration-form'>
            <div className='d-flex flex-wrap'>
              <div className='form-group w-50 px-2'>
                <label htmlFor='fullname'>Full Name</label>
                <input
                  onChange={handleFullName}
                  type='text'
                  id='fullname'
                  name='fullName'
                  placeholder='Enter your full name'
                />
                {fullNameError && (
                  <p className='text-danger'>{fullNameError}</p>
                )}
              </div>

              <div className='form-group w-50 px-2'>
                <label htmlFor='username'>Username</label>
                <input
                  onChange={handleuserName}
                  type='text'
                  id='username'
                  name='username'
                  placeholder='Enter your username'
                />
                {userNameError && (
                  <p className='text-danger'>{userNameError}</p>
                )}
              </div>
              <div className='form-group w-50 px-2'>
                <label htmlFor='age'>Age</label>
                <input
                  onChange={handleAge}
                  type='number'
                  id='age'
                  name='age'
                  placeholder='Enter your age'
                />
                {ageError && <p className='text-danger'>{ageError}</p>}
              </div>

              <div className='form-group w-50 px-2'>
                <label htmlFor='email'>Email</label>
                <input
                  onChange={handleEmail}
                  type='email'
                  id='email'
                  name='email'
                  placeholder='Enter your email'
                />
                {emailError && <p className='text-danger'>{emailError}</p>}
              </div>

              <div className='form-group w-50 px-2'>
                <label htmlFor='phone'>Phone Number</label>
                <input
                  onChange={handlePhone}
                  type='number'
                  id='phone'
                  name='phone'
                  placeholder='Enter your phone number'
                />
                {phoneError && <p className='text-danger'>{phoneError}</p>}
              </div>

              <div className='form-group w-50 px-2'>
                <label htmlFor='password'>Password</label>
                <input
                  onChange={handlePassword}
                  type='password'
                  id='password'
                  name='password'
                  placeholder='Enter your password'
                />
                {passwordError && (
                  <p className='text-danger'>{passwordError}</p>
                )}
              </div>
              <div className='form-group w-50 px-2'>
                <label htmlFor='confirmPassword'>Confirm Password</label>
                <input
                  onChange={handleConfirmPassword}
                  type='password'
                  id='confirmPassword'
                  name='confirmPassword'
                  placeholder='Confirm your password'
                />
                {confirmPasswordError && (
                  <p className='text-danger'>{confirmPasswordError}</p>
                )}
              </div>

              <button onClick={handleSubmit} className='btn btn-dark w-100'>
                Create Account
              </button>
            </div>
          </form>
          <div className='login-redirect'>
            <p>
              Already have an account?{" "}
              <a href='/login' style={{ color: "blue" }}>
                Log In
              </a>
            </p>
          </div>
        </div>
      </div>

      <FooterCard />
    </>
  );
};

export default Register;
