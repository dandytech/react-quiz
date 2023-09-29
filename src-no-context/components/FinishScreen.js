import React from "react";

export default function FinishScreen({
  points,
  maxPossiblePoints,
  highscore,
  dispatch,
}) {
  const percentageScore = (points / maxPossiblePoints) * 100;

  let emoji;
  if (percentageScore === 100) emoji = "🫰";
  if (percentageScore >= 80 && percentageScore < 100) emoji = "👌";
  if (percentageScore >= 50 && percentageScore < 80) emoji = "😇";
  if (percentageScore >= 0 && percentageScore < 50) emoji = "👩‍🏫";
  if (percentageScore === 0) emoji = "😹";

  return (
    <>
      <p className="result">
        <span>{emoji}</span> You scored <strong>{points}</strong> out of{" "}
        {maxPossiblePoints} ({Math.ceil(percentageScore)}%)
      </p>

      <p className="highscore">(Highest Score: {highscore} points)</p>

      <p>
        <button
          className="btn btn-ui"
          onClick={() => dispatch({ type: "restart" })}
        >
          RESTART QUIZ
        </button>
      </p>
    </>
  );
}
