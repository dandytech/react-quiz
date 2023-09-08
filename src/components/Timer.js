import React, { useEffect } from "react";

export default function Timer({ dispatch, secondsRemaining, warning }) {
  const mins = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  useEffect(
    function () {
      const id = setInterval(function () {
        dispatch({ type: "tick" });
      }, 1000);

      //clean up function to clean the effect to stop timer when component unmount
      return () => clearInterval(id);
    },
    [dispatch]
  );

  useEffect(function () {
    secondsRemaining <= 20 && dispatch({ type: "warn" });
  });

  return (
    <>
      <div className="timer">
        {mins < 10 && "0"}
        {mins}: {seconds < 10 && "0"}
        {seconds}
      </div>
      <p className="warn">{warning}</p>
    </>
  );
}
