import React from "react";
import { Route, Routes, useMatch } from "react-router-dom";
import Home from "./pages/learner/home";
import CourseList from "./pages/learner/coursesList";
import CourseDetails from "./pages/learner/courseDetails";
import Editor from "./pages/learner/editor/Editor";
import VPlayer from "./pages/learner/vPlayer";
import About from "./pages/learner/about";
import Quiz from "./pages/learner/quiz";
import Learnmore from "./pages/learner/learnmore";
import Privacy from "./pages/learner/privacy";
import Loading from "./components/learner/Loading";
import Educator from "./pages/instructor/educator";
import Educator_Dashboard from "./pages/instructor/dashboard";
import AddCourse from "./pages/instructor/addCourse";
import Educator_Courses from "./pages/instructor/courses";
import Educator_Enrollment from "./pages/instructor/enrollment";
import LearnersEnrolled from "./pages/instructor/learnersEnrolled";
import Navbar from "./components/learner/navbar";
import "quill/dist/quill.snow.css";
import { ToastContainer } from "react-toastify";
import GetStarted from "./pages/learner/getstarted";
import GameInfoCard from "./pages/learner/GameInfoCard";
import Tictatoe from "./pages/learner/tictactoe";
import Snake from "./pages/learner/snake";
import Cell from "./pages/learner/Cell";
import Student from "./pages/learner/student";
import Student_Enrollment from "./pages/learner/enrollment";
import RouteWatcher from "./components/learner/RouteWatcher";


const App = () => {
  const isEducatorRoute = useMatch("/educator/*");
  const isStudentRoute = useMatch("/student/*");

  const hideNavbar = isEducatorRoute || isStudentRoute;

  return (
    <div className="text-default min-h-screen bg-white">
      <ToastContainer />
      {!hideNavbar && <Navbar />}
      <RouteWatcher />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/learnmore" element={<Learnmore />} />

        <Route path="/editor" element={<Editor />} />

        <Route path="/quiz" element={<Quiz />} />
        <Route path="/getstarted" element={<GetStarted />} />
        <Route path="/game-info" element={<GameInfoCard />} />
        <Route path="/tictactoe" element={<Tictatoe />} />
        <Route path="/snake" element={<Snake />} />
        <Route path="/cell" element={<Cell />} />

        <Route path="/privacy" element={<Privacy />} />
        <Route path="/course-list" element={<CourseList />} />
        <Route path="/course-list/:input" element={<CourseList />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/vPlayer/:courseId" element={<VPlayer />} />
        <Route path="/loading/:path" element={<Loading />} />

        <Route path="/student" element={<Student />}>
          <Route path="/student" element={<Student_Enrollment />} />
        </Route>

        <Route path="/educator" element={<Educator />}>
          <Route path="/educator" element={<Educator_Dashboard />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="courses" element={<Educator_Courses />} />
          <Route path="learners-enrolled" element={<LearnersEnrolled />} />
          <Route path="enrollment" element={<Educator_Enrollment />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
