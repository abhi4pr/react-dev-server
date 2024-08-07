import React, { useEffect } from "react";
import "./Loader.css";

const Loader = () => {
  useEffect(() => {
    const loader = document.querySelector(".loader");
    console.log(loader, "loader>>");
    const delay = +loader?.dataset?.delay || 200;
    const dots = loader?.querySelectorAll(".loader .dot");
    dots?.forEach((dot, index) => {
      dot.style = `--delay: ${delay * index}`;
    });
  }, []);
  return (
    

    <div  >
      
      <main>
        <div className="loader js-loader" data-delay="200">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </main>
    </div>
  
  );
};

export default Loader;
