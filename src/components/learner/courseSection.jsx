import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import CourseCard from './courseCard';
import ParticlesButton from './ParticlesButton';

const CourseSection = () => {
  const { allCourses } = useContext(AppContext);

  return (
    <div className="py-16 md:px-40 px-8">
      <h2 className="text-3xl font-medium text-gray-800">Learn & gain new knowledge</h2>
      <p className="text-sm md:text-base text-gray-500 mt-3">
        Learnify empowers you to grow and succeed 
        in a supportive and interactive learning environment.
      </p>

      <div className="grid grid-cols-auto px-4 md:px-0 md:my-16 my-10 gap-4">
        {allCourses?.slice(0, 4).map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      <Link 
        to="/course-list" 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="inline-block"
        aria-label="Go to course list"
      >
        <ParticlesButton>Courses</ParticlesButton>
      </Link>
    </div>
  );
};

export default CourseSection;
