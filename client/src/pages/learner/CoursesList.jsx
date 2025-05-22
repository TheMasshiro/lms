import React, { useContext, useEffect, useState } from "react";
import CourseCard from "../../components/learner/courseCard";
import { AppContext } from "../../context/AppContext";
import { useParams } from "react-router-dom";
import SearchBar from "../../components/learner/SearchBar";
import { IoMdClose } from "react-icons/io";
import { AiOutlinePlus } from "react-icons/ai";
import { FaBookOpen, FaSearch } from "react-icons/fa";

const CoursesList = () => {
  const { input } = useParams();
  const { allCourses, navigate } = useContext(AppContext);
  const [filteredCourse, setFilteredCourse] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (allCourses) {
      const tempCourses = allCourses ? allCourses.slice() : [];
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
        ) : filteredCourse && filteredCourse.length > 0 ? (
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
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <div className="max-w-md mx-auto p-6">
              {input ? (
                <>
                  <div className="bg-gray-100 p-5 rounded-full inline-block mb-5">
                    <FaSearch className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    No results found
                  </h3>
                  <p className="text-gray-600 mb-8">
                    We couldn't find any courses matching "{input}". Try using
                    different keywords or browse all available courses.
                  </p>
                  <button
                    onClick={() => navigate("/student/courses/")}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Browse All Courses
                  </button>
                </>
              ) : (
                <>
                  <div className="bg-blue-50 p-5 rounded-full inline-block mb-5">
                    <FaBookOpen className="h-10 w-10 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    No Courses Available
                  </h3>
                  <p className="text-gray-600 mb-3">
                    There are currently no courses available in our catalog.
                  </p>
                  <p className="text-gray-500 mb-8">
                    Please check back later as our educators are working on
                    creating new learning opportunities for you.
                  </p>
                  <button
                    onClick={() => navigate("/")}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Return to Homepage
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesList;