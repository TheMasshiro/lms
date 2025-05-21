import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import "quill/dist/quill.snow.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

// Components
import Loading from "./components/learner/Loading";
import Navbar from "./components/learner/Navbar";
import RouteWatcher from "./components/learner/RouteWatcher";
import RequireRole from "./components/learner/requireRole";

// Public Pages
import About from "./pages/learner/public/about";
import Contact from "./pages/learner/public/contacts";
import LearnMore from "./pages/learner/public/learnmore";
import Privacy from "./pages/learner/public/privacy";
import RoleChoice from "./pages/learner/roleChoice";

// Educator Pages
import AddCourse from "./pages/instructor/course/AddCourse";
import EducatorCourses from "./pages/instructor/Courses";
import EducatorDashboard from "./pages/instructor/Dashboard";
import EducatorHome from "./pages/instructor/home/educator";
import EducatorSettings from "./pages/instructor/Settings";
import StudentProgress from "./pages/instructor/StudentProgress";
import StudentManagement from "./pages/instructor/Students";
import Preview from "./pages/instructor/course/Preview";

// Learner Pages
import CourseDetails from "./pages/learner/CourseDetails";
import CoursesList from "./pages/learner/CoursesList";
import Editor from "./pages/learner/editor/Editor";
import Enrollment from "./pages/learner/Enrollment";
import GetStarted from "./pages/learner/getstarted";
import Home from "./pages/learner/home";
import StudentHome from "./pages/learner/home/student";
import PersonalInfo from "./pages/learner/PersonalInfo";
import Progress from "./pages/learner/Progress";
import StudentSettings from "./pages/learner/Settings";
import VPlayer from "./pages/learner/vPlayer";

// Games
import Cell from "./pages/learner/games/Cell";
import GameInfoCard from "./pages/learner/games/GameInfoCard";
import Quiz from "./pages/learner/games/quiz";
import Snake from "./pages/learner/games/snake";
import Tictactoe from "./pages/learner/games/tictactoe";



const App = () => {
    const { user, isLoaded } = useUser();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isLoaded) {
            const timer = setTimeout(() => {
                setLoading(false);
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [isLoaded]);

    if (loading || !isLoaded) {
        return <Loading />;
    }

    return (
        <div className="text-default min-h-screen bg-white">
            <ToastContainer />
            <Navbar />
            <RouteWatcher />

            <Routes>
                <Route path="/role/choice" element={<RoleChoice />} />
                <Route
                    path="*"
                    element={
                        <RequireRole>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/about" element={<About />} />
                                <Route path="/learnmore" element={<LearnMore />} />
                                <Route path="/contacts" element={<Contact />} />
                                <Route path="/editor" element={<Editor />} />
                                <Route path="/quiz" element={<Quiz />} />
                                <Route path="/get-started" element={<GetStarted />} />
                                <Route path="/game-info" element={<GameInfoCard />} />
                                <Route path="/tictactoe" element={<Tictactoe />} />
                                <Route path="/snake" element={<Snake />} />
                                <Route path="/cell" element={<Cell />} />
                                <Route path="/privacy" element={<Privacy />} />
                                <Route path="/loading/:path" element={<Loading />} />

                                {/* Student Routes */}
                                <Route path="/student" element={<StudentHome />}>
                                    <Route path="/student" element={<Enrollment />} />
                                    <Route path=":courseId" element={<VPlayer />} />
                                    <Route path="progress" element={<Progress />} />
                                    <Route path="courses" element={<CoursesList />} />
                                    <Route path="courses/:input" element={<CoursesList />} />
                                    <Route path="courses/view/:id" element={<CourseDetails />} />
                                </Route>

                                <Route path="/settings/student" element={<StudentSettings />}>
                                    <Route path="/settings/student" element={<PersonalInfo />} />
                                </Route>

                                {/* Educator Routes */}
                                <Route path="/educator" element={<EducatorHome />}>
                                    <Route path="/educator" element={<EducatorDashboard />} />
                                    <Route path="courses" element={<EducatorCourses />} />
                                    <Route path="courses/:courseId" element={<Preview />} />
                                    <Route path="students" element={<StudentManagement />} />
                                    <Route path="progress" element={<StudentProgress />} />
                                    <Route path="add-course" element={<AddCourse />} />
                                </Route>

                                <Route path="/settings/educator" element={<EducatorSettings />}>
                                    <Route path="/settings/educator" element={<PersonalInfo />} />
                                </Route>
                            </Routes>
                        </RequireRole>
                    }
                />
            </Routes>
        </div>
    );
};

export default App;
