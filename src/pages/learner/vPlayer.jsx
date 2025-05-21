import axios from "axios";
import humanizeDuration from "humanize-duration";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import YouTube from "react-youtube";
import Loading from "../../components/learner/Loading";
import Rating from "../../components/learner/rating";
import { AppContext } from "../../context/AppContext";

import { BiDownload } from "react-icons/bi";
import { BsFileEarmark } from "react-icons/bs";
import {
  FaCalendarAlt,
  FaCheck,
  FaChevronDown,
  FaEdit,
  FaLock,
  FaPlay,
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

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      getCourseData();
    }
  }, [enrolledCourses]);

  useEffect(() => {
    getCourseProgress();
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            {courseData.courseTitle}
          </h1>
          <div className="flex items-center mt-2 text-sm text-gray-600">
            <span className="mr-4">Educator: {courseData.educator.name}</span>
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
                          className="w-full h-96"
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
                      <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">
                          {playerData.chapter}.{playerData.lecture}{" "}
                          {playerData.lectureTitle}
                        </h2>
                        <button
                          onClick={() =>
                            markLectureAsCompleted(playerData.lectureId)
                          }
                          className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
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
                  <div className="flex flex-col items-center justify-center bg-gray-100 aspect-video p-8">
                    <img
                      src={courseData.courseThumbnail}
                      alt={courseData.courseTitle}
                      className="max-h-48 object-contain mb-4"
                    />
                    <h3 className="text-xl font-medium text-gray-700 text-center">
                      Select a lecture to start learning
                    </h3>
                    <p className="text-gray-500 text-center mt-2">
                      Click on any "Open" button from the course content
                    </p>
                  </div>
                )
              ) : activeActivity ? (
                <div>
                  <div className="p-4 bg-white border-b">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold text-gray-800">
                        {activeActivity.activityTitle}
                      </h2>
                    </div>
                  </div>
                  <div className="p-6 bg-white border-b">
                    <div className="prose max-w-none">
                      {activeActivity.activityUrl && (
                        <>
                          <div className="mb-4">
                            <iframe
                              src={activeActivity.activityUrl}
                              className="w-full h-96"
                              allowFullScreen
                            ></iframe>
                          </div>
                          <div className="mt-6">
                            <h3 className="text-lg font-medium text-gray-800 mb-2">
                              Resources
                            </h3>
                            <a
                              href={activeActivity.activityUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline flex items-center"
                            >
                              <BiDownload className="h-5 w-5 mr-1" />
                              Download Activity Resource
                            </a>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center bg-gray-100 aspect-video p-8">
                  <BsFileEarmark className="h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 text-center">
                    Select an activity to view
                  </h3>
                  <p className="text-gray-500 text-center mt-2">
                    Click on any activity from the list
                  </p>
                </div>
              )}

              <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
                <div className="flex items-center">
                  {userData?.isMember ? (
                    <button
                      onClick={() => window.open("/editor", "_blank")}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      <FaEdit className="h-5 w-5" />
                      Open Editor
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        toast.info(
                          "You need to upgrade your membership to access the code editor"
                        )
                      }
                      className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-600 rounded relative group cursor-default"
                    >
                      <FaEdit className="h-5 w-5" />
                      <span className="flex items-center">
                        Open Editor
                        <FaLock className="h-4 w-4 ml-1 text-amber-500" />
                      </span>
                      <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                        Premium feature
                      </span>
                    </button>
                  )}
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-2">
                    Your progress:
                  </span>
                  <div className="w-48 bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${calculateProgress()}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {calculateProgress()}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/3 order-1 lg:order-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="flex border-b border-gray-200">
                <button
                  className={`flex-1 py-3 text-center font-medium transition ${
                    activeTab === "content"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  onClick={() => setActiveTab("content")}
                >
                  Course Content
                </button>
                <button
                  className={`flex-1 py-3 text-center font-medium transition ${
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
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100">
                            <FaChevronDown
                              className={`h-3 w-3 text-gray-600 transform transition-transform ${
                                openSections[index] ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                          <h3 className="font-medium text-gray-800">
                            {chapter.chapterTitle}
                          </h3>
                        </div>
                        <div className="text-sm text-gray-500">
                          {chapter.chapterContent.length} lectures •{" "}
                          {calculateChapterTime(chapter)}
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
                              <div className="mr-3">
                                {isCompleted ? (
                                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                    {
                                      <FaCheck className="w-3 h-3 text-green-600" />
                                    }
                                  </div>
                                ) : (
                                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                                    {
                                      <FaPlay className="w-3 h-3 text-gray-500" />
                                    }
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm text-gray-800">
                                  {lecture.lectureTitle}
                                </p>
                              </div>
                              <div className="flex items-center gap-3 ml-2">
                                {lecture.lectureUrl && (
                                  <button
                                    onClick={() =>
                                      setPlayerData({
                                        ...lecture,
                                        chapter: index + 1,
                                        lecture: i + 1,
                                      })
                                    }
                                    className="text-sm text-blue-600 hover:text-blue-800"
                                  >
                                    Open
                                  </button>
                                )}
                                <span className="text-xs text-gray-500">
                                  {humanizeDuration(
                                    lecture.lectureDuration * 60 * 1000,
                                    {
                                      units: ["h", "m"],
                                      round: true,
                                    }
                                  )}
                                </span>
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
                        (activity, activityIndex) => (
                          <div
                            key={`${chapterIndex}-${activityIndex}`}
                            className={`border-b border-gray-100 last:border-b-0 p-4 hover:bg-gray-50 transition cursor-pointer ${
                              activeActivity?.activityId === activity.activityId
                                ? "bg-blue-50"
                                : ""
                            }`}
                            onClick={() => setActiveActivity(activity)}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <h3 className="font-medium text-gray-800">
                                  {activity.activityTitle}
                                </h3>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-xs text-gray-500">
                                <FaCalendarAlt className="h-3 w-3 mr-1" />
                                {activity.activityUrl ? (
                                  <a
                                    href={activity.activityUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline"
                                  >
                                    View File
                                  </a>
                                ) : (
                                  <span>No file uploaded</span>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      )
                    )
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                      <BsFileEarmark className="h-16 w-16 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-700">
                        No activities found
                      </h3>
                      <p className="text-gray-500 mt-2">
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
    </div>
  );
};

export default vPlayer;
