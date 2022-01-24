import React, { useState } from "react";
import classes from "./sign-up.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const [imageUrl, setPic] = useState();
  const navigate = useNavigate();
  const handleChanges = async (event) => {

    event.preventDefault();
    setForm((prv) => {
      return {
        ...prv,
        role: "user",
      };
    });

    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/register`, { ...form, imageUrl })
      .then((res) => {
        navigate('/');
      })
      .catch((err) => {
        alert("Please Enter Correct Data");
      });

    setForm({
      emailId: "",
      password: "",
      firstName: "",
      role: "user",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      address: ""
    });
  }

  const [form, setForm] = useState({
    emailId: "",
    password: "",
    firstName: "",
    role: "user",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    address: ""
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prv) => {
      return {
        ...prv,
        [name]: value,
      };
    });
  }

  const postDetails = (pics) => {
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "notezipper");
      data.append("cloud_name", "piyushproj");
      fetch("https://api.cloudinary.com/v1_1/piyushproj/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
        })
        .catch((err) => {
        });
    } else {
      return;
    }
  };


  return (
    <div>
      <form>
        <div className={classes["sign-up"]}>
          <div className={classes.form}>
            <input
              type="text"
              value={form.emailId}
              onChange={handleChange}
              name="emailId"
              placeholder="Email"
              required
            />
            <input
              type="text"
              value={form.firstName}
              onChange={handleChange}
              name="firstName"
              placeholder="First Name"
              required
            />
            <input
              type="text"
              value={form.lastName}
              onChange={handleChange}
              name="lastName"
              placeholder="Last Name"
              required
            />
            <input
              type="text"
              value={form.gender}
              onChange={handleChange}
              name="gender"
              placeholder="Gender"
              required
            />
            <input
              type="text"
              value={form.address}
              onChange={handleChange}
              name="address"
              placeholder="Address"
              required
            />
            <input
              type="date"
              value={form.dateOfBirth}
              onChange={handleChange}
              name="dateOfBirth"
              placeholder="Date Of Birth"
              required
            />

            <input
              type="password"
              value={form.password}
              onChange={handleChange}
              name="password"
              placeholder="Password"
              required />

            <label>Change Profile Picture</label>
            <input
              onChange={(e) => postDetails(e.target.files[0])}
              id="custom-file"
              type="file"
              accept="image/png, image/jpeg"
            />

            <input type="submit" value="Sign-Up" className="" onClick={handleChanges} />
            <NavLink to="/">
              <input type="submit" value="have a Account, SignIn" className="" />
            </NavLink>
          </div>
        </div>
      </form>
    </div>
  );
}
export default SignUp;
