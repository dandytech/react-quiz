import React from "react";

export default function PreviousQuestion({
  answer,
  index,
  numQuestions,
  dispatch,
}) {
  if (answer === null) return null;

  if (index > numQuestions - 1)
    return (
      <div>
        return (
        <button
          className="btn btn-ui"
          onClick={() => dispatch({ type: "previousQuestion" })}
        >
          Previous
        </button>
        )
      </div>
    );
}
