import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import axios from "axios";
import img from "../assets/Logos/logo-bgr-hd.png";

function Transfer() {
  const { userId } = useParams();
  const [friendName, setFriendName] = useState("");
  const [amount, setAmount] = useState(0);
  const [success, setSuccess] = useState(0);

  async function getFriend() {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
    };
    const body = {
      userId: userId,
    };
    const res = await axios.post(
      "http://localhost:3000/api/v1/user/findUser",
      body,
      { headers }
    );
    console.log(res.data);
    setFriendName(`${res.data.firstName} ${res.data.lastName}`);
  }

  useEffect(() => {
    getFriend();
  }, []);

  const InitiateTransfer = async (event) => {
    event.preventDefault();
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
    };
    const body = {
      amount: amount,
      receiverId: userId,
    };
    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/account/transfer",
        body,
        { headers }
      );
      // console.log(res);
      // window.alert(res.data.message);
      setSuccess(1);
      setTimeout(() => {
        setSuccess(0);
      }, 3000);
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 403) {
        // window.alert("Insufficient Balance");

        setSuccess(-1);
        setTimeout(() => {
          setSuccess(0);
        }, 3000);
      } else {
        // window.alert("An error occurred. Please try again.");
        setSuccess(-1);
        setTimeout(() => {
          setSuccess(0);
        }, 3000);
      }
    }
  };

  return (
    <div className="min-h-screen  flex flex-col ">
      <div className="bg-richblack-800 w-full flex flex-row justify-center shadow-box ">
        <img src={img} alt="" className="h-20" />
      </div>
      <div className="  flex flex-col flex-grow justify-center items-center ">
        <div
          className={`bg-richblack-800 flex flex-col rounded-md py-10 px-20 items-center gap-2 shadow-box ${
            success === 0 ? "" : "hidden"
          }`}
        >
          <h2>Send Money</h2>
          <h3 className="text-xl">{friendName}</h3>
          <form action="submit" className="flex flex-col gap-4  pt-8">
            <label htmlFor="amount" className="text-lg">
              Amount in ₹(INR)
            </label>
            <input
              onChange={(e) => {
                setAmount(e.target.value);
              }}
              type="text"
              id="amount"
              placeholder="Enter Amount"
              value={amount}
            />
            <button
              className="bg-caribbeangreen-400 hover:bg-caribbeangreen-600 "
              onClick={InitiateTransfer}
            >
              Initiate Transfer
            </button>
            <NavLink to="/dashboard">
              <button className="w-full">Return </button>
            </NavLink>
          </form>
        </div>

        <div
          className={`bg-richblack-800 flex flex-col rounded-md p-10 items-center gap-2 shadow-box z-50 success py-20
      ${success !== 1 ? "hidden" : ""}`}
        >
          <span className="material-symbols-outlined text-4xl ">
            check_circle
          </span>
          <h2>Transaction Successful !</h2>
          <p className="text-lg">Amount transferred successfully</p>
        </div>

        <div
          className={`bg-richblack-800 flex flex-col rounded-md p-10 py-20 items-center gap-2 shadow-box z-50 failed
      ${success !== -1 ? "hidden" : ""}`}
        >
          <span className="material-symbols-outlined text-4xl">cancel</span>
          <h2>Transaction Failed !</h2>
          <p className="text-lg">Insufficient Balance </p>
        </div>
      </div>
    </div>
  );
}

export default Transfer;
