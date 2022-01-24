import React from "react";
import Spinner from "../../assets/images/spinner.gif";
import classes from "./index.module.css";

const FullPageLoader = () => {
  return (
    <div className={classes['fp-container']}>
      <img src={Spinner} className={classes['fp-loader']} alt="loading" />
    </div>
  );
};

export default FullPageLoader;