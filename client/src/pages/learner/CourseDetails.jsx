import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import YouTube from "react-youtube";
import humanizeDuration from "humanize-duration";
import axios from "axios";
import Loading from "../../components/learner/Loading";
import { AppContext } from "../../context/AppContext";
import { FaStar, FaRegStar, FaChevronDown, FaLock, FaCheck, FaPlay, FaClock, FaBook } from "react-icons/fa";

const CourseDetails = () => {
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [playerData, setPlayerData] = useState(null);
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [openSections, setOpenSections] = useState({});

  const {
    calculateChapterTime,
    calculateCourseDuration,
    calculateRating,
    calculateNoOfLectures,
    backendUrl,
    userData,
    getToken,
  } = useContext(AppContext);

  const fetchCourseData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/course/${id}`);

      if (data.success) {
        setCourseData(data.courseData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const enrollCourse = async () => {
    try {
      if (!userData) {
        return toast.warn("Please login to enroll in the course");
      }

      if (isAlreadyEnrolled) {
        return toast.warn("You are already enrolled in this course");
      }

      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/purchase`,
        { courseId: courseData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        const { session_url } = data;
        window.location.replace(session_url);
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
    fetchCourseData();
  }, []);

  useEffect(() => {
    if (userData && courseData) {
      setIsAlreadyEnrolled(userData.enrolledCourses.includes(courseData._id));
    }
  }, [userData, courseData]);

  if (!courseData) return <Loading />;

  return (
    <div className="bg-blue-50 min-h-screen">
      <div className="shadow-sm bg-white">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            {courseData.courseTitle}
          </h1>
          <div className="flex flex-wrap items-center mt-2 text-sm text-gray-600 gap-4">
            <span>Educator: {courseData.educator.name}</span>
            <div className="flex items-center">
              <span className="mr-2">Rating: {calculateRating(courseData)}</span>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  i < Math.floor(calculateRating(courseData)) 
                    ? <FaStar key={i} className="w-3.5 h-3.5 text-yellow-500" />
                    : <FaRegStar key={i} className="w-3.5 h-3.5 text-gray-300" />
                ))}
              </div>
            </div>
            <span>
              {courseData.enrolledStudents.length}{" "}
              {courseData.enrolledStudents.length > 1 ? "students" : "student"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Course Details Section */}
          <div className="lg:w-2/3">
            {/* Video Player Section */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              {playerData ? (
                <YouTube
                  videoId={playerData.videoId}
                  opts={{ playerVars: { autoplay: 1 } }}
                  iframeClassName="w-full aspect-video"
                />
              ) : (
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={courseData.courseThumbnail} 
                    alt={courseData.courseTitle} 
                    className="w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <p className="text-white text-lg font-medium">
                      Preview available lectures below
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Course Description Section */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="p-5 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800">Course Description</h2>
              </div>
              <div className="p-5">
                <div 
                  className="rich-text text-gray-700"
                  dangerouslySetInnerHTML={{ __html: courseData.courseDescription }}
                ></div>
              </div>
            </div>
          </div>

          {/* Right Sidebar Section */}
          <div className="lg:w-1/3">
            {/* Enrollment Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="p-5 border-b border-gray-100">
                <div className="flex gap-3 items-center pt-2">
                  <p className="text-gray-800 text-2xl md:text-3xl font-semibold">
                    Course Code: <span className="text-blue-600">{courseData.courseCode}</span>
                  </p>
                </div>
              </div>

              <div className="p-5">
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <FaStar className="w-4 h-4 text-yellow-500" />
                    <p>{calculateRating(courseData)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaClock className="w-4 h-4 text-gray-500" />
                    <p>{calculateCourseDuration(courseData)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaBook className="w-4 h-4 text-gray-500" />
                    <p>{calculateNoOfLectures(courseData)} lessons</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <p className="font-medium text-gray-800 mb-2">What's included:</p>
                  <ul className="ml-5 list-disc text-gray-600 space-y-1 text-sm">
                    <li>Lifetime access with free updates</li>
                    <li>Step-by-step, hands-on project guidance</li>
                    <li>Downloadable resources and source code</li>
                    <li>Quizzes to test your knowledge</li>
                    <li>Certificate of completion</li>
                  </ul>
                </div>

                <div 
                  className={`w-full mt-6 py-3 rounded-md font-medium text-center ${
                    isAlreadyEnrolled
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {isAlreadyEnrolled ? (
                      <>
                        <FaCheck className="h-5 w-5" />
                        <span>Enrolled</span>
                      </>
                    ) : (
                      <>
                        <FaLock className="h-5 w-5" />
                        <span>Not Enrolled</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Course Content Section */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-gray-50 border-b">
                <h2 className="text-lg font-semibold text-gray-800">Course Content</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {courseData.courseContent.length} sections • {calculateNoOfLectures(courseData)} lectures • {calculateCourseDuration(courseData)} total
                </p>
              </div>
              
              <div className="max-h-[600px] overflow-y-auto">
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
                        <h3 className="font-medium text-gray-800">{chapter.chapterTitle}</h3>
                      </div>
                      <div className="text-sm text-gray-500">
                        {chapter.chapterContent.length} lectures • {calculateChapterTime(chapter)}
                      </div>
                    </div>

                    <div
                      className={`bg-gray-50 overflow-hidden transition-all duration-300 ${
                        openSections[index] ? "max-h-[1000px] py-2" : "max-h-0 py-0"
                      }`}
                    >
                      {chapter.chapterContent.map((lecture, i) => (
                        <div 
                          key={i} 
                          className="flex items-center px-4 py-3 hover:bg-gray-100 transition"
                        >
                          <div className="mr-3">
                            <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                              <FaPlay className="w-2.5 h-2.5 text-gray-500" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-800">{lecture.lectureTitle}</p>
                          </div>
                          <div className="flex items-center gap-3 ml-2">
                            {lecture.isPreviewFree && (
                              <button
                                onClick={() =>
                                  setPlayerData({
                                    videoId: lecture.lectureUrl.split("/").pop(),
                                  })
                                }
                                className="text-sm text-blue-600 hover:text-blue-800"
                              >
                                Preview
                              </button>
                            )}
                            <span className="text-xs text-gray-500">
                              {humanizeDuration(lecture.lectureDuration * 60 * 1000, {
                                units: ["h", "m"],
                                round: true
                              })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;