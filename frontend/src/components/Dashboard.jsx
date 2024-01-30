import React, { useEffect, useState } from "react";
import axios from "axios";
import img from "../assets/Logos/logo-bgr-hd.png";

const dashboard = () => {
  const [token, setToken] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [balance, setBalance] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [fetchedUser, setFetchedUser] = useState([{}]);

  async function fetchData() {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
    };
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/account/balance",
        { headers }
      );
      setFirstName(response.data.firstname);
      setLastName(response.data.lastname);
      setBalance(response.data.balance);
      setEmail(response.data.email);
    } catch (error) {
      console.log(error);
    }
  }
  async function getUsers() {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/v1/user/bulk?filter=${searchUser}`
      );
      setFetchedUser(res.data.user);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    getUsers();
  }, [searchUser]);

  return (
    <div className="min-w-screen flex flex-col justify-center items-center">
      <div className="bg-richblack-800 flex justify-center items-center navbar  w-full">
        <div className=" w-10/12 flex flex-row items-center justify-between">
          <div className="flex flex-row items-center">
            <img src={img} alt="" className="h-20" />
            <h2>Coinflow</h2>
          </div>
          <div>
            <p className="text-lg">Hello, {firstname}</p>
          </div>
        </div>
      </div>
      <div className="w-9/12  p-10 ">
        <div className="bg-richblack-800 p-10 rounded-md">
          <div className="text-2xl font-semibold">
            Your Balance : ₹{Math.round(balance)}
          </div>
          <div className="flex flex-col gap-4 py-5">
            <input
              onChange={(e) => {
                setSearchUser(e.target.value);
              }}
              type="text"
              className="w-5/12 p-2"
              placeholder="Search Users"
            />
          </div>
          <div className="flex flex-col gap-2 ">
            {fetchedUser.map((user, index) => {
              if (user.username !== email) {
                return <User index={index} user={user} />;
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const User = ({ user, index }) => {
  const sendButtonHandler = () => {
    const userId = user._id;
    window.location.href = `/transfer/${userId}`;
  };
  return (
    <div className="w-full flex justify-between items-center rounded-xl bg-richblack-700 px-5 py-2">
      <div className="text-lg font-semibold flex flex-row gap-2">
        <p>{user.firstName}</p>
        <p>{user.lastName}</p>
      </div>

      <button className="w-5 h-10 rounded-xl" onClick={sendButtonHandler}>
        Send
      </button>
    </div>
  );
};
export default dashboard;
