import React from "react";
import { Routes, Route } from "react-router-dom";
import classes from "./app.module.css";
import SignIn from "./components/sign-in/SignIn";
import SignUp from "./components/sign-up/SignUp";
import Home from "./components/home/Home";


function App() {
  return (
    <>
      <Routes>
        <Route  path="/" element={<SignIn/>} />
        <Route  path="/singup" element={<SignUp/>} />
        <Route  path="/home" element={<Home/>} />
      </Routes>
    </>
  );
}

export default App;
