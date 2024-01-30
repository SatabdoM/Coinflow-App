import React, { useState } from "react";
import Signin from "./Signin";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    firstname: "",
    lastname: "",
    password: "",
  });

  const changeHandler = (event) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value,
    }));
    console.log(formData);
  };

  async function submitHandler(event) {
    event.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/user/signup",
        formData
      );
      console.log(res.data.token);
      localStorage.setItem("jwtToken", res.data.token);
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="bg-richblack-800 flex flex-col p-10 rounded-md gap-2 shadow-box">
        <h2 className="text-center">Sign Up</h2>
        <p>Enter Information to create an account</p>
        <form action="submit" className="flex flex-col justify-center gap-1">
          <label htmlFor="username">Email:</label>
          <input
            onChange={changeHandler}
            type="text"
            name="username"
            id="username"
            value={formData.username}
          />

          <label htmlFor="firstname">First Name:</label>
          <input
            onChange={changeHandler}
            type="text"
            name="firstname"
            id="firstname"
            value={formData.firstname}
          />

          <label htmlFor="lastname">Last Name:</label>
          <input
            onChange={changeHandler}
            type="text"
            name="lastname"
            id="lastname"
            value={formData.lastname}
          />

          <label htmlFor="password">Password:</label>
          <input
            onChange={changeHandler}
            type="password"
            name="password"
            id="password"
            value={formData.password}
          />
          <div className="flex justify-center p-4">
            <button className="w-full" onClick={submitHandler}>
              {" "}
              Sign Up
            </button>
          </div>
        </form>
        <span>
          Already have an account? <NavLink to="/signin">Sign in</NavLink>
        </span>
      </div>
    </div>
  );
};

export default signup;
