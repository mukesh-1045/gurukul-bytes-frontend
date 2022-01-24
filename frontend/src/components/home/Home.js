import React, { useState, useEffect } from "react";
import classes from "./home.module.css"
import { NavLink, useNavigate } from "react-router-dom"
import axios from "axios";
import Table from "../table/Table";

const Home = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({});

  useEffect((e) => {
    let techStack = localStorage.getItem("access");
    if (!techStack) {
      navigate('/');
    }
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/profile`, {
        params: {
          access: techStack
        }
      })
      .then((res) => {
        setData(res.data.userData);
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
        <h1>WELCOME {data.firstName} {data.lastName}</h1>
        <button className={classes.logout} onClick={handleClick}>Logout</button>
      </header>
      <div className="container">
        <div className={classes.box}>
          <div className={classes.left}>
            <img src={data.imageUrl} alt="Profile Picture" className="img-fluid rounded mx-auto"></img>
          </div>
          <div className={classes.right}>
            <h3>Email - {data.emailId}</h3>
            <h3>Date of Birth - {data.dateOfBirth && data.dateOfBirth.split('T')[0]}</h3>
            <h3>Gender - {data.gender}</h3>
            <h3>Address - {data.address}</h3>
          </div>
        </div>
      </div>
      <footer className="footer fixed-bottom">
        <p>Thanks to Join.</p>
      </footer>
    </div>
  );
};

export default Home;