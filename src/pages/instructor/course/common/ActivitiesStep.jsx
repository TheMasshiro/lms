import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import uniqid from "uniqid";
import { 
  FaChevronDown, 
  FaTimes, 
  FaPlus, 
  FaClipboard,
  FaFileUpload 
} from "react-icons/fa";

const ActivitiesStep = (props) => {
  const [chapters, setChapters] = useState([]);
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [files, setFiles] = useState([]);
  const [activityDetails, setActivityDetails] = useState({
    activityTitle: "",
    activityUrl: "",
    fileName: "",
    activityFile: null,
  });

  useEffect(() => {
    if (props.initialChapters && props.initialChapters.length > 0) {
      setChapters(props.initialChapters);
    }
  }, [props.initialChapters]);

  useEffect(() => {
    props.setActivitiesInfo({ activities: chapters });
    props.setActivityFileInfo({ activityFiles: files });
  }, [chapters, files]);

  const handleActivity = (action, chapterId, activityIndex) => {
    if (action === "add") {
      setCurrentChapterId(chapterId);
      setActivityDetails({
        activityTitle: "",
        activityUrl: "",
        fileName: "",
        activityFile: null,
      });
      setShowPopup(true);
    } else if (action === "remove") {
      setChapters(
        chapters.map((chapter) => {
          if (chapter.chapterId === chapterId) {
            chapter.chapterActivities.splice(activityIndex, 1);
          }
          return chapter;
        })
      );
    }
  };

  const handleChapter = (action, chapterId) => {
    if (action === "toggle") {
      setChapters(
        chapters.map((chapter) => {
          if (chapter.chapterId === chapterId) {
            return { ...chapter, collapsed: !chapter.collapsed };
          }
          return chapter;
        })
      );
    }
  };

  const addActivity = () => {
    if (!activityDetails.activityTitle) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!activityDetails.activityFile) {
      toast.error("Please upload a file.");
      return;
    }

    let fileId = null;
    if (activityDetails.activityFile) {
      fileId = uniqid();
      setFiles([
        ...files,
        {
          fileId,
          file: activityDetails.activityFile,
        },
      ]);
    }

    setChapters(
      chapters.map((chapter) => {
        if (chapter.chapterId === currentChapterId) {
          const newActivity = {
            ...activityDetails,
            activityId: uniqid(),
            activityOrder: chapter.chapterActivities
              ? chapter.chapterActivities.length + 1
              : 1,
            fileId: fileId,
          };

          if (!chapter.chapterActivities) {
            chapter.chapterActivities = [];
          }

          chapter.chapterActivities.push(newActivity);
        }
        return chapter;
      })
    );

    setShowPopup(false);
    setActivityDetails({
      activityTitle: "",
      activityUrl: "",
      fileName: "",
      activityFile: null,
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <h2 className="text-xl font-semibold text-gray-800">
        Chapter Activities
      </h2>

      <p className="text-gray-600">
        Add optional activities for each chapter. These can be assignments,
        quizzes, or additional resources.
      </p>

      <div className="mt-2">
        {chapters.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 border-dashed rounded-lg p-8 text-center">
            <p className="text-gray-500 mb-4">
              No chapters yet. Add your first chapter to get started with
              activities.
            </p>
          </div>
        ) : (
          <>
            {chapters.map((chapter, chapterIndex) => (
              <div
                key={chapterIndex}
                className="bg-white border border-gray-200 rounded-lg mb-4 shadow-sm overflow-hidden"
              >
                <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
                  <div className="flex items-center">
                    <button
                      className="mr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                      onClick={() => handleChapter("toggle", chapter.chapterId)}
                    >
                      <FaChevronDown 
                        className={`h-5 w-5 transform transition-transform ${
                          chapter.collapsed ? "-rotate-90" : ""
                        }`}
                      />
                    </button>
                    <span className="font-semibold text-gray-800">
                      Chapter {chapterIndex + 1}: {chapter.chapterTitle}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                      {chapter.chapterActivities
                        ? chapter.chapterActivities.length
                        : 0}{" "}
                      Activity
                      {chapter.chapterActivities &&
                      chapter.chapterActivities.length !== 1
                        ? "ies"
                        : "y"}
                    </span>
                    <button
                      onClick={() => handleChapter("remove", chapter.chapterId)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <FaTimes className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                {!chapter.collapsed && (
                  <div className="p-4">
                    {!chapter.chapterActivities ||
                    chapter.chapterActivities.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">
                        No activities in this chapter yet
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {chapter.chapterActivities.map(
                          (activity, activityIndex) => (
                            <div
                              key={activityIndex}
                              className="flex justify-between items-center p-3 rounded-md hover:bg-gray-50"
                            >
                              <div className="flex items-center">
                                <div className="bg-purple-100 p-2 rounded-full mr-3">
                                  <FaClipboard className="h-4 w-4 text-purple-600" />
                                </div>
                                <div>
                                  <div className="font-medium text-gray-800">
                                    {activity.activityTitle}
                                  </div>
                                  <a
                                    href={activity.activityUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-purple-500 text-sm hover:underline"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    View Resource
                                  </a>
                                </div>
                              </div>
                              <button
                                onClick={() =>
                                  handleActivity(
                                    "remove",
                                    chapter.chapterId,
                                    activityIndex
                                  )
                                }
                                className="text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <FaTimes className="h-5 w-5" />
                              </button>
                            </div>
                          )
                        )}
                      </div>
                    )}
                    <button
                      className="mt-4 flex items-center text-purple-600 hover:text-purple-800 font-medium text-sm"
                      onClick={() => handleActivity("add", chapter.chapterId)}
                    >
                      <FaPlus className="h-5 w-5 mr-1" />
                      Add Activity
                    </button>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Add New Activity
              </h3>
              <button
                onClick={() => setShowPopup(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Activity Title
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  value={activityDetails.activityTitle}
                  onChange={(e) =>
                    setActivityDetails({
                      ...activityDetails,
                      activityTitle: e.target.value,
                    })
                  }
                  placeholder="Enter activity title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Activity File
                </label>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50"
                  onClick={() => document.getElementById("file-upload").click()}
                >
                  <FaFileUpload className="mx-auto h-10 w-10 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    {activityDetails.fileName ||
                      "Click to upload or drag and drop"}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">PDF (Max 10MB)</p>
                </div>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".pdf"
                  onChange={(e) => {
                    const selectedFile = e.target.files[0];
                    if (selectedFile) {
                      setActivityDetails({
                        ...activityDetails,
                        activityFile: selectedFile,
                        fileName: selectedFile.name,
                        activityUrl: URL.createObjectURL(selectedFile),
                      });
                    }
                  }}
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                onClick={addActivity}
              >
                Add Activity
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivitiesStep;
