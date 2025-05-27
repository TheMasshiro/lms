import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loading from "../../components/learner/Loading";
import { AppContext } from "../../context/AppContext";
import { HiPlus } from "react-icons/hi";
import {
  FaExclamationTriangle,
  FaSync,
  FaTimes,
  FaSpinner,
  FaFileAlt,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";
import { BiFileBlank, BiTime } from "react-icons/bi";

const StudentProgress = () => {
  const { backendUrl, getToken, isEducator, calculateNoOfLectures, navigate } =
    useContext(AppContext);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [myStudents, setMyStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentCoursesProgress, setStudentCoursesProgress] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [studentSubmissions, setStudentSubmissions] = useState([]);
  const [isSubmissionsLoading, setIsSubmissionsLoading] = useState(false);

  const fetchEducatorCourses = async () => {
    try {
      setIsLoading(true);
      const token = await getToken();
      const { data } = await axios.get(backendUrl + "/api/educator/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setCourses(data.courses);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMyStudents = async () => {
    try {
      setIsLoading(true);
      const token = await getToken();
      const { data } = await axios.get(
        backendUrl + "/api/educator/my-students",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        setMyStudents(data.students);
      } else {
        toast.error(data.message || "Failed to fetch students");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudentSubmissions = async (studentId) => {
    try {
      setIsSubmissionsLoading(true);
      const token = await getToken();

      const allSubmissions = [];
      for (const course of enrolledCourses) {
        try {
          const { data } = await axios.get(
            `${backendUrl}/api/educator/student-submissions/${course._id}/${studentId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (data.success) {
            const submissionsWithCourse = data.submissions.map((submission) => ({
              ...submission,
              courseTitle: course.courseTitle,
              courseId: course._id,
            }));
            allSubmissions.push(...submissionsWithCourse);
          }
        } catch (error) {
          console.error(`Error fetching submissions for course ${course._id}:`, error);
        }
      }

      setStudentSubmissions(allSubmissions);
    } catch (error) {
      toast.error("Error fetching student submissions");
    } finally {
      setIsSubmissionsLoading(false);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchEducatorCourses();
      fetchMyStudents();
    }
  }, [isEducator]);

  const filteredMyStudents = myStudents.filter((student) => {
    const matchesSearch =
      searchTerm === "" ||
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCourse =
      filterCourse === "" ||
      student.enrolledCourses.some((course) => course === filterCourse);

    return matchesSearch && matchesCourse;
  });

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterCourse("");
  };

  const handleViewProgress = async (student) => {
    try {
      setIsModalLoading(true);
      setSelectedStudent(student);
      setIsModalOpen(true);
      setStudentSubmissions([]);

      const token = await getToken();
      const enrolledCoursesResponse = await axios.post(
        backendUrl + "/api/educator/student-courses",
        { userId: student.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!enrolledCoursesResponse.data.success) {
        throw new Error(
          enrolledCoursesResponse.data.message ||
            "Failed to fetch enrolled courses"
        );
      }

      const studentCourses =
        enrolledCoursesResponse.data.enrolledCourses.reverse();
      setEnrolledCourses(studentCourses);

      const progressData = await Promise.all(
        studentCourses
          .filter((enrolledCourse) =>
            courses.some((course) => course._id === enrolledCourse._id)
          )
          .map(async (course) => {
            const { data } = await axios.post(
              backendUrl + "/api/user/get-user-course-progress",
              { courseId: course._id, userId: student.id },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            const matchedCourse = courses.find((c) => c._id === course._id);
            let totalLectures = calculateNoOfLectures(matchedCourse);
            const lectureCompleted = data.progressData
              ? data.progressData.lectureCompleted.length
              : 0;

            return {
              courseId: course._id,
              courseTitle: matchedCourse?.courseTitle || "Unknown Course",
              totalLectures,
              lectureCompleted,
            };
          })
      );

      setStudentCoursesProgress(progressData);

      await fetchStudentSubmissions(student.id);
    } catch (error) {
      toast.error(error.message || "Error loading student progress");
      setIsModalOpen(false);
    } finally {
      setIsModalLoading(false);
    }
  };

  const getActivityTitle = (activityId, courseId) => {
    const course = enrolledCourses.find((c) => c._id === courseId);
    if (!course) return "Unknown Activity";

    for (const chapter of course.courseContent) {
      for (const activity of chapter.chapterActivities) {
        if (activity.activityId === activityId) {
          return activity.activityTitle;
        }
      }
    }
    return "Unknown Activity";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusText = (percentage) => {
    if (percentage >= 100) return "Completed";
    if (percentage >= 75) return "Almost Done";
    if (percentage >= 25) return "In Progress";
    return "Just Started";
  };

  const getStatusColor = (percentage) => {
    if (percentage >= 100) return "bg-green-500";
    if (percentage >= 75) return "bg-blue-500";
    if (percentage >= 25) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getProgressPercentage = (completed, total) => {
    if (!total) return 0;
    return Math.round((completed * 100) / total);
  };

  if (!isEducator || isLoading) {
    return <Loading />;
  }

  return (
    <div className="bg-blue-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col space-y-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                Student Progress
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                View and manage your students' progress in your courses.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 mb-6">
          <div className="flex flex-col space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Students
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Search by name or email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Course
              </label>
              <select
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">All Courses</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.courseTitle}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {myStudents.length === 0 ? (
          <div className="text-center py-8 sm:py-12 bg-white rounded-lg sm:rounded-xl shadow-md">
            <div className="p-4 sm:p-6">
              <HiPlus className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                No Students Yet
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6">
                You don't have any students enrolled in your courses yet.
              </p>
              <button
                onClick={() => navigate("/educator/students")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Manage Students
              </button>
            </div>
          </div>
        ) : filteredMyStudents.length === 0 ? (
          <div className="text-center py-8 sm:py-12 bg-white rounded-lg sm:rounded-xl shadow-md">
            <div className="p-4 sm:p-6">
              <FaExclamationTriangle className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                No Students Found
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6">
                No students match your current search or course filter.
              </p>
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Clear Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden">
            <div className="block md:hidden">
              <div className="divide-y divide-gray-200">
                {filteredMyStudents.map((student) => (
                  <div key={student.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start space-x-3">
                      <img
                        className="h-12 w-12 rounded-full object-cover flex-shrink-0"
                        src={student.imageUrl}
                        alt={student.name}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {student.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {student.email}
                            </p>
                          </div>
                          <div className="flex flex-col items-end space-y-1">
                            {student.isMember ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Member
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                Non-Member
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center mt-2">
                          <div className="text-xs text-gray-500">
                            {student.enrolledCourses.length} courses enrolled
                          </div>
                          <button
                            onClick={() => handleViewProgress(student)}
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded-md transition-colors text-xs font-medium"
                          >
                            View Progress
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Student
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Enrolled Courses
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMyStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={student.imageUrl}
                              alt={student.name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {student.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {student.isMember ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Member
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  Non-Member
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {student.enrolledCourses.length} courses
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleViewProgress(student)}
                          className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded-md transition-colors"
                        >
                          View Progress
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-gray-50 px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div className="text-sm text-gray-700 text-center sm:text-left">
                Showing{" "}
                <span className="font-medium">{filteredMyStudents.length}</span>{" "}
                of <span className="font-medium">{myStudents.length}</span>{" "}
                students
              </div>
              <button
                onClick={() => fetchMyStudents()}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 w-full sm:w-auto"
              >
                <FaSync className="h-4 w-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="border-b px-4 sm:px-6 py-4 flex justify-between items-center sticky top-0 bg-white z-10">
              <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
                <img
                  src={selectedStudent.imageUrl}
                  alt={selectedStudent.name}
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover border-2 border-blue-500 flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
                    {selectedStudent.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 truncate">
                    {selectedStudent.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 flex-shrink-0 ml-2"
              >
                <FaTimes className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>

            <div className="px-4 sm:px-6 py-4">
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                      Student Information
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <p className="font-medium">
                          {selectedStudent.isMember ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Member
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Non-Member
                            </span>
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Enrolled In</p>
                        <p className="font-medium">
                          {selectedStudent.enrolledCourses.length} courses
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                      Course Progress
                    </h3>

                    {isModalLoading ? (
                      <div className="text-center py-6 sm:py-8 bg-gray-50 rounded-lg">
                        <FaSpinner className="animate-spin h-8 w-8 sm:h-10 sm:w-10 mx-auto text-blue-500 mb-3" />
                        <h4 className="text-sm sm:text-md font-medium text-gray-800 mb-1">
                          Loading course progress...
                        </h4>
                      </div>
                    ) : studentCoursesProgress.length > 0 ? (
                      <div className="space-y-3 sm:space-y-4">
                        {studentCoursesProgress.map((courseProgress) => {
                          const percentage = getProgressPercentage(
                            courseProgress.lectureCompleted,
                            courseProgress.totalLectures
                          );

                          return (
                            <div
                              key={courseProgress.courseId}
                              className="bg-gray-50 rounded-lg p-3 sm:p-4"
                            >
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 space-y-2 sm:space-y-0">
                                <h4 className="text-sm sm:text-md font-medium text-gray-800 line-clamp-2">
                                  {courseProgress.courseTitle || "Unknown Course"}
                                </h4>
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium self-start sm:self-center ${
                                    percentage >= 100
                                      ? "bg-green-100 text-green-800"
                                      : percentage >= 75
                                      ? "bg-blue-100 text-blue-800"
                                      : percentage >= 25
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {getStatusText(percentage)}
                                </span>
                              </div>

                              <div className="flex justify-between text-xs text-gray-600 mb-1">
                                <span>
                                  {courseProgress.lectureCompleted} /{" "}
                                  {courseProgress.totalLectures} lectures completed
                                </span>
                                <span className="font-medium">{percentage}%</span>
                              </div>

                              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${getStatusColor(percentage)}`}
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-6 sm:py-8 bg-gray-50 rounded-lg">
                        <FaFileAlt className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-gray-400 mb-3" />
                        <h4 className="text-base sm:text-lg font-medium text-gray-800 mb-1">
                          No Course Data
                        </h4>
                        <p className="text-sm text-gray-500">
                          This student hasn't started any courses yet.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
                    Activity Submissions
                  </h3>

                  {isSubmissionsLoading ? (
                    <div className="text-center py-6 sm:py-8 bg-gray-50 rounded-lg">
                      <FaSpinner className="animate-spin h-6 w-6 sm:h-8 sm:w-8 mx-auto text-blue-500 mb-3" />
                      <p className="text-sm text-gray-600">Loading submissions...</p>
                    </div>
                  ) : studentSubmissions.length === 0 ? (
                    <div className="text-center py-6 sm:py-8 bg-gray-50 rounded-lg">
                      <BiFileBlank className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-gray-400 mb-2 opacity-50" />
                      <p className="text-sm text-gray-500">No activity submissions yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-80 sm:max-h-96 overflow-y-auto">
                      {studentSubmissions.map((submission) => (
                        <div
                          key={submission._id}
                          className="border border-gray-200 rounded-lg p-3 sm:p-4"
                        >
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 space-y-2 sm:space-y-0">
                            <div className="min-w-0 flex-1">
                              <h5 className="font-medium text-gray-800 text-sm line-clamp-2">
                                {getActivityTitle(
                                  submission.activityId,
                                  submission.courseId
                                )}
                              </h5>
                              <p className="text-xs sm:text-sm text-blue-600 truncate">
                                {submission.courseTitle}
                              </p>
                            </div>
                            <span
                              className={`px-2 py-1 rounded text-xs whitespace-nowrap self-start sm:self-center ml-0 sm:ml-2 ${
                                submission.status === "submitted"
                                  ? "bg-blue-100 text-blue-800"
                                  : submission.status === "graded"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {submission.status}
                            </span>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-1">
                              <BiTime className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                              <span className="truncate">{formatDate(submission.submittedAt)}</span>
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
                              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs sm:text-sm mb-2"
                            >
                              <BiFileBlank className="h-3 w-3 sm:h-4 sm:w-4" />
                              View Submission
                            </a>
                          )}

                          {submission.feedback && (
                            <div className="mt-2 p-2 bg-yellow-50 rounded text-xs sm:text-sm">
                              <p className="font-medium text-yellow-800">
                                Feedback:
                              </p>
                              <p className="text-yellow-700">{submission.feedback}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t px-4 sm:px-6 py-4 flex justify-end sticky bottom-0 bg-white">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm w-full sm:w-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProgress;