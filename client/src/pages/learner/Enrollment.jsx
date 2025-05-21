import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/learner/Loading";
import { toast } from "react-toastify";
import axios from "axios";
import { FiPlus } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";

const Enrollment = () => {
  const {
    enrolledCourses,
    navigate,
    backendUrl,
    userData,
    fetchUserEnrolledCourses,
    getToken,
    isStudent,
  } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddCourse, setIsAddCourse] = useState(false);
  const [courseCode, setCourseCode] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeAddCourseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setIsAddCourse(false), 300);
  };

  const openAddCourseModal = () => {
    setIsAddCourse(true);
    setTimeout(() => setIsModalOpen(true), 10);
  };

  const addEnrollmentsCount = async () => {
    if (!userData) {
      return toast.error("User not found");
    }

    try {
      const token = await getToken();
      const { data } = await axios.post(
        backendUrl + "/api/user/add-enrollment-count",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEnrollCourse = async (courseCode) => {
    try {
      if (!userData) {
        return toast.warn("Please login to enroll in a course");
      }

      if (userData?.enrollmentCount >= 3 && !userData?.isMember) {
        return toast.error(
          "You have reached the maximum number of enrollments, please join the membership to join more enrollments"
        );
      }

      const token = await getToken();
      const { data } = await axios.post(
        backendUrl + "/api/user/enroll-course",
        { courseCode },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        toast.success("Successfully enrolled in the course");
        closeAddCourseModal();
        addEnrollmentsCount();

        setTimeout(() => {
          navigate("/student/");
        }, 1000);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (enrolledCourses) {
      setIsLoading(false);
    }
  }, [enrolledCourses]);

  useEffect(() => {
    if (userData) {
      fetchUserEnrolledCourses();
      setIsLoading(false);
    }
  }, [userData]);

  if (!isStudent || isLoading) {
    return <Loading />;
  }

  return (
    <div className="bg-blue-50 min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-gray-700 text-lg font-medium mb-4">
          Active Courses
        </h2>

        <div className="relative">
          <div
            onClick={openAddCourseModal}
            className="border-2 border-dashed border-blue-200 rounded-lg p-16 flex items-center justify-center bg-white cursor-pointer hover:bg-blue-50 transition-colors duration-300"
          >
            <span className="text-blue-400 font-medium flex items-center">
              <FiPlus className="h-5 w-5 mr-2" />
              Join Course
            </span>
          </div>
        </div>

        {isAddCourse && (
          <div
            className={`fixed inset-0 bg-black transition-opacity duration-300 flex items-center justify-center z-50 ${
              isModalOpen ? "bg-opacity-50" : "bg-opacity-0"
            }`}
            onClick={closeAddCourseModal}
          >
            <div
              className={`bg-white p-8 rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 ${
                isModalOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Join a Course
                </h2>
                <button
                  onClick={closeAddCourseModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <IoMdClose className="h-6 w-6" />
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-6">
                Enter the 10-character course code provided to you.
              </p>

              <div className="mb-6">
                <label
                  htmlFor="courseCode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Course Code
                </label>
                <input
                  id="courseCode"
                  type="text"
                  value={courseCode}
                  onChange={(e) => {
                    if (e.target.value.length <= 10) {
                      setCourseCode(e.target.value.toUpperCase());
                    }
                  }}
                  className="w-full p-3 border border-gray-300 rounded-md text-center text-lg tracking-wider focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="XXXX-XXXX"
                  maxLength={10}
                  autoFocus
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={closeAddCourseModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleEnrollCourse(courseCode)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Join Course
                </button>
              </div>
            </div>
          </div>
        )}

        {enrolledCourses.length > 0 && (
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {enrolledCourses.map((course, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                onClick={() => navigate("student/" + course._id)}
              >
                <div className="flex gap-4 items-center">
                  <img
                    src={course.courseThumbnail || "/api/placeholder/120/90"}
                    alt="Course Thumbnail"
                    className="w-32 h-20 object-cover rounded-lg border"
                  />

                  <div className="flex flex-col flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
                      {course.courseTitle}
                    </h3>

                    <p className="mt-1 text-sm text-gray-600 truncate">
                      Educator:{" "}
                      <span className="font-medium">
                        {course.educator?.name}
                      </span>
                    </p>

                    {course.courseCode && (
                      <p className="text-xs text-gray-400 truncate">
                        Code: {course.courseCode}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Enrollment;
