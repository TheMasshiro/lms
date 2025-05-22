import { useUser } from "@clerk/clerk-react";
import { useRef, useState, useEffect } from "react";
import { RANDOM_TECH_QUESTIONS } from "./configs/questions";
import "../../../components/css/quiz.css";

const Quiz = () => {
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [question, setQuestion] = useState(null);
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

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    const shuffledQuestions = shuffleArray(RANDOM_TECH_QUESTIONS);
    const selectedQuestions = shuffledQuestions.slice(0, 10);
    setQuizQuestions(selectedQuestions);
    setQuestion(selectedQuestions[0]);
  }, []);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const checkAnswer = (e, ans) => {
    if (!lock && question) {
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
      if (index === quizQuestions.length - 1) {
        setResult(true);
        return;
      }
      setIndex(index + 1);
      setQuestion(quizQuestions[index + 1]);
      setLock(false);
      optionArray.forEach((option) => {
        option.current.classList.remove("rong");
        option.current.classList.remove("korek");
      });
    }
  };

  const reset = () => {
    const shuffledQuestions = shuffleArray(RANDOM_TECH_QUESTIONS);
    const selectedQuestions = shuffledQuestions.slice(0, 10);

    setQuizQuestions(selectedQuestions);
    setIndex(0);
    setQuestion(selectedQuestions[0]);
    setScore(0);
    setLock(false);
    setResult(false);
  };

  if (!question) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="quizContainer">
        <h1>Programming Quiz</h1>
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
              {index + 1} of {quizQuestions.length} questions
            </div>
          </>
        ) : (
          <div className="result-container">
            <h2>
              You Scored: {score} out of {quizQuestions.length}
            </h2>
            <p className="text-center mb-4">
              {score === quizQuestions.length
                ? "Perfect! Amazing job!"
                : score > quizQuestions.length / 2
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
