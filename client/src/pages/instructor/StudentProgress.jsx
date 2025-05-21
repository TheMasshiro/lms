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
} from "react-icons/fa";

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
    } catch (error) {
      toast.error(error.message || "Error loading student progress");
      setIsModalOpen(false);
    } finally {
      setIsModalLoading(false);
    }
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
    <div className="bg-blue-50 min-h-screen p-6 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex-grow">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Student Progress
              </h1>
              <p className="text-gray-600">
                View and manage your students' progress in your courses.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Students
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by name or email"
              />
            </div>
            <div className="md:w-1/3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Course
              </label>
              <select
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <div className="p-6">
              <HiPlus className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Students Yet
              </h3>
              <p className="text-gray-600 mb-6">
                You don't have any students enrolled in your courses yet.
              </p>
              <button
                onClick={() => navigate("/educator/students")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Manage Students
              </button>
            </div>
          </div>
        ) : filteredMyStudents.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <div className="p-6">
              <FaExclamationTriangle className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Students Found
              </h3>
              <p className="text-gray-600 mb-6">
                No students match your current search or course filter.
              </p>
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
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
            <div className="bg-gray-50 px-6 py-3 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">{filteredMyStudents.length}</span>{" "}
                of <span className="font-medium">{myStudents.length}</span>{" "}
                students
              </div>
              <button
                onClick={() => fetchMyStudents()}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <FaSync className="h-4 w-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="border-b px-6 py-4 flex justify-between items-center sticky top-0 bg-white z-10">
              <div className="flex items-center space-x-4">
                <img
                  src={selectedStudent.imageUrl}
                  alt={selectedStudent.name}
                  className="h-12 w-12 rounded-full object-cover border-2 border-blue-500"
                />
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {selectedStudent.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selectedStudent.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="h-6 w-6" />
              </button>
            </div>

            <div className="px-6 py-4">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Student Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Course Progress
                </h3>

                {isModalLoading ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <FaSpinner className="animate-spin h-10 w-10 mx-auto text-blue-500 mb-3" />
                    <h4 className="text-md font-medium text-gray-800 mb-1">
                      Loading course progress...
                    </h4>
                  </div>
                ) : studentCoursesProgress.length > 0 ? (
                  <div className="space-y-4">
                    {studentCoursesProgress.map((courseProgress) => {
                      const percentage = getProgressPercentage(
                        courseProgress.lectureCompleted,
                        courseProgress.totalLectures
                      );

                      return (
                        <div
                          key={courseProgress.courseId}
                          className="bg-gray-50 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-md font-medium text-gray-800">
                              {courseProgress.courseTitle || "Unknown Course"}
                            </h4>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <FaFileAlt className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                    <h4 className="text-lg font-medium text-gray-800 mb-1">
                      No Course Data
                    </h4>
                    <p className="text-gray-500">
                      This student hasn't started any courses yet.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t px-6 py-4 flex justify-end sticky bottom-0 bg-white">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
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
