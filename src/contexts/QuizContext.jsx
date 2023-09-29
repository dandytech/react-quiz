import { createContext, useContext, useEffect, useReducer } from "react";

const SECS_PER_QUESTION = 30;

const QuizContext = createContext();

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
    //not used
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
        warning: "Time is almost out⁉️ 👎",
      };

    default:
      throw new Error("Unkonw Action");
  }
}

function QuizProvider({ children }) {
  const [
    {
      questions,
      status,
      index,
      answer,
      points,
      highscore,
      secondsRemaining,
      warning,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

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

  //grap total questions
  const numQuestions = questions.length;

  //grap max points
  const maxPossiblePoints = questions.reduce(
    (prev, curr) => prev + curr.points,
    0
  );

  return (
    <QuizContext.Provider
      value={{
        questions,
        status,
        index,
        answer,
        points,
        highscore,
        secondsRemaining,
        warning,
        numQuestions,
        maxPossiblePoints,

        dispatch,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}
//to consume the context
function useQuizContext() {
  const context = useContext(QuizContext);
  //check if context is used outside the provider
  if (context === undefined)
    throw new Error("QuizContext was used outside the QuizProvider");
  return context;
}
export { QuizProvider, useQuizContext };
