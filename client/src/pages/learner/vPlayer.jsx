import axios from "axios";
import humanizeDuration from "humanize-duration";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import YouTube from "react-youtube";
import Loading from "../../components/learner/Loading";
import Rating from "../../components/learner/rating";
import { AppContext } from "../../context/AppContext";

import { BiDownload, BiUpload } from "react-icons/bi";
import { BsFileEarmark } from "react-icons/bs";
import {
  FaCalendarAlt,
  FaCheck,
  FaChevronDown,
  FaEdit,
  FaEye,
  FaLock,
  FaPlay,
  FaTimes,
  FaUpload,
} from "react-icons/fa";

const vPlayer = () => {
  const {
    enrolledCourses,
    calculateChapterTime,
    fetchUserEnrolledCourses,
    backendUrl,
    getToken,
    userData,
  } = useContext(AppContext);

  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [playerData, setPlayerData] = useState(null);
  const [initialRating, setInitialRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("content");
  const [activeActivity, setActiveActivity] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [submissionFile, setSubmissionFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewSubmissionModal, setViewSubmissionModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const calculateProgress = () => {
    if (!progressData || !courseData) return 0;

    let totalLectures = 0;
    courseData.courseContent.forEach((chapter) => {
      totalLectures += chapter.chapterContent.length;
    });

    return Math.round(
      (progressData.lectureCompleted.length / totalLectures) * 100
    );
  };

  const getCourseData = () => {
    if (!enrolledCourses || enrolledCourses.length === 0) return;

    const course = enrolledCourses.find((course) => course._id === courseId);
    if (course) {
      setCourseData(course);
      const userRating = course.courseRatings.find(
        (item) => item.userId === userData._id
      );
      if (userRating) {
        setInitialRating(userRating.rating);
      }
    }
    setIsLoading(false);
  };

  const getCourseProgress = async () => {
    try {
      setIsLoading(true);
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/get-course-progress`,
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setProgressData(data.progressData);
      } else {
        toast.error(data.message);
      }
      setIsLoading(false);
    } catch (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  const getSubmissions = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(
        `${backendUrl}/api/user/submissions/${courseId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setSubmissions(data.submissions);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  const handleRate = async (rating) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/add-rating`,
        { courseId, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        fetchUserEnrolledCourses();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const markLectureAsCompleted = async (lectureId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/update-course-progress`,
        { courseId, lectureId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success(data.message);
        getCourseProgress();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const openSubmissionModal = (activity) => {
    setSelectedActivity(activity);
    setIsSubmissionModalOpen(true);
  };

  const closeSubmissionModal = () => {
    setIsSubmissionModalOpen(false);
    setSelectedActivity(null);
    setSubmissionFile(null);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Please select a PDF file only");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }
      setSubmissionFile(file);
    }
  };

  const submitActivity = async () => {
    if (!submissionFile) {
      toast.error("Please select a file to submit");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("submission", submissionFile);
      formData.append("courseId", courseId);
      formData.append("activityId", selectedActivity.activityId);

      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/submit-activity`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        toast.success("Activity submitted successfully!");
        closeSubmissionModal();
        getSubmissions();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getActivitySubmission = (activityId) => {
    return submissions.find((sub) => sub.activityId === activityId);
  };

  const openViewSubmissionModal = (submission) => {
    setSelectedSubmission(submission);
    setViewSubmissionModal(true);
  };

  const closeViewSubmissionModal = () => {
    setViewSubmissionModal(false);
    setSelectedSubmission(null);
  };

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      getCourseData();
    }
  }, [enrolledCourses]);

  useEffect(() => {
    getCourseProgress();
    getSubmissions();
  }, []);

  if (isLoading) return <Loading />;
  if (!courseData)
    return (
      <div className="flex justify-center items-center h-screen">
        Course not found
      </div>
    );

  return (
    <div className="bg-blue-50 min-h-screen">
      <div className="shadow-sm bg-white">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
            {courseData.courseTitle}
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center mt-2 space-y-2 sm:space-y-0 text-sm text-gray-600">
            <span className="sm:mr-4">Educator: {courseData.educator.name}</span>
            <div className="flex items-center">
              <span className="mr-2">Course Rating:</span>
              <Rating initialRating={initialRating} onRate={handleRate} />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-2/3 order-2 lg:order-1">
            <div className="bg-blue-50 rounded-lg shadow-md overflow-hidden">
              {activeTab === "content" ? (
                playerData ? (
                  <div>
                    {playerData.contentType === "file" ? (
                      <div className="p-4 bg-gray-100 rounded">
                        <iframe
                          src={playerData.lectureUrl}
                          className="w-full h-64 sm:h-80 md:h-96"
                          frameBorder="0"
                          allowFullScreen
                        ></iframe>
                      </div>
                    ) : (
                      <div className="relative">
                        <YouTube
                          iframeClassName="w-full aspect-video"
                          videoId={playerData.lectureUrl.split("/").pop()}
                        />
                      </div>
                    )}
                    <div className="p-4 border-b">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                        <h2 className="text-lg sm:text-xl font-semibold">
                          {playerData.chapter}.{playerData.lecture}{" "}
                          {playerData.lectureTitle}
                        </h2>
                        <button
                          onClick={() =>
                            markLectureAsCompleted(playerData.lectureId)
                          }
                          className={`px-4 py-1.5 rounded-full text-sm font-medium transition w-full sm:w-auto ${
                            progressData &&
                            progressData.lectureCompleted.includes(
                              playerData.lectureId
                            )
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                          }`}
                        >
                          {progressData &&
                          progressData.lectureCompleted.includes(
                            playerData.lectureId
                          )
                            ? "✓ Completed"
                            : "Mark as Complete"}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center bg-gray-100 aspect-video p-4 sm:p-8">
                    <img
                      src={courseData.courseThumbnail}
                      alt={courseData.courseTitle}
                      className="max-h-32 sm:max-h-48 object-contain mb-4"
                    />
                    <h3 className="text-lg sm:text-xl font-medium text-gray-700 text-center">
                      Select a lecture to start learning
                    </h3>
                    <p className="text-gray-500 text-center mt-2 text-sm sm:text-base">
                      Click on any "Open" button from the course content
                    </p>
                  </div>
                )
              ) : activeActivity ? (
                <div>
                  <div className="p-4 bg-white border-b">
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                        {activeActivity.activityTitle}
                      </h2>
                    </div>
                  </div>
                  <div className="p-4 sm:p-6 bg-white border-b">
                    <div className="prose max-w-none">
                      {activeActivity.activityUrl && (
                        <>
                          <div className="mb-4">
                            <iframe
                              src={activeActivity.activityUrl}
                              className="w-full h-64 sm:h-80 md:h-96"
                              allowFullScreen
                            ></iframe>
                          </div>
                          <div className="mt-6">
                            <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-2">
                              Resources
                            </h3>
                            <a
                              href={activeActivity.activityUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline flex items-center text-sm sm:text-base"
                            >
                              <BiDownload className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
                              Download Activity Resource
                            </a>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center bg-gray-100 aspect-video p-4 sm:p-8">
                  <BsFileEarmark className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg sm:text-xl font-medium text-gray-700 text-center">
                    Select an activity to view
                  </h3>
                  <p className="text-gray-500 text-center mt-2 text-sm sm:text-base">
                    Click on any activity from the list
                  </p>
                </div>
              )}

              <div className="p-4 bg-gray-50 border-t flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
                <div className="flex items-center">
                  {userData?.isMember ? (
                    <button
                      onClick={() => window.open("/editor", "_blank")}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm sm:text-base w-full sm:w-auto justify-center sm:justify-start"
                    >
                      <FaEdit className="h-4 w-4 sm:h-5 sm:w-5" />
                      Open Editor
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        toast.info(
                          "You need to upgrade your membership to access the code editor"
                        )
                      }
                      className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-600 rounded relative group cursor-default text-sm sm:text-base w-full sm:w-auto justify-center sm:justify-start"
                    >
                      <FaEdit className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="flex items-center">
                        Open Editor
                        <FaLock className="h-3 w-3 sm:h-4 sm:w-4 ml-1 text-amber-500" />
                      </span>
                      <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                        Premium feature
                      </span>
                    </button>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0">
                  <span className="text-sm text-gray-600 sm:mr-2">
                    Your progress:
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 sm:w-48 bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${calculateProgress()}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {calculateProgress()}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/3 order-1 lg:order-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="flex border-b border-gray-200">
                <button
                  className={`flex-1 py-3 text-center font-medium transition text-sm sm:text-base ${
                    activeTab === "content"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  onClick={() => setActiveTab("content")}
                >
                  Course Content
                </button>
                <button
                  className={`flex-1 py-3 text-center font-medium transition text-sm sm:text-base ${
                    activeTab === "activities"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  onClick={() => setActiveTab("activities")}
                >
                  Activities
                </button>
              </div>

              {activeTab === "content" ? (
                <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                  {courseData.courseContent.map((chapter, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-100 last:border-b-0"
                    >
                      <div
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition"
                        onClick={() => toggleSection(index)}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 flex-shrink-0">
                            <FaChevronDown
                              className={`h-3 w-3 text-gray-600 transform transition-transform ${
                                openSections[index] ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                          <h3 className="font-medium text-gray-800 text-sm sm:text-base truncate">
                            {chapter.chapterTitle}
                          </h3>
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 ml-2 flex-shrink-0">
                          <div className="text-right">
                            <div>{chapter.chapterContent.length} lecture{chapter.chapterContent.length !== 1 ? "s" : ""}</div>
                            <div className="hidden sm:inline">• {calculateChapterTime(chapter) || "Files Only"}</div>
                          </div>
                        </div>
                      </div>

                      <div
                        className={`bg-gray-50 overflow-hidden transition-all duration-300 ${
                          openSections[index]
                            ? "max-h-[1000px] py-2"
                            : "max-h-0 py-0"
                        }`}
                      >
                        {chapter.chapterContent.map((lecture, i) => {
                          const isCompleted =
                            progressData &&
                            progressData.lectureCompleted.includes(
                              lecture.lectureId
                            );

                          return (
                            <div
                              key={i}
                              className={`flex items-center px-4 py-3 hover:bg-gray-100 transition ${
                                playerData &&
                                playerData.lectureId === lecture.lectureId
                                  ? "bg-blue-50"
                                  : ""
                              }`}
                            >
                              <div className="mr-3 flex-shrink-0">
                                {isCompleted ? (
                                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                    <FaCheck className="w-3 h-3 text-green-600" />
                                  </div>
                                ) : (
                                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                                    <FaPlay className="w-3 h-3 text-gray-500" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-800 truncate">
                                  {lecture.lectureTitle}
                                </p>
                              </div>
                              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-3 ml-2 flex-shrink-0">
                                {lecture.lectureUrl && (
                                  <button
                                    onClick={() =>
                                      setPlayerData({
                                        ...lecture,
                                        chapter: index + 1,
                                        lecture: i + 1,
                                      })
                                    }
                                    className="text-xs sm:text-sm text-blue-600 hover:text-blue-800"
                                  >
                                    Open
                                  </button>
                                )}
                                {Number(lecture.lectureDuration) > 0 && (
                                  <span className="text-xs text-gray-500">
                                    {humanizeDuration(
                                      lecture.lectureDuration * 60 * 1000,
                                      {
                                        units: ["h", "m"],
                                        round: true,
                                      }
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                  {courseData.courseContent &&
                  courseData.courseContent.length > 0 &&
                  courseData.courseContent.some(
                    (chapter) =>
                      chapter.chapterActivities &&
                      chapter.chapterActivities.length > 0
                  ) ? (
                    courseData.courseContent.map((chapter, chapterIndex) =>
                      (chapter.chapterActivities || []).map(
                        (activity, activityIndex) => {
                          const submission = getActivitySubmission(
                            activity.activityId
                          );

                          return (
                            <div
                              key={`${chapterIndex}-${activityIndex}`}
                              className={`border-b border-gray-100 last:border-b-0 p-4 hover:bg-gray-50 transition cursor-pointer ${
                                activeActivity?.activityId ===
                                activity.activityId
                                  ? "bg-blue-50"
                                  : ""
                              }`}
                              onClick={() => setActiveActivity(activity)}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 space-y-2 sm:space-y-0">
                                <div className="flex items-center gap-3 min-w-0">
                                  <h3 className="font-medium text-gray-800 text-sm sm:text-base truncate">
                                    {activity.activityTitle}
                                  </h3>
                                  {submission && (
                                    <span
                                      className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ${
                                        submission.status === "graded"
                                          ? "bg-green-100 text-green-700"
                                          : "bg-blue-100 text-blue-700"
                                      }`}
                                    >
                                      {submission.status === "graded"
                                        ? "Graded"
                                        : "Submitted"}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                                <div className="flex items-center text-xs text-gray-500">
                                  <FaCalendarAlt className="h-3 w-3 mr-1 flex-shrink-0" />
                                  {activity.activityUrl ? (
                                    <a
                                      href={activity.activityUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="hover:underline truncate"
                                    >
                                      View File
                                    </a>
                                  ) : (
                                    <span>No file uploaded</span>
                                  )
                                  }
                                </div>

                                <div className="flex items-center gap-2">
                                  {submission ? (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openViewSubmissionModal(submission);
                                      }}
                                      className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition"
                                    >
                                      <FaEye className="h-3 w-3" />
                                      <span className="hidden sm:inline">View Submission</span>
                                      <span className="sm:hidden">View</span>
                                    </button>
                                  ) : (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openSubmissionModal(activity);
                                      }}
                                      className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 transition"
                                    >
                                      <BiUpload className="h-3 w-3" />
                                      <span className="hidden sm:inline">Submit Activity</span>
                                      <span className="sm:hidden">Submit</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        }
                      )
                    )
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                      <BsFileEarmark className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mb-4" />
                      <h3 className="text-base sm:text-lg font-medium text-gray-700">
                        No activities found
                      </h3>
                      <p className="text-gray-500 mt-2 text-sm sm:text-base">
                        This course doesn't have any activities yet.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isSubmissionModalOpen && selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                Submit Activity
              </h3>
              <button
                onClick={closeSubmissionModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Activity:{" "}
                <span className="font-medium">
                  {selectedActivity.activityTitle}
                </span>
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload your submission file
              </label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50"
                onClick={() =>
                  document.getElementById("submission-file-upload").click()
                }
              >
                <FaUpload className="mx-auto h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  {submissionFile
                    ? submissionFile.name
                    : "Click to upload or drag and drop"}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  PDF only (Max 10MB)
                </p>
              </div>
              <input
                type="file"
                id="submission-file-upload"
                className="hidden"
                accept=".pdf"
                onChange={handleFileSelect}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={closeSubmissionModal}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={submitActivity}
                disabled={!submissionFile || isSubmitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition text-sm sm:text-base"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {viewSubmissionModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                Submission Details
              </h3>
              <button
                onClick={closeViewSubmissionModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Status:{" "}
                </span>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    selectedSubmission.status === "graded"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {selectedSubmission.status === "graded"
                    ? "Graded"
                    : "Submitted"}
                </span>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-700">
                  Submitted:{" "}
                </span>
                <span className="text-sm text-gray-600">
                  {new Date(
                    selectedSubmission.submittedAt
                  ).toLocaleDateString()}
                </span>
              </div>

              {selectedSubmission.grade !== undefined && (
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Grade:{" "}
                  </span>
                  <span className="text-sm font-semibold text-blue-600">
                    {selectedSubmission.grade}/100
                  </span>
                </div>
              )}

              <div>
                <a
                  href={selectedSubmission.submissionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                >
                  <BiDownload className="h-4 w-4" />
                  Download Submission
                </a>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={closeViewSubmissionModal}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition text-sm sm:text-base"
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

export default vPlayer;
