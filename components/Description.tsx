const tags = [
  "Researcher In AI + Group Theory",
  "Symmmetry Discovery",
  "Group Equivariant NNs",
];

const Description = () => {
  /* total time * 1/n = moveTime */
  /* => totalTime = moveTime * n */
  const moveTime = 2000; /* in ms */
  const totalTime = moveTime * tags.length;
  const waitTime = moveTime;

  return (
    <div
      style={{ fontSize: "22px" }} // text-2xl is closest
      className="relative flex justify-center text-[#264653]"
    >
      {tags.map((tag, index) => (
        <div
          key={tag}
          className="mf-desc-item"
          style={{
            animationDuration: `${totalTime}ms`,
            animationDelay: `${waitTime * index}ms`,
          }}
        >
          {tag}
        </div>
      ))}
    </div>
  );
};

export default Description;
