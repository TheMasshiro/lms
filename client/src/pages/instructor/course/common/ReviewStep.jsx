import { useEffect } from "react";
import { FaInfoCircle } from "react-icons/fa";

const ReviewStep = (props) => {
  const { basicInfo, thumbnailInfo, chapterInfo, activityInfo } = props;

  const totalLectures = chapterInfo.chapters.reduce(
    (count, chapter) => count + chapter.chapterContent.length,
    0
  );

  const totalActivities = Array.isArray(activityInfo?.activities)
    ? activityInfo.activities.reduce(
        (count, activity) =>
          count +
          (Array.isArray(activity.chapterActivities)
            ? activity.chapterActivities.length
            : 0),
        0
      )
    : 0;

  return (
    <div className="flex flex-col gap-6 w-full">
      <h2 className="text-xl font-semibold text-gray-800">Review and Submit</h2>
      <p className="text-gray-600">
        Please review your course details before submitting.
      </p>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <h3 className="font-semibold text-lg text-gray-800 mb-4">
            Course Summary
          </h3>

          <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">
                Course Title
              </h4>
              <p className="text-gray-800 font-medium">
                {basicInfo.courseTitle || "Not specified"}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">
                Course Code
              </h4>
              <p className="text-gray-800 font-medium bg-blue-50 inline-block px-2 py-1 rounded">
                {basicInfo.courseCode}
              </p>
            </div>

            <div className="md:col-span-2">
              <h4 className="text-sm font-medium text-gray-500 mb-1">
                Course Structure
              </h4>
              <div className="flex gap-6">
                <div className="bg-blue-50 px-3 py-2 rounded">
                  <span className="text-blue-800 font-medium text-lg">
                    {chapterInfo.chapters.length}
                  </span>
                  <span className="text-blue-600 text-sm ml-1">Chapters</span>
                </div>
                <div className="bg-green-50 px-3 py-2 rounded">
                  <span className="text-green-800 font-medium text-lg">
                    {totalLectures}
                  </span>
                  <span className="text-green-600 text-sm ml-1">Lectures</span>
                </div>
                <div className="bg-purple-50 px-3 py-2 rounded">
                  <span className="text-purple-800 font-medium text-lg">
                    {totalActivities}
                  </span>
                  <span className="text-purple-600 text-sm ml-1">
                    Activities
                  </span>
                </div>
              </div>
            </div>

            {thumbnailInfo.image && (
              <div className="md:col-span-2">
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Course Thumbnail
                </h4>
                <div className="border rounded-lg overflow-hidden max-w-sm">
                  <img
                    src={URL.createObjectURL(thumbnailInfo.image)}
                    alt="Course Thumbnail"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            )}

            <div className="md:col-span-2">
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                Course Content
              </h4>
              <div className="border rounded-lg divide-y">
                {chapterInfo.chapters.map((chapter, chapterIndex) => (
                  <div key={chapterIndex} className="p-3">
                    <div className="font-medium">
                      Chapter {chapterIndex + 1}: {chapter.chapterTitle}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {chapter.chapterContent.length} lecture
                      {chapter.chapterContent.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-red-50 p-4 border-t">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              <FaInfoCircle className="h-5 w-5 text-blue-500" />
            </div>
            <p className="ml-3 text-sm text-red-700">
              Please note: Submissions are final and cannot be edited. Ensure
              all course details are accurate before submitting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;
