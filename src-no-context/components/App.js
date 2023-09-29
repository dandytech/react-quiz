import React, { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextQuestion from "./NextQuestion";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";
//import PreviousQuestion from "./PreviousQuestion";

const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [],

  //'Loading', 'error, 'ready', 'active', 'finished'
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: 10,
  warning: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived": //handler
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };
    case "newAnswer":
      //grab answered question for compare with correct question for point
      const question = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1,
        answer: null, //this resets the answer for button to be active and clickable again
      };
    case "previousQuestion":
      return {
        ...state,
        index: state.index - 1,

        answer: null, //this resets the answer for button to be active and clickable again
      };
    case "finished":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "restart":
      return {
        ...initialState,
        questions: state.questions,
        status: "ready",
        // ...state,
        // index: 0,
        // answer: null,
        // points: 0,
        // status: "ready",
      };

    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };

    case "warn":
      return {
        ...state,
        warning: "Time is almost out ⁉️ 👎",
      };

    default:
      throw new Error("Unkonw Action");
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  //destructure state variables
  const {
    questions,
    status,
    index,
    answer,
    points,
    highscore,
    secondsRemaining,
    warning,
  } = state;

  //grap total questions
  const numQuestions = questions.length;

  //grap max points
  const maxPossiblePoints = questions.reduce(
    (prev, curr) => prev + curr.points,
    0
  );

  useEffect(function () {
    try {
      async function getQuestions() {
        const res = await fetch("http://localhost:9000/questions");
        const data = await res.json();
        dispatch({ type: "dataReceived", payload: data });
      }
      getQuestions();
    } catch (err) {
      dispatch({ type: "dataFailed" });
    }
  }, []);

  return (
    <div className="App">
      <Header />
      <Main>
        {status === "loading" && <Loader />}

        {status === "error" && <Error />}

        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}

        {status === "active" && (
          <>
            <Progress
              index={index}
              maxPossiblePoints={maxPossiblePoints}
              numQuestions={numQuestions}
              points={points}
              answer={answer}
            />

            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />

            <Footer>
              <Timer
                dispatch={dispatch}
                secondsRemaining={secondsRemaining}
                warning={warning}
              />

              <NextQuestion
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestions={numQuestions}
              />
              {/* <PreviousQuestion dispatch={dispatch} answer={answer} /> */}
            </Footer>
          </>
        )}

        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
