import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/learner/Loading";
import { toast } from "react-toastify";
import axios from "axios";
import { FiPlus, FiX } from "react-icons/fi";
import { BiBook, BiCheckCircle, BiPlay, BiFileBlank, BiTime } from "react-icons/bi";

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
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseSubmissions, setCourseSubmissions] = useState([]);
  const [isSubmissionsLoading, setIsSubmissionsLoading] = useState(false);

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

  const getCourseSubmissions = async (courseId) => {
    try {
      setIsSubmissionsLoading(true);
      const token = await getToken();
      const { data } = await axios.get(
        `${backendUrl}/api/user/submissions/${courseId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setCourseSubmissions(data.submissions);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmissionsLoading(false);
    }
  };

  const openCourseDetails = (course) => {
    setSelectedCourse(course);
    getCourseSubmissions(course._id);
  };

  const closeCourseDetails = () => {
    setSelectedCourse(null);
    setCourseSubmissions([]);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityTitle = (activityId, course) => {
    for (const chapter of course.courseContent) {
      for (const content of chapter.chapterContent) {
        if (content.activities) {
          const activity = content.activities.find(act => act.activityId === activityId);
          if (activity) {
            return activity.activityTitle;
          }
        }
      }
    }
    return "Unknown Activity";
  };

  const getTotalActivities = (course) => {
    let totalActivities = 0;
    course.courseContent.forEach(chapter => {
      chapter.chapterContent.forEach(content => {
        if (content.activities && content.activities.length > 0) {
          totalActivities += content.activities.length;
        }
      });
    });
    return totalActivities;
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
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 md:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 md:mb-8 gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              Course Progress
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Track your learning journey across all courses
            </p>
          </div>

          <button
            onClick={() => navigate("/student/courses")}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            <FiPlus className="h-4 w-4 sm:h-5 sm:w-5" />
            Join New Course
          </button>
        </div>

        {enrolledCourses.length === 0 ? (
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 md:p-8 text-center">
            <div className="flex flex-col items-center justify-center py-6 sm:py-8 md:py-12">
              <BiBook className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mb-3 sm:mb-4" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                No Enrolled Courses
              </h2>
              <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6 max-w-md px-2">
                You haven't enrolled in any courses yet. Join a course to start
                tracking your progress.
              </p>
              <button
                onClick={() => navigate("/student/courses")}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                <FiPlus className="h-4 w-4 sm:h-5 sm:w-5" />
                Browse Courses
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-3 sm:mb-4 bg-white p-3 sm:p-4 rounded-lg shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{enrolledCourses.length}</span>{" "}
                  courses enrolled
                </div>

                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <div className="text-sm text-gray-600 self-center hidden sm:block">
                    Sort by:
                  </div>
                  <div className="text-xs text-gray-600 mb-1 sm:hidden">
                    Sort by:
                  </div>
                  <div className="flex gap-1 sm:gap-2 overflow-x-auto">
                    <button
                      onClick={() => setSortOption("progress-high")}
                      className={`px-2 sm:px-3 py-1.5 text-xs rounded-md whitespace-nowrap ${
                        sortOption === "progress-high"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Highest Progress
                    </button>
                    <button
                      onClick={() => setSortOption("progress-low")}
                      className={`px-2 sm:px-3 py-1.5 text-xs rounded-md whitespace-nowrap ${
                        sortOption === "progress-low"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Lowest Progress
                    </button>
                    <button
                      onClick={() => setSortOption("title")}
                      className={`px-2 sm:px-3 py-1.5 text-xs rounded-md whitespace-nowrap ${
                        sortOption === "title"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Course Title
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {sortedCourses.map((course, index) => {
                const percentage = course.percentage;
                const totalActivities = getTotalActivities(course);

                return (
                  <div
                    key={course._id}
                    className="bg-white rounded-lg sm:rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => navigate("/student/" + course._id)}
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="relative w-full md:w-60 h-32 sm:h-40 md:h-48 flex-shrink-0">
                        <img
                          src={
                            course.courseThumbnail || "/api/placeholder/240/160"
                          }
                          alt={course.courseTitle}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-center py-1 md:hidden">
                          <span className="text-xs sm:text-sm font-medium">
                            {getStatusText(percentage)}
                          </span>
                        </div>
                      </div>

                      <div className="flex-1 p-3 sm:p-4 flex flex-col min-h-0">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-3 gap-2">
                          <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 line-clamp-2 flex-1">
                            {course.courseTitle}
                          </h2>
                          <div className="hidden md:flex items-center flex-shrink-0">
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-white text-xs ${getStatusColor(
                                percentage
                              )}`}
                            >
                              {getStatusText(percentage)}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 sm:gap-3 mb-3 flex-1">
                          <div>
                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                              <span>Progress</span>
                              <span className="font-medium">{percentage}%</span>
                            </div>
                            <div className="h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${getStatusColor(percentage)}`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                            <div className="bg-gray-50 p-2 rounded-lg">
                              <p className="text-gray-500 text-xs">Duration</p>
                              <p className="font-medium text-gray-800 truncate text-xs">
                                {calculateCourseDuration(course)}
                              </p>
                            </div>

                            <div className="bg-gray-50 p-2 rounded-lg">
                              <p className="text-gray-500 text-xs">Lectures</p>
                              <p className="font-medium text-gray-800 text-xs">
                                <span className="text-blue-600">
                                  {course.progress.lectureCompleted}
                                </span>
                                <span> / {course.progress.totalLectures}</span>
                              </p>
                            </div>

                            <div className="bg-gray-50 p-2 rounded-lg">
                              <p className="text-gray-500 text-xs">Activities</p>
                              <p className="font-medium text-gray-800 text-xs">
                                {totalActivities}
                              </p>
                            </div>

                            <div className="bg-gray-50 p-2 rounded-lg">
                              <p className="text-gray-500 text-xs">Educator</p>
                              <p className="font-medium text-gray-800 truncate text-xs">
                                {course.educator?.name || "Unknown"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 mt-auto">
                          <button
                            className="flex items-center justify-center gap-1 bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md hover:bg-blue-700 transition-colors text-xs sm:text-sm order-2 sm:order-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate("/student/" + course._id);
                            }}
                          >
                            {percentage === 100 ? (
                              <>
                                <BiCheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span className="hidden sm:inline">Review Course</span>
                                <span className="sm:hidden">Review</span>
                              </>
                            ) : (
                              <>
                                <BiPlay className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span className="hidden sm:inline">Continue Learning</span>
                                <span className="sm:hidden">Continue</span>
                              </>
                            )}
                          </button>

                          <button
                            className="flex items-center justify-center gap-1 text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium py-1.5 order-1 sm:order-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              openCourseDetails(course);
                            }}
                          >
                            <BiFileBlank className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">View Details</span>
                            <span className="sm:hidden">Details</span>
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

        {selectedCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
              <div className="flex justify-between items-center p-3 sm:p-4 md:p-6 border-b">
                <h3 className="text-sm sm:text-lg md:text-xl font-semibold text-gray-800 line-clamp-2 pr-2">
                  {selectedCourse.courseTitle} - Details
                </h3>
                <button
                  onClick={closeCourseDetails}
                  className="text-gray-400 hover:text-gray-600 flex-shrink-0 p-1"
                >
                  <FiX className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>

              <div className="p-3 sm:p-4 md:p-6 overflow-y-auto max-h-[calc(95vh-80px)] sm:max-h-[calc(90vh-120px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">Progress Overview</h4>
                    <div className="space-y-1 sm:space-y-2">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">Completion:</span>
                        <span className="font-medium">{selectedCourse.percentage}%</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">Lectures Completed:</span>
                        <span className="font-medium">
                          {selectedCourse.progress.lectureCompleted} / {selectedCourse.progress.totalLectures}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">Total Activities:</span>
                        <span className="font-medium">{getTotalActivities(selectedCourse)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">Course Info</h4>
                    <div className="space-y-1 sm:space-y-2">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">{calculateCourseDuration(selectedCourse)}</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">Educator:</span>
                        <span className="font-medium truncate ml-2">{selectedCourse.educator?.name || "Unknown"}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-1 rounded text-xs text-white ${getStatusColor(selectedCourse.percentage)}`}>
                          {getStatusText(selectedCourse.percentage)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">Activity Submissions</h4>
                  {isSubmissionsLoading ? (
                    <div className="flex justify-center py-6 sm:py-8">
                      <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : courseSubmissions.length === 0 ? (
                    <div className="text-center py-6 sm:py-8 text-gray-500">
                      <BiFileBlank className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm sm:text-base">No activity submissions yet</p>
                    </div>
                  ) : (
                    <div className="space-y-2 sm:space-y-3">
                      {courseSubmissions.map((submission) => (
                        <div key={submission._id} className="border border-gray-200 rounded-lg p-3 sm:p-4">
                          <div className="flex flex-col sm:flex-row justify-between items-start mb-2 gap-1 sm:gap-2">
                            <h5 className="font-medium text-gray-800 text-sm sm:text-base line-clamp-2 flex-1">
                              {getActivityTitle(submission.activityId, selectedCourse)}
                            </h5>
                            <span className={`px-2 py-1 rounded text-xs flex-shrink-0 ${
                              submission.status === 'Submitted' ? 'bg-blue-100 text-blue-800' :
                              submission.status === 'Graded' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {submission.status}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <BiTime className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span>{formatDate(submission.submittedAt)}</span>
                            </div>
                            {submission.grade && (
                              <div className="font-medium text-green-600">
                                Grade: {submission.grade}
                              </div>
                            )}
                          </div>
                          {submission.submissionUrl && (
                            <a
                              href={submission.submissionUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 mt-2 text-blue-600 hover:text-blue-700 text-xs sm:text-sm"
                            >
                              <BiFileBlank className="h-3 w-3 sm:h-4 sm:w-4" />
                              View Submission
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;
