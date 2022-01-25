import React, { useState } from "react";
import classes from "./sign-up.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const [isSubmit, setIsSubmit] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
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
  const [formErrors, setFormErrors] = useState({});
  const [imageUrl, setPic] = useState();
  const navigate = useNavigate();
  const handleSubmit = async (event) => {

    event.preventDefault();
    setFormErrors(validate(form));
    if (!isSubmit) {
      return;
    }
    setForm((prv) => {
      return {
        ...prv,
        role: "user",
      };
    });

    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/register`, { ...form, imageUrl })
      .then((res) => {
        if (!res.data.status) {
          return setAlertMsg(res.data.message);
        }
        navigate('/');
      })
      .catch((err) => {
        setAlertMsg("Please Enter Correct Data");
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
    setFormErrors({});
  }


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

  const validate = (values) => {
    let check = true;
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.firstName) {
      errors.firstName = "First Name is required!";
      setIsSubmit(false);
      check = false;
    }
    if (!values.lastName) {
      errors.lastName = "Last Name is required!";
      setIsSubmit(false);
      check = false;
    }
    if (!values.gender) {
      errors.gender = "Gender is required!";
      setIsSubmit(false);
      check = false;
    }
    if (!values.address) {
      errors.address = "Address is required!";
      setIsSubmit(false);
      check = false;
    }
    if (!values.dateOfBirth) {
      errors.dateOfBirth = "Date of Birth is required!";
      setIsSubmit(false);
      check = false;
    }
    if (!values.emailId) {
      errors.emailId = "Email is required!";
      setIsSubmit(false);
      check = false;
    } else if (!regex.test(values.emailId)) {
      errors.emailId = "This is not a valid email format!";
      setIsSubmit(false);
      check = false;
    }
    if (!values.password) {
      errors.password = "Password is required";
      setIsSubmit(false);
      check = false;
    } else if (values.password.length < 6) {
      errors.password = "Password must be more than 6 characters";
      setIsSubmit(false);
      check = false;
    }
    if (check) {
      setIsSubmit(true);
    }
    return errors;
  };


  return (
    <div>
      <form className="mt-4">
        <div className={classes["sign-up"]}>
          <div className={classes.form}>
            {
              alertMsg !== "" && <p>{alertMsg}</p>
            }
            <input
              type="text"
              value={form.emailId}
              onChange={handleChange}
              name="emailId"
              placeholder="Email"
              required="required"
            />
            <p>{formErrors.emailId}</p>
            <input
              type="text"
              value={form.firstName}
              onChange={handleChange}
              name="firstName"
              placeholder="First Name"
              required
            />
            <p>{formErrors.firstName}</p>
            <input
              type="text"
              value={form.lastName}
              onChange={handleChange}
              name="lastName"
              placeholder="Last Name"
              required
            />
            <p>{formErrors.lastName}</p>
            <input
              type="text"
              value={form.gender}
              onChange={handleChange}
              name="gender"
              placeholder="Gender"
              required
            />
            <p>{formErrors.gender}</p>
            <input
              type="text"
              value={form.address}
              onChange={handleChange}
              name="address"
              placeholder="Address"
              required
            />
            <p>{formErrors.address}</p>
            <input
              type="date"
              value={form.dateOfBirth}
              onChange={handleChange}
              name="dateOfBirth"
              placeholder="Date Of Birth"
              required
            />
            <p>{formErrors.dateOfBirth}</p>
            <input
              type="password"
              value={form.password}
              onChange={handleChange}
              name="password"
              placeholder="Password"
              required
            />
            <p>{formErrors.password}</p>
            <label className="form-group">Add Profile Picture</label>
            <input
              className="form-group"
              onChange={(e) => postDetails(e.target.files[0])}
              id="custom-file"
              type="file"
              accept="image/png, image/jpeg"
            />
            <input type="submit" value="Sign-Up" className="" onClick={handleSubmit} />
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
