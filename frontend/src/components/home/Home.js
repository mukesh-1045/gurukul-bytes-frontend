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
    console.log(techStack);
    if(!techStack){
       navigate('/');
    }
		axios
			.get(`${process.env.REACT_APP_BACKEND_URL}/profile`,{params: {
                access: techStack
      }})
			.then((res) => {
				setData(res.data.userData);
        console.log("data " , data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);
  console.log("data " , data);


const column = [
    { heading: 'Name', value: 'firstName' },
    { heading: 'Email', value: 'emailId' },
    { heading: 'Gender', value: 'gender' },
    { heading: 'lastName', value: 'lastName' },
  ]

  return(
    <div>
      <Table data={data} column={column} />
    </div>
  );
};

export default Home;