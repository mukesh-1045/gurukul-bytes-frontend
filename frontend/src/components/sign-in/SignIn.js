import React, { useState, useEffect } from "react"
import classes from "./sign-in.module.css"
import { NavLink, useNavigate } from "react-router-dom"
import axios from "axios"


const SignIn = () => {
    const navigate = useNavigate();
    const [loginAttempts, setLoginAttempts] = useState(0);
    const [alertMsg, setAlertMsg] = useState("");
    const [form, setForm] = useState({
        emailId: "",
        password: "",
    });

    const clearTimer = () => {
        let check = false;
        let startTime = localStorage.getItem("startTime");
        if (startTime) {
            var todayy = new Date();
            let currentTime = todayy.getHours() + ":" + todayy.getMinutes() + ":" + todayy.getSeconds();
            let oldTime = startTime.split(":");
            let newTime = currentTime.split(":");
            if (newTime[0] - oldTime[0] >= 1) {
                localStorage.removeItem("startTime");
                localStorage.removeItem("timer");
                setLoginAttempts(0);
            }
            else if (newTime[1] - oldTime[1] >= 5) {
                localStorage.removeItem("startTime");
                localStorage.removeItem("timer");
                setLoginAttempts(0);
            } else if (!check) {
                check = true;
                setTimeout(() => {
                    clearTimer();
                }, 60 * 5 * 1000);
            }
        }
    };

    useEffect((e) => {
        clearTimer();
    }, []);

    const handleChanges = async (event) => {
        clearTimer();
        event.preventDefault();
        axios
            .post(`${process.env.REACT_APP_BACKEND_URL}/login`, form)
            .then((res) => {
                localStorage.setItem("access", res.data.accesstoken);
                if (res.data.status === false) {
                    if (res.data.userCount) {
                        return alert(res.data.message);
                    } else {
                        let timer = localStorage.getItem("timer");
                        if (!timer) {
                            localStorage.setItem("timer", 1);
                            setLoginAttempts(1);
                        } else {
                            let timerCount = parseInt(timer);
                            timerCount++;
                            localStorage.setItem("timer", timerCount);
                            setLoginAttempts(timerCount);
                            if (timerCount >= 3) {
                                var today = new Date();
                                var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                                localStorage.setItem("startTime", time);
                                setTimeout(() => {
                                    clearTimer();
                                }, 60 * 5 * 1000);
                            }

                        }
                        return setAlertMsg("Please Enter Correct Email and Password");
                    }
                }
                if (res.data.role === "user") {
                    localStorage.removeItem("startTime");
                    localStorage.removeItem("timer");
                    setLoginAttempts(0);
                    navigate('/home');
                }
                if (res.data.role === "admin") {
                    localStorage.removeItem("startTime");
                    localStorage.removeItem("timer");
                    setLoginAttempts(0);
                    navigate('/dashboard');
                }
            })
            .catch((err) => {
                let timer = localStorage.getItem("timer");
                if (!timer) {
                    localStorage.setItem("timer", 1);
                    setLoginAttempts(1);
                } else {
                    let timerCount = parseInt(timer);
                    timerCount++;
                    localStorage.setItem("timer", timerCount);
                    setLoginAttempts(timerCount);
                    if (timerCount >= 3) {
                        var today = new Date();
                        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                        localStorage.setItem("startTime", time);
                        setTimeout(() => {
                            clearTimer();
                            setLoginAttempts(0);
                        }, 60 * 5 * 1000);
                    }
                }
                setAlertMsg("Please Enter Correct Email and Password");
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

                    {loginAttempts >= 3 ? <p>You have tried 3 wrong longin attempts you are blocked for 5 Mintues.</p> :
                        <NavLink to="/">
                            <button type="submit" className={classes["sign-in-button"]} onClick={handleChanges}>
                                Sign-In
                            </button>
                        </NavLink>
                    }

                    <NavLink to="/singup">
                        <button type="submit" className={classes["forgot-button"]}>
                            Don't have a Account, SignUp
                        </button>
                    </NavLink>
                    {
                        alertMsg !== "" && <p>{alertMsg}</p>
                    }
                </form>
            </div>
        </div>
    );
};

export default SignIn;
