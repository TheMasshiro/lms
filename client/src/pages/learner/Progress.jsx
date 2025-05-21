import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/learner/Loading";
import { toast } from "react-toastify";
import axios from "axios";
import { FiPlus } from "react-icons/fi";
import { BiBook, BiCheckCircle, BiPlay } from "react-icons/bi";

const Progress = () => {
  const {
    enrolledCourses,
    navigate,
    calculateCourseDuration,
    calculateNoOfLectures,
    backendUrl,
    userData,
    fetchUserEnrolledCourses,
    getToken,
  } = useContext(AppContext);

  const [progressArray, setProgressArray] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortedCourses, setSortedCourses] = useState([]);
  const [sortOption, setSortOption] = useState("progress-high");

  const getCourseProgress = async () => {
    try {
      const token = await getToken();
      const tempProgressArray = await Promise.all(
        enrolledCourses.map(async (course) => {
          const { data } = await axios.post(
            backendUrl + "/api/user/get-course-progress",
            { courseId: course._id },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          let totalLectures = calculateNoOfLectures(course);
          const lectureCompleted = data.progressData
            ? data.progressData.lectureCompleted.length
            : 0;
          return { totalLectures, lectureCompleted };
        })
      );
      setProgressArray(tempProgressArray);
      setIsLoading(false);
    } catch (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userData) {
      fetchUserEnrolledCourses();
    }
  }, [userData]);

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      getCourseProgress();
    } else if (enrolledCourses.length === 0 && userData) {
      setIsLoading(false);
    }
  }, [enrolledCourses]);

  useEffect(() => {
    if (enrolledCourses.length > 0 && progressArray.length > 0) {
      sortCourses(sortOption);
    }
  }, [progressArray, sortOption]);

  const getProgressPercentage = (completed, total) => {
    if (!total) return 0;
    return Math.round((completed * 100) / total);
  };

  const getStatusColor = (percentage) => {
    if (percentage >= 100) return "bg-green-500";
    if (percentage >= 75) return "bg-blue-500";
    if (percentage >= 25) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStatusText = (percentage) => {
    if (percentage >= 100) return "Completed";
    if (percentage >= 25) return "In Progress";
    return "Just Started";
  };

  const sortCourses = (option) => {
    const coursesWithProgress = enrolledCourses.map((course, index) => {
      const progress = progressArray[index] || {
        totalLectures: 0,
        lectureCompleted: 0,
      };
      const percentage = getProgressPercentage(
        progress.lectureCompleted,
        progress.totalLectures
      );
      return { ...course, progress, percentage };
    });

    let sorted = [...coursesWithProgress];

    switch (option) {
      case "progress-high":
        sorted.sort((a, b) => b.percentage - a.percentage);
        break;
      case "progress-low":
        sorted.sort((a, b) => a.percentage - b.percentage);
        break;
      case "title":
        sorted.sort((a, b) => a.courseTitle.localeCompare(b.courseTitle));
        break;
      default:
        break;
    }

    setSortedCourses(sorted);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="bg-blue-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Course Progress
            </h1>
            <p className="text-gray-600 mt-1">
              Track your learning journey across all courses
            </p>
          </div>

          <button
            onClick={() => navigate("/student/courses")}
            className="mt-4 md:mt-0 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="h-5 w-5" />
            Join New Course
          </button>
        </div>

        {enrolledCourses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="flex flex-col items-center justify-center py-12">
              <BiBook className="h-16 w-16 text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                No Enrolled Courses
              </h2>
              <p className="text-gray-500 mb-6 max-w-md">
                You haven't enrolled in any courses yet. Join a course to start
                tracking your progress.
              </p>
              <button
                onClick={() => navigate("/student/courses")}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiPlus className="h-5 w-5" />
                Browse Courses
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 bg-white p-3 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{enrolledCourses.length}</span>{" "}
                courses enrolled
              </div>

              <div className="flex gap-2">
                <div className="text-sm text-gray-600 mr-2 self-center">
                  Sort by:
                </div>
                <button
                  onClick={() => setSortOption("progress-high")}
                  className={`px-3 py-1.5 text-xs rounded-md ${
                    sortOption === "progress-high"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Highest Progress
                </button>
                <button
                  onClick={() => setSortOption("progress-low")}
                  className={`px-3 py-1.5 text-xs rounded-md ${
                    sortOption === "progress-low"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Lowest Progress
                </button>
                <button
                  onClick={() => setSortOption("title")}
                  className={`px-3 py-1.5 text-xs rounded-md ${
                    sortOption === "title"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Course Title
                </button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-1">
              {sortedCourses.map((course, index) => {
                const percentage = course.percentage;

                return (
                  <div
                    key={course._id}
                    className="cursor-pointer group bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    onClick={() => navigate("/student/" + course._id)}
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="relative md:w-60 h-32 md:h-auto">
                        <img
                          src={
                            course.courseThumbnail || "/api/placeholder/240/160"
                          }
                          alt={course.courseTitle}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-center py-1 md:hidden">
                          <span className="text-sm font-medium">
                            {getStatusText(percentage)}
                          </span>
                        </div>
                      </div>

                      <div className="flex-1 p-3 md:p-4 flex flex-col">
                        <div className="flex flex-col md:flex-row justify-between md:items-center mb-3">
                          <h2 className="text-base md:text-lg font-semibold text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                            {course.courseTitle}
                          </h2>
                          <div className="hidden md:flex items-center mt-2 md:mt-0">
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-white text-xs ${getStatusColor(
                                percentage
                              )}`}
                            >
                              {getStatusText(percentage)}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3 mb-3">
                          <div>
                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                              <span>Progress</span>
                              <span className="font-medium">{percentage}%</span>
                            </div>
                            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${getStatusColor(
                                  percentage
                                )}`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="bg-gray-50 p-2 rounded-lg">
                              <p className="text-gray-500">Duration</p>
                              <p className="font-medium text-gray-800">
                                {calculateCourseDuration(course)}
                              </p>
                            </div>

                            <div className="bg-gray-50 p-2 rounded-lg">
                              <p className="text-gray-500">Lectures</p>
                              <p className="font-medium text-gray-800">
                                <span className="text-blue-600">
                                  {course.progress.lectureCompleted}
                                </span>
                                <span> / {course.progress.totalLectures}</span>
                              </p>
                            </div>

                            <div className="bg-gray-50 p-2 rounded-lg">
                              <p className="text-gray-500">Educator</p>
                              <p className="font-medium text-gray-800 truncate">
                                {course.educator?.name || "Unknown"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-auto flex justify-start">
                          <button
                            className="flex items-center justify-center gap-1 bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 transition-colors text-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate("/student/" + course._id);
                            }}
                          >
                            {percentage === 100 ? (
                              <>
                                <BiCheckCircle className="h-4 w-4" />
                                Review Course
                              </>
                            ) : (
                              <>
                                <BiPlay className="h-4 w-4" />
                                Continue Learning
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Progress;
