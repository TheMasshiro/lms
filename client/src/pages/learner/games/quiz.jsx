import { useUser } from "@clerk/clerk-react";
import { useRef, useState, useEffect } from "react";
import { dummyQuestions } from "../../../assets/assets";
import "../../../components/css/quiz.css";

const Quiz = () => {
  const [index, setIndex] = useState(0);
  const [question, setQuestion] = useState(dummyQuestions[index]);
  const [lock, setLock] = useState(false);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const { user } = useUser();

  const option1 = useRef(null);
  const option2 = useRef(null);
  const option3 = useRef(null);
  const option4 = useRef(null);

  const optionArray = [option1, option2, option3, option4];

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

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

      if (isSmallScreen) {
        setTimeout(() => {
          const nextButton = document.querySelector(".quizContainer button");
          if (nextButton) {
            nextButton.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 500);
      }
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

      if (isSmallScreen) {
        setTimeout(() => {
          const questionElement = document.querySelector(".quizContainer h2");
          if (questionElement) {
            questionElement.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 100);
      }
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
    <div className="min-h-screen bg-gray-100 py-8">
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
          <div className="result-container">
            <h2>
              You Scored: {score} out of {dummyQuestions.length}
            </h2>
            <p className="text-center mb-4">
              {score === dummyQuestions.length
                ? "Perfect! Amazing job!"
                : score > dummyQuestions.length / 2
                ? "Good work! Keep improving!"
                : "Keep practicing, you'll get better!"}
            </p>
            <button onClick={reset}>Try Again</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
