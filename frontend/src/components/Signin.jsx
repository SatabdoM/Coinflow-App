import React, { useState } from "react";
import signup from "./Signup";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const changeHandler = (event) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value,
    }));
    // console.log(formData);
  };

  async function submitHandler(event) {
    event.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/user/signin",
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
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="bg-richblack-800 flex flex-col p-10 rounded-md gap-2 shadow-box">
        <h2 className="text-center">Sign In</h2>
        <p>Enter your account information</p>
        <form action="submit" className="flex flex-col justify-center gap-1">
          <label htmlFor="username">Email:</label>
          <input
            onChange={changeHandler}
            type="text"
            name="username"
            id="username"
            value={formData.username}
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
              Sign In
            </button>
          </div>
        </form>
        <span>
          New User? <NavLink to="/signup">Sign Up</NavLink>
        </span>
      </div>
    </div>
  );
};

export default Signin;
