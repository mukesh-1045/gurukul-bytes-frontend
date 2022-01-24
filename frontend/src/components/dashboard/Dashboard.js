import React, { useState, useEffect, useMemo } from "react";
import classes from "./dashboard.module.css"
import { useNavigate } from "react-router-dom"
import axios from "axios";
import useFullPageLoader from "../../hooks/useFullPageLoader";
import { TableHeader, Pagination, Search } from "../../ui/DataTable";
import IdleTimerContainer from "../../utils/IdleTimerContainer";

const Home = () => {
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState({ field: "", order: "" });

  const ITEMS_PER_PAGE = 10;

  const headers = [
    { name: "No#", field: "id", sortable: false },
    { name: "First Name", field: "firstName", sortable: true },
    { name: "Last Name", field: "lastName", sortable: false },
    { name: "Email", field: "emailId", sortable: true },
    { name: "Gender", field: "gender", sortable: false },
    { name: "Address", field: "address", sortable: false }
  ];

  useEffect((e) => {
    const getData = () => {

      showLoader();
      let techStack = localStorage.getItem("access");
      if (!techStack) {
        navigate('/');
      }
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/getAllUser`, {
          params: {
            access: techStack
          }
        })
        .then((res) => {
          hideLoader();
          setComments(res.data.allUsers);
        })
        .catch((err) => {
        });
    };

    getData();
  }, [navigate]);

  const commentsData = useMemo(() => {
    let computedComments = comments;

    if (search) {
      computedComments = computedComments.filter(
        comment =>
          comment.firstName.toLowerCase().includes(search.toLowerCase()) ||
          comment.emailId.toLowerCase().includes(search.toLowerCase())
      );
    }

    setTotalItems(computedComments.length);

    //Sorting comments
    if (sorting.field) {
      const reversed = sorting.order === "asc" ? 1 : -1;
      computedComments = computedComments.sort(
        (a, b) =>
          reversed * a[sorting.field].localeCompare(b[sorting.field])
      );
    }

    //Current Page slice
    return computedComments.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );
  }, [comments, currentPage, search, sorting]);

  const handleClick = (e) => {
    localStorage.removeItem("access");
    navigate('/');
  };

  return (
    <div>
      <IdleTimerContainer></IdleTimerContainer>
      <header>
        <h1>WELCOME ADMIN</h1>
        <button className={classes.logout} onClick={handleClick}>Logout</button>
      </header>
      <div className="row w-100 mt-3">
        <div className="col mb-3 col-12 text-center">
          <div className="row">
            <div className="col-md-6">
              <Pagination
                total={totalItems}
                itemsPerPage={ITEMS_PER_PAGE}
                currentPage={currentPage}
                onPageChange={page => setCurrentPage(page)}
              />
            </div>
            <div className="col-md-6 d-flex flex-row-reverse">
              <Search
                onSearch={value => {
                  setSearch(value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          <table className="table table-striped">
            <TableHeader
              headers={headers}
              onSorting={(field, order) =>
                setSorting({ field, order })
              }
            />
            <tbody>
              {commentsData.map((comment, index) => (
                <tr>
                  <th scope="row" key={index + 1}>
                    {index + 1}
                  </th>
                  <td>{comment.firstName}</td>
                  <td>{comment.lastName}</td>
                  <td>{comment.emailId}</td>
                  <td>{comment.gender}</td>
                  <td>{comment.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <footer className="footer fixed-bottom">
        <p>Thanks You, Created by Mukesh Buldak.</p>
      </footer>
      {loader}
    </div>
  );
};

export default Home;