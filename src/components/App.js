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
import { useQuizContext } from "../contexts/QuizContext";
//import PreviousQuestion from "./PreviousQuestion";

export default function App() {
  const { status } = useQuizContext();

  return (
    <div className="App">
      <Header />
      <Main>
        {status === "loading" && <Loader />}

        {status === "error" && <Error />}

        {status === "ready" && <StartScreen />}

        {status === "active" && (
          <>
            <Progress />

            <Question />

            <Footer>
              <Timer />

              <NextQuestion />
              {/* <PreviousQuestion dispatch={dispatch} answer={answer} /> */}
            </Footer>
          </>
        )}

        {status === "finished" && <FinishScreen />}
      </Main>
    </div>
  );
}
