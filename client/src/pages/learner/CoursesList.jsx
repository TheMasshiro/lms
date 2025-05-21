import React, { useContext, useEffect, useState } from "react";
import CourseCard from "../../components/learner/courseCard";
import { AppContext } from "../../context/AppContext";
import { useParams } from "react-router-dom";
import SearchBar from "../../components/learner/SearchBar";
import { IoMdClose } from "react-icons/io";
import { AiOutlinePlus } from "react-icons/ai";

const CoursesList = () => {
  const { input } = useParams();
  const { allCourses, navigate } = useContext(AppContext);
  const [filteredCourse, setFilteredCourse] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      const tempCourses = allCourses.slice();
      input
        ? setFilteredCourse(
            tempCourses.filter((item) =>
              item.courseTitle.toLowerCase().includes(input.toLowerCase())
            )
          )
        : setFilteredCourse(tempCourses);
      setIsLoading(false);
    }
  }, [allCourses, input]);

  return (
    <div className="bg-blue-50 min-h-screen p-6 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Available Courses
              </h1>
            </div>
            <div className="w-full md:w-auto">
              <SearchBar data={input} />
            </div>
          </div>
        </div>

        {input && (
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-blue-200 rounded-full text-blue-800 shadow-md">
              <span className="font-medium">Search: {input}</span>
              <button
                onClick={() => navigate("/student/courses/")}
                className="p-1 hover:bg-blue-100 rounded-full transition-colors"
                aria-label="Clear search"
              >
                <IoMdClose className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading courses...</p>
          </div>
        ) : filteredCourse.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourse.map((course, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <div className="p-6">
              <AiOutlinePlus className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No courses found
              </h3>
              <p className="text-gray-600 mb-6">
                {input
                  ? `No courses match your search for "${input}"`
                  : "There are no courses available at the moment."}
              </p>
              <button
                onClick={() => navigate("/student/courses/")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse All Courses
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesList;