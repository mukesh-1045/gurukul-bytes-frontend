import React, { useState, useEffect } from "react";
import classes from "./dashboard.module.css"
import { NavLink, useNavigate } from "react-router-dom"
import axios from "axios";
import Table from "../table/Table";

const Home = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  useEffect((e) => {
    let techStack = localStorage.getItem("access");
    if (!techStack) {
      navigate('/');
    }
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/getAllUser`, {
        params: {
          access: techStack
        }
      })
      .then((res) => {
        setData(res.data.allUsers);
      })
      .catch((err) => {
      });
  }, []);

  const handleClick = (e) => {
    localStorage.removeItem("access");
    navigate('/');
  };

  return (
    <div>
      <header>
        <h1>WELCOME ADMIN</h1>
        <button className={classes.logout} onClick={handleClick}>Logout</button>
      </header>
      <div className="container">

      </div>
      <footer className="footer fixed-bottom">
        <p>Thanks to Join.</p>
      </footer>
    </div>
  );
};

export default Home;