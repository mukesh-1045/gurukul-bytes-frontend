import React, { useRef } from "react";
import IdleTimer from "react-idle-timer";
import { useNavigate } from "react-router-dom";

function IdleTimerContainer() {
  const IdleTimerRef = useRef(null);
  const navigate = useNavigate();

  const onIdle = () => {
    localStorage.removeItem("access");
    navigate('/');
  };


  return (
    <div>
      <IdleTimer ref={IdleTimerRef} timeout={60 * 1000 * 5} onIdle={onIdle}></IdleTimer>
    </div>
  );
}

export default IdleTimerContainer;