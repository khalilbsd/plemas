import React from "react";
import { ReactSVG } from "react-svg";
import Loading from "../loading/Loading";
import { btnStyle } from "./style";
const AddBtn = ({ handleAdd, title, icon, loading ,large }) => {
  const classes = btnStyle();
  return (
    <div>
      <button
        className={`${classes.btn} ${large?'large':""}`}
        onClick={!loading?handleAdd:undefined}
        disabled={loading ? true : false}
      >
        {!loading ? (
          <>
            {icon && <ReactSVG src={icon} className={classes.icon} />}
            {title}
          </>
        ) : (
          <Loading color="var(--orange)" />
        )}
      </button>
    </div>
  );
};

export default AddBtn;
