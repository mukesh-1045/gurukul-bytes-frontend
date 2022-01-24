import React, { useState } from "react"
import classes from "./sign-in.module.css"
import { NavLink, useNavigate } from "react-router-dom"
import axios from "axios"


const SignIn = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        emailId: "",
        password: "",
    });

    const handleChanges = async (event) => {
        event.preventDefault();
        axios
            .post(`${process.env.REACT_APP_BACKEND_URL}/login`, form)
            .then((res) => {
                localStorage.setItem("access", res.data.accesstoken);
                if (res.data.status === false) {
                    if (res.data.userCount) {
                        return alert(res.data.message);
                    } else {
                        return alert("Please Enter Correct Email and Password");
                    }
                }
                if (res.data.role === "user") {
                    navigate('/home');
                }
                if (res.data.role === "admin") {
                    navigate('/dashboard');
                }
            })
            .catch((err) => {
                alert("Please Enter Correct Email and Password");
            });

        setForm({
            emailId: "",
            password: "",
        });
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

    return (
        <div className={classes["sign-in"]}>
            <div className={classes["sign-in-container"]}>
                <h1>Sign-In</h1>
                <form>
                    <h5>E-mail</h5>
                    <input
                        type="text"
                        value={form.emailId}
                        onChange={handleChange}
                        name="emailId"
                        required
                    />
                    <h5>Password</h5>
                    <input
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        name="password"
                        required />
                    <NavLink to="/">
                        <button type="submit" className={classes["sign-in-button"]} onClick={handleChanges}>
                            Sign-In
                        </button>
                    </NavLink>
                    <NavLink to="/singup">
                        <button type="submit" className={classes["forgot-button"]}>
                            Don't have a Account, SignUp
                        </button>
                    </NavLink>
                </form>
            </div>
        </div>
    );
};

export default SignIn;
