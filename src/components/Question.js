import React from "react";
import Options from "./Options";
import { useQuizContext } from "../contexts/QuizContext";

export default function Question() {
  const { questions, index } = useQuizContext();
  const question = questions.at(index);
  // console.log(question);
  return (
    <div>
      <h4>{question.question}</h4>

      <Options question={question} />
    </div>
  );
}
