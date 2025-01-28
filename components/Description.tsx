import React from "react";
import DescItem from "./DescItem";

const tags = [
  "Interested In Geometric Deep Learning",
  "Interested in Compilers",
  "Codes primarily in C",
  "Cares about Open Source",
  "Likes Neovim",
];

const Description = () => {
  const n = tags.length;

  const movePercentage = (1 / n) * 100;

  /* total time * 1/n = moveTime */
  /* => totalTime = moveTime * n */
  const moveTime = 2000; /* in ms */
  const totalTime = moveTime * n;
  const waitTime = moveTime;

  return (
    <div
      style={{ fontSize: "22px" }} // text-2xl is closest
      className="relative flex justify-center text-[#264653]"
    >
      {tags.map((tag, index) => (
        <DescItem
          key={index}
          tag={tag}
          movePercentage={movePercentage}
          totalTime={totalTime}
          delay={waitTime * index}
        />
      ))}
    </div>
  );
};

export default Description;
