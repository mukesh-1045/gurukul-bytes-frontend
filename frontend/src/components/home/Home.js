import React, { useState, useEffect } from "react";
import classes from "./home.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useFullPageLoader from "../../hooks/useFullPageLoader";
import IdleTimerContainer from "../../utils/IdleTimerContainer";

const Home = () => {
  const [isTimeout, setIsTimeout] = useState(false);
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const navigate = useNavigate();
  const [data, setData] = useState({});

  useEffect((e) => {

    showLoader();
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
        hideLoader();
        setData(res.data.userData);
      })
      .catch((err) => {
      });

  }, [navigate]);

  const handleClick = (e) => {
    localStorage.removeItem("access");
    navigate('/');
  };

  return (
    <div>
      <IdleTimerContainer></IdleTimerContainer>
      <header>
        <h1>WELCOME {data.firstName} {data.lastName}</h1>
        <button className={classes.logout} onClick={handleClick}>Logout</button>
      </header>
      <div className="container">
        <div className={classes.box}>
          <div className={classes.left}>
            <img src={data.imageUrl} alt="Profile" className="img-fluid rounded mx-auto"></img>
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
        <p>Thanks to Join, Created by Mukesh Buldak.</p>
      </footer>
      {loader}
    </div>
  );
};

export default Home;