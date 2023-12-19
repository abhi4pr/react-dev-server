import React from "react";
import { calculateDaysElapsed } from "../helpers/DaysElapsed";

const NewJoineeTab = ({ newJoinee }) => {
  return (
    <>
      {newJoinee?.map((item) => (
        <li key={item.user_id}>
          <img
            src={`http://34.93.221.166:3000//api/${item.image}`}
            alt="user Image"
          />
          {item.user_name}
          {calculateDaysElapsed(item.joining_date)} days
        </li>
      ))}
    </>
  );
};

export default NewJoineeTab;
