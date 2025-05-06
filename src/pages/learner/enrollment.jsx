import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { Line } from "rc-progress";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../../components/learner/Loading";

const enrollment = () => {
  const {
    enrolledCourses,
    navigate,
    calculateCourseDuration,
    calculateNoOfLectures,
    backendUrl,
    userData,
    fetchUserEnrolledCourses,
    getToken,
    isEducator,
  } = useContext(AppContext);

  const [progressArray, setProgressArray] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
    if (enrolledCourses && enrolledCourses.length > 0) {
      getCourseProgress();
    } else if (enrolledCourses) {
      setIsLoading(false);
    }
  }, [enrolledCourses]);

  if (isEducator || isLoading) {
    return <Loading />;
  }

  return (
    <div className="h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="w-full">
        <h2 className="pb-4 text-lg font-medium">My Enrollments</h2>
        {!enrolledCourses || enrolledCourses.length === 0 ? (
          <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20 p-8">
            <p>You have not enrolled in any courses yet.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
            <table className="md:table-auto table-fixed w-full overflow-hidden">
              <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold truncate">Course</th>
                  <th className="px-4 py-3 font-semibold truncate">Duration</th>
                  <th className="px-4 py-3 font-semibold truncate">Completed</th>
                  <th className="px-4 py-3 font-semibold truncate">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {enrolledCourses.map((course, index) => (
                  <tr key={index} className="border-b border-gray-500/20">
                    <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                      <img
                        src={course.courseThumbnail}
                        alt="Course Thumbnail"
                        className="w-16"
                      />
                      <div className="flex-1">
                        <p className="truncate">{course.courseTitle}</p>
                        <Line
                          className="bg-gray-300 rounded-full mt-1"
                          strokeWidth={2}
                          percent={
                            progressArray[index]
                              ? (progressArray[index].lectureCompleted * 100) /
                                progressArray[index].totalLectures
                              : 0
                          }
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {calculateCourseDuration(course)}
                    </td>
                    <td className="px-4 py-3">
                      {progressArray[index] &&
                        `${progressArray[index].lectureCompleted} / ${progressArray[index].totalLectures}`}{" "}
                      <span className="text-xs ml-1">Lectures</span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => navigate("/vPlayer/" + course._id)}
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded"
                      >
                        {progressArray[index] &&
                        progressArray[index].lectureCompleted /
                          progressArray[index].totalLectures ===
                          1
                          ? "Completed"
                          : "On Going"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default enrollment;