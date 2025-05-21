import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import uniqid from "uniqid";
import { 
  FaChevronDown, 
  FaTimes, 
  FaPlus, 
  FaFileAlt, 
  FaPlayCircle,
  FaCloudUploadAlt 
} from "react-icons/fa";

const ChaptersStep = (props) => {
  const [chapters, setChapters] = useState([]);
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [contentType, setContentType] = useState("video");
  const [files, setFiles] = useState([]);
  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: "",
    lectureDuration: "",
    lectureUrl: "",
    lectureFile: null,
    fileName: "",
    contentType: "video",
  });

  useEffect(() => {
    props.setChapterInfo({ chapters });
    props.setFileInfo({ files });
  }, [chapters, files]);

  const handleChapter = (action, chapterId) => {
    if (action === "add") {
      const title = prompt("Enter Chapter Name:");
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder:
            chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
        };
        setChapters([...chapters, newChapter]);
      }
    } else if (action === "remove") {
      const chapterToRemove = chapters.find(
        (chapter) => chapter.chapterId === chapterId
      );
      if (chapterToRemove) {
        const fileIdsToRemove = chapterToRemove.chapterContent
          .filter((lecture) => lecture.contentType === "file")
          .map((lecture) => lecture.fileId);

        if (fileIdsToRemove.length > 0) {
          setFiles(
            files.filter((file) => !fileIdsToRemove.includes(file.fileId))
          );
        }
      }

      setChapters(
        chapters.filter((chapter) => chapter.chapterId !== chapterId)
      );
    } else if (action === "toggle") {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId
            ? { ...chapter, collapsed: !chapter.collapsed }
            : chapter
        )
      );
    }
  };

  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === "add") {
      setCurrentChapterId(chapterId);
      setContentType("video");
      setLectureDetails({
        lectureTitle: "",
        lectureDuration: "",
        lectureUrl: "",
        lectureFile: null,
        fileName: "",
        contentType: "video",
      });
      setShowPopup(true);
    } else if (action === "remove") {
      const chapterIndex = chapters.findIndex(
        (chapter) => chapter.chapterId === chapterId
      );
      if (chapterIndex !== -1) {
        const lectureToRemove =
          chapters[chapterIndex].chapterContent[lectureIndex];

        if (
          lectureToRemove &&
          lectureToRemove.contentType === "file" &&
          lectureToRemove.fileId
        ) {
          setFiles(
            files.filter((file) => file.fileId !== lectureToRemove.fileId)
          );
        }

        setChapters(
          chapters.map((chapter) => {
            if (chapter.chapterId === chapterId) {
              chapter.chapterContent.splice(lectureIndex, 1);
            }
            return chapter;
          })
        );
      }
    }
  };

  const addLecture = () => {
    if (!lectureDetails.lectureTitle || !lectureDetails.lectureDuration) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (contentType === "video" && !lectureDetails.lectureUrl) {
      toast.error("Please enter a YouTube URL.");
      return;
    }

    if (contentType === "file" && !lectureDetails.lectureFile) {
      toast.error("Please upload a file.");
      return;
    }

    let fileId = null;
    if (contentType === "file" && lectureDetails.lectureFile) {
      fileId = uniqid();
      setFiles([
        ...files,
        {
          fileId,
          file: lectureDetails.lectureFile,
        },
      ]);
    }

    setChapters(
      chapters.map((chapter) => {
        if (chapter.chapterId === currentChapterId) {
          const newLecture = {
            ...lectureDetails,
            isPreviewFree: false,
            lectureOrder:
              chapter.chapterContent.length > 0
                ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1
                : 1,
            lectureId: uniqid(),
            fileId: fileId,
          };
          chapter.chapterContent.push(newLecture);
        }
        return chapter;
      })
    );

    setShowPopup(false);
    setLectureDetails({
      lectureTitle: "",
      lectureDuration: "",
      lectureUrl: "",
      lectureFile: null,
      fileName: "",
      contentType: "video",
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <h2 className="text-xl font-semibold text-gray-800">
        Chapters and Lectures
      </h2>

      <p className="text-gray-600">
        Organize your course content into chapters and lectures. Each chapter
        should have at least one lecture.
      </p>

      <div className="mt-2">
        {chapters.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 border-dashed rounded-lg p-8 text-center">
            <p className="text-gray-500 mb-4">
              No chapters yet. Add your first chapter to get started.
            </p>
            <button
              onClick={() => handleChapter("add")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Your First Chapter
            </button>
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
                      {chapter.chapterContent.length} Lecture
                      {chapter.chapterContent.length !== 1 ? "s" : ""}
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
                    {chapter.chapterContent.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">
                        No lectures in this chapter yet
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {chapter.chapterContent.map((lecture, lectureIndex) => (
                          <div
                            key={lectureIndex}
                            className="flex justify-between items-center p-3 rounded-md hover:bg-gray-50"
                          >
                            <div className="flex items-center">
                              <div
                                className={`${
                                  lecture.contentType === "file"
                                    ? "bg-green-100"
                                    : "bg-blue-100"
                                } p-2 rounded-full mr-3`}
                              >
                                {lecture.contentType === "file" ? (
                                  <FaFileAlt className="h-4 w-4 text-green-600" />
                                ) : (
                                  <FaPlayCircle className="h-4 w-4 text-blue-600" />
                                )}
                              </div>
                              <div>
                                <div className="font-medium text-gray-800">
                                  {lecture.lectureTitle}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {lecture.lectureDuration} min •{" "}
                                  {lecture.contentType === "file" ? (
                                    <a
                                      href={lecture.lectureUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-green-500 text-sm hover:underline"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      {lecture.fileName || "File Attachment"}
                                    </a>
                                  ) : (
                                    <a
                                      href={lecture.lectureUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-blue-500 ml-1 hover:underline"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      View YouTube
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                handleLecture(
                                  "remove",
                                  chapter.chapterId,
                                  lectureIndex
                                )
                              }
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <FaTimes className="h-5 w-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <button
                      className="mt-4 flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm"
                      onClick={() => handleLecture("add", chapter.chapterId)}
                    >
                      <FaPlus className="h-5 w-5 mr-1" />
                      Add Lecture
                    </button>
                  </div>
                )}
              </div>
            ))}
            <button
              onClick={() => handleChapter("add")}
              className="w-full py-3 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg font-medium hover:bg-blue-100 transition-colors flex items-center justify-center"
            >
              <FaPlus className="h-5 w-5 mr-2" />
              Add New Chapter
            </button>
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
                Add New Lecture
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
                  Lecture Title
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={lectureDetails.lectureTitle}
                  onChange={(e) =>
                    setLectureDetails({
                      ...lectureDetails,
                      lectureTitle: e.target.value,
                    })
                  }
                  placeholder="Enter lecture title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={lectureDetails.lectureDuration}
                  onChange={(e) =>
                    setLectureDetails({
                      ...lectureDetails,
                      lectureDuration: e.target.value,
                    })
                  }
                  placeholder="e.g. 15"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Type
                </label>
                <div className="flex border-b border-gray-200">
                  <button
                    className={`flex-1 py-2 text-center text-sm font-medium ${
                      contentType === "video"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setContentType("video")}
                  >
                    YouTube URL
                  </button>
                  <button
                    className={`flex-1 py-2 text-center text-sm font-medium ${
                      contentType === "file"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setContentType("file")}
                  >
                    File Attachment
                  </button>
                </div>
              </div>

              {contentType === "video" ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    YouTube URL
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={lectureDetails.lectureUrl}
                    onChange={(e) =>
                      setLectureDetails({
                        ...lectureDetails,
                        lectureUrl: e.target.value,
                        contentType: "video",
                      })
                    }
                    placeholder="https://youtube.com/watch?v=..."
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Enter a YouTube video URL for this lecture
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload File
                  </label>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50"
                    onClick={() =>
                      document.getElementById("file-upload").click()
                    }
                  >
                    <FaCloudUploadAlt className="mx-auto h-10 w-10 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      {lectureDetails.fileName ||
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
                        setLectureDetails({
                          ...lectureDetails,
                          lectureFile: selectedFile,
                          fileName: selectedFile.name,
                          contentType: "file",
                          lectureUrl: URL.createObjectURL(selectedFile),
                        });
                      }
                    }}
                  />
                </div>
              )}
            </div>

            <div className="mt-6">
              <button
                type="button"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                onClick={addLecture}
              >
                Add Lecture
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChaptersStep;
