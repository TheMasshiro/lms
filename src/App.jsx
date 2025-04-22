import React from 'react'
import { Route, Routes, useMatch } from 'react-router-dom'
import Home from './pages/learner/home'
import CourseList from './pages/learner/coursesList'
import CourseDetails from './pages/learner/courseDetails'
import Enrollment from './pages/learner/enrollment'
import VPlayer from './pages/learner/vPlayer'
import About from './pages/learner/about' 
import Quiz from './pages/learner/quiz'
import Learnmore from './pages/learner/learnmore'
import Privacy from './pages/learner/privacy'
import Loading from './components/learner/Loading'
import Educator from './pages/instructor/educator'
import Dashboard from './pages/instructor/dashboard'
import AddCourse from './pages/instructor/addCourse'
import Courses from './pages/instructor/courses'
import LearnersEnrolled from './pages/instructor/learnersEnrolled'
import Navbar from './components/learner/navbar'
import 'quill/dist/quill.snow.css'

const App = () => {

  const isEducatorRoute = useMatch('/educator/*')

  return (
    <div className='text-default min-h-screen bg-white'>
      {!isEducatorRoute && <Navbar/>}
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/learnmore' element={<Learnmore/>}/>
          <Route path='/quiz' element={<Quiz/>}/>
          <Route path='/privacy' element={<Privacy/>}/>
          <Route path='/course-list' element={<CourseList/>}/>
          <Route path='/course-list/:input' element={<CourseList/>}/>
          <Route path='/course/:id' element={<CourseDetails/>}/>
          <Route path='/enrollment' element={<Enrollment/>}/>
          <Route path='/vPlayer/:courseId' element={<VPlayer/>}/>
          <Route path='/loading/:path' element={<Loading/>}/>

          <Route path='/educator' element={<Educator/>}>
            <Route path='/educator'element={<Dashboard/>}/>
            <Route path='add-course'element={<AddCourse/>}/>
            <Route path='courses'element={<Courses/>}/>
            <Route path='learners-enrolled'element={<LearnersEnrolled/>}/>
          </Route>
        </Routes>
    </div>
  )
}

export default App