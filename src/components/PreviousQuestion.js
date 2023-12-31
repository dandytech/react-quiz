import React from "react";
import { useQuizContext } from "../contexts/QuizContext";

export default function PreviousQuestion() {
  const { answer, index, numQuestions, dispatch } = useQuizContext();
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
