import { useContext, useEffect, useState, useCallback } from "react";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/learner/Loading";
import axios from "axios";
import { toast } from "react-toastify";
import AddStudentModal from "./common/AddStudentModal";
import RemoveStudentModal from "./common/RemoveStudentModal";
import { FaPlus, FaTrash, FaUserPlus, FaSync, FaExclamationTriangle } from "react-icons/fa";
import { HiPlus } from "react-icons/hi";

const StudentManagement = () => {
  const { backendUrl, getToken, isEducator, navigate } = useContext(AppContext);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedStudentsCount, setSelectedStudentsCount] = useState({});
  const [selectedStudentNames, setSelectedStudentNames] = useState({});
  const [selectedStudentMember, setSelectedStudentMember] = useState({});
  const [selectedCourseCode, setSelectedCourseCode] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [myStudents, setMyStudents] = useState([]);

  // Fetch educator's courses
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

  // Fetch all students enrolled in the educator's courses
  const fetchAllStudents = async () => {
    try {
      setIsLoading(true);
      const token = await getToken();
      const { data } = await axios.get(backendUrl + "/api/educator/students", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setStudents(data.students);
      } else {
        toast.error(data.message || "Failed to fetch students");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // fetch educator's students with proper useCallback
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
      fetchAllStudents();
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

  // Handle student selection toggle with enrollment count tracking
  const toggleStudentSelection = (id, checked) => {
    setSelectedStudents((prev) => {
      const updatedSelected = checked
        ? [...prev, id]
        : prev.filter((studentId) => studentId !== id);
      return updatedSelected;
    });

    const selectedStudent = myStudents.find((student) => student.id === id);

    if (checked && selectedStudent) {
      setSelectedStudentsCount((prev) => ({
        ...prev,
        [id]: selectedStudent.enrollmentCount,
      }));

      setSelectedStudentMember((prev) => ({
        ...prev,
        [id]: selectedStudent.isMember,
      }));

      setSelectedStudentNames((prev) => ({
        ...prev,
        [id]: selectedStudent.name,
      }));
    } else {
      setSelectedStudentsCount((prev) => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });

      setSelectedStudentMember((prev) => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });

      setSelectedStudentNames((prev) => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }
  };

  // Toggle select all students with enrollment count tracking
  const toggleSelectAll = () => {
    if (selectedStudents.length === filteredMyStudents.length) {
      setSelectedStudents([]);
      setSelectedStudentsCount({});
      setSelectedStudentMember({});
      setSelectedStudentNames({});
    } else {
      const allIds = filteredMyStudents.map((s) => s.id);

      const countMap = {};
      const memberMap = {};
      const nameMap = {};

      filteredMyStudents.forEach((s) => {
        countMap[s.id] = s.enrollmentCount;
        memberMap[s.id] = s.isMember;
        nameMap[s.id] = s.name;
      });

      setSelectedStudents(allIds);
      setSelectedStudentsCount(countMap);
      setSelectedStudentMember(memberMap);
      setSelectedStudentNames(nameMap);
    }
  };

  // Handle clear filters functionality
  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterCourse("");
  };

  // Handle add educator students
  const handleAddStudents = async (addedStudents) => {
    try {
      if (addedStudents.length === 0) {
        return toast.error("Please select at least one student to add");
      }

      const token = await getToken();
      const studentIds = addedStudents.map((s) => s.id);

      const { data } = await axios.post(
        backendUrl + "/api/educator/add-students",
        { users: studentIds },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        if (data.addedStudents.length > 0) {
          toast.success(
            `Added ${data.addedStudents.length} student(s) successfully.`
          );
        }
        if (data.skippedStudents.length > 0) {
          toast.info(
            `${data.skippedStudents.length} student(s) were already added and skipped.`
          );
        }
        fetchMyStudents();
        setShowAddModal(false);
      } else {
        toast.error(data.message || "Failed to add students");
      }
    } catch (error) {
      toast.error(error.message || "Failed to add students");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle remove educator students
  const handleRemoveStudents = async (removedStudents) => {
    try {
      if (removedStudents.length === 0) {
        return toast.error("Please select at least one student to remove");
      }

      const token = await getToken();
      const studentIds = removedStudents.map((s) => s.id);

      const { data } = await axios.post(
        backendUrl + "/api/educator/remove-students",
        { users: studentIds },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        if (data.removedStudents.length > 0) {
          toast.success(
            `Removed ${data.removedStudents.length} student(s) successfully.`
          );
        }
        if (data.skippedStudents.length > 0) {
          toast.info(
            `${data.skippedStudents.length} student(s) were not found in your list.`
          );
        }
        fetchMyStudents();
        setShowRemoveModal(false);
      } else {
        toast.error(data.message || "Failed to remove students");
      }
    } catch (error) {
      toast.error(error.message || "Failed to remove students");
    } finally {
      setIsLoading(false);
    }
  };

  // Updated function to handle enrollment count updates
  const addEnrollmentsCount = async (enrolledStudents) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        backendUrl + "/api/user/batch-enrollment-count",
        { userId: enrolledStudents },
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

  // Handle bulk enrollment - updated with proper enrollment count handling
  const handleBatchEnrollCourse = async () => {
    try {
      if (!selectedCourseCode) {
        return toast.error("Please select a course to enroll in.");
      }

      if (selectedStudents.length === 0) {
        return toast.error("Please select at least one student.");
      }

      // Validate all students before enrolling
      for (let i = 0; i < selectedStudents.length; i++) {
        const studentId = selectedStudents[i];
        const enrollmentCount = selectedStudentsCount[studentId];
        const isMember = selectedStudentMember[studentId];
        const name = selectedStudentNames[studentId] || "This student";

        if (enrollmentCount === undefined || isMember === undefined) {
          return toast.error(
            `Missing info for ${name}. Please refresh and try again.`
          );
        }

        if (enrollmentCount >= 3 && !isMember) {
          return toast.error(
            `${name} has reached the maximum number of enrollments. Please ask them to join the membership.`
          );
        }
      }

      const token = await getToken();
      const { data } = await axios.post(
        backendUrl + "/api/user/batch-enroll-course",
        {
          courseCode: selectedCourseCode,
          userId: selectedStudents,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        toast.success(data.message);

        if (data.skipped?.length > 0) {
          toast.info(
            `${data.skipped.length} student(s) already enrolled and skipped.`
          );
        }

        const skippedStudentIds = Array.isArray(data.skipped)
          ? data.skipped
          : [];
        const successfullyEnrolledStudents = selectedStudents.filter(
          (studentId) => !skippedStudentIds.includes(studentId)
        );

        if (successfullyEnrolledStudents.length > 0) {
          await addEnrollmentsCount(successfullyEnrolledStudents);
        }

        fetchAllStudents();
        fetchMyStudents();
        setSelectedStudents([]);
        setSelectedCourseCode("");
        setSelectedStudentsCount({});
        setSelectedStudentMember({});
        setSelectedStudentNames({});
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
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
                Student Management
              </h1>
              <p className="text-gray-600">
                Manage students and their course enrollments
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 mt-4 md:mt-0">
              <button
                onClick={() => setShowAddModal(true)}
                className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <FaPlus className="h-5 w-5" />
                Add Students
              </button>
              <button
                onClick={() => setShowRemoveModal(true)}
                className="w-full md:w-auto px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2"
              >
                <FaTrash className="h-5 w-5" />
                Remove Students
              </button>
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

        {selectedStudents.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-blue-800">
              <span className="font-medium">{selectedStudents.length}</span>{" "}
              students selected
            </div>
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <select
                value={selectedCourseCode}
                onChange={(e) => setSelectedCourseCode(e.target.value)}
                className="p-2 border border-gray-300 rounded-md w-full md:w-auto"
              >
                <option value="">Select a course to enroll</option>
                {courses.map((course) => (
                  <option key={course._id} value={course.courseCode}>
                    {course.courseTitle}
                  </option>
                ))}
              </select>
              <button
                onClick={handleBatchEnrollCourse}
                disabled={!selectedCourseCode}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-green-300 flex items-center justify-center gap-2"
              >
                <FaUserPlus className="h-5 w-5" />
                Enroll
              </button>
            </div>
          </div>
        )}

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
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Your First Student
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
                      <input
                        type="checkbox"
                        checked={
                          selectedStudents.length ===
                            filteredMyStudents.length &&
                          filteredMyStudents.length > 0
                        }
                        onChange={toggleSelectAll}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </th>
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
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMyStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.id)}
                          onChange={(e) =>
                            toggleStudentSelection(student.id, e.target.checked)
                          }
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </td>
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

      <RemoveStudentModal
        isOpen={showRemoveModal}
        onClose={() => setShowRemoveModal(false)}
        selectedStudents={selectedStudents}
        onStudentsRemoved={handleRemoveStudents}
        backendUrl={backendUrl}
        getToken={getToken}
      />

      <AddStudentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        courses={courses}
        onStudentsAdded={handleAddStudents}
        backendUrl={backendUrl}
        getToken={getToken}
      />
    </div>
  );
};

export default StudentManagement;
