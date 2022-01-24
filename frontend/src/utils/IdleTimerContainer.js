import React, { useRef } from "react";
import IdleTimer from "react-idle-timer";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function IdleTimerContainer() {
  const IdleTimerRef = useRef(null);
  const navigate = useNavigate();

  const onIdle = () => {
    let accessToken = localStorage.getItem("access");
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/logout`, {
        params: {
          access: accessToken
        }
      })
      .then((res) => {
        localStorage.removeItem("access");
        navigate('/');
      })
      .catch((err) => {
      });
  };


  return (
    <div>
      <IdleTimer ref={IdleTimerRef} timeout={60 * 1000 * 5} onIdle={onIdle}></IdleTimer>
    </div>
  );
}

export default IdleTimerContainer;