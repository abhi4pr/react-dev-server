import React, { useState } from "react";
import "../FormateNumWithTooltip/FormateNumWithTooltip.css"; // Ensure the path is correct

const formatNumber = (value) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(2)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(2)}k`;
  } else {
    return value.toString();
  }
};

const numberToWords = (num) => {
  const a = [
    "",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];
  const b = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];

  const g = [
    "",
    "thousand",
    "million",
    "billion",
    "trillion",
    "quadrillion",
    "quintillion",
    "sextillion",
    "septillion",
    "octillion",
    "nonillion",
  ];

  const makeGroup = ([ones, tens, huns]) => {
    return [
      huns === 0 ? "" : a[huns] + " hundred ",
      tens === 0
        ? a[ones]
        : (b[tens] && b[tens] + (ones ? "-" + a[ones] : "")) || "",
    ].join("");
  };

  const thousand = (group, i) => (group === "" ? group : `${group} ${g[i]}`);

  if (typeof num === "number") return num === 0 ? "zero" : num.toLocaleString();
  if (typeof num !== "string") return "";

  let start = num.length;
  const chunks = [];
  while (start > 0) {
    const end = start;
    chunks.push(num.slice((start = Math.max(0, start - 3)), end));
  }

  return chunks
    .map(makeGroup)
    .map(thousand)
    .filter((group) => group !== "")
    .reverse()
    .join(" ");
};

const FormattedNumberWithTooltip = ({ value }) => {
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    text: "",
  });

  const showTooltip = (event) => {
    setTooltip({
      visible: true,
      x: event.clientX + 10,
      y: event.clientY + 10,
      text: numberToWords(value),
    });
  };

  const hideTooltip = () => {
    setTooltip({ visible: false, x: 0, y: 0, text: "" });
  };

  return (
    <span
      className="formatted-number-with-tooltip"
      onMouseEnter={showTooltip}
      onMouseMove={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {formatNumber(value)}
      {tooltip.visible && (
        <div
          className="tooltip_data"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.text}
        </div>
      )}
    </span>
  );
};

export default FormattedNumberWithTooltip;
