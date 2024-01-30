import React from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import Signin from "./Signin";
import Signup from "./Signup";
import img from "../assets/Logos/logo-bgr-hd.png";

const Welcome = () => {
  const navigate = useNavigate();
  return (
    <div className=" flex flex-col justify-center items-center min-h-screen">
      <div className="bg-richblack-800 flex flex-col justify-center items-center px-10 py-8 rounded-md shadow-box">
        <img src={img} alt="" className="h-60 w-60" />
        <h1 className="">Coinflow </h1>

        <div className="flex gap-5">
          <NavLink to="/signup">
            <button>Sign Up</button>
          </NavLink>
          <NavLink to="/signin">
            <button>Sign In</button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
