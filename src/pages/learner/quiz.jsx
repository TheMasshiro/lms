import React, { useState, useRef } from "react";
import { dummyQuestions } from "../../assets/assets";
import "../../components/css/quiz.css";
import { useUser } from "@clerk/clerk-react";
import Loading from "../../components/learner/Loading"; // Assuming you have a Loading component

const Quiz = () => {
  const [index, setIndex] = useState(0);
  const [question, setQuestion] = useState(dummyQuestions[index]);
  const [lock, setLock] = useState(false);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState(false);

  const { user } = useUser(); // You don't need to use user in this component, but if you do, make sure to handle loading state properly.

  const option1 = useRef(null);
  const option2 = useRef(null);
  const option3 = useRef(null);
  const option4 = useRef(null);

  const optionArray = [option1, option2, option3, option4];

  const checkAnswer = (e, ans) => {
    if (!lock) {
      if (question.ans === ans) {
        e.target.classList.add("korek");
        setScore((prev) => prev + 1);
      } else {
        e.target.classList.add("rong");
        optionArray[question.ans - 1].current.classList.add("korek");
      }
      setLock(true);
    }
  };

  const next = () => {
    if (lock) {
      if (index === dummyQuestions.length - 1) {
        setResult(true);
        return;
      }
      setIndex(index + 1);
      setQuestion(dummyQuestions[index + 1]);
      setLock(false);
      optionArray.forEach((option) => {
        option.current.classList.remove("rong");
        option.current.classList.remove("korek");
      });
    }
  };

  const reset = () => {
    setIndex(0);
    setQuestion(dummyQuestions[0]);
    setScore(0);
    setLock(false);
    setResult(false);
  };

  return (
    <div className="quizContainer">
      <h1>Quiz App</h1>
      <hr />
      {!result ? (
        <>
          <h2>
            {index + 1}. {question.question}
          </h2>
          <ul>
            <li ref={option1} onClick={(e) => checkAnswer(e, 1)}>
              {question.option1}
            </li>
            <li ref={option2} onClick={(e) => checkAnswer(e, 2)}>
              {question.option2}
            </li>
            <li ref={option3} onClick={(e) => checkAnswer(e, 3)}>
              {question.option3}
            </li>
            <li ref={option4} onClick={(e) => checkAnswer(e, 4)}>
              {question.option4}
            </li>
          </ul>
          <button onClick={next}>Next</button>
          <div className="index">
            {index + 1} of {dummyQuestions.length} questions
          </div>
        </>
      ) : (
        <>
          <h2>
            You Scored: {score} out of {dummyQuestions.length}
          </h2>
          <button onClick={reset}>Reset</button>
        </>
      )}
    </div>
  );
};

export default Quiz;
