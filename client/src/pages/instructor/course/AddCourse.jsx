import axios from "axios";
import { useContext, useState } from "react";
import StepWizard from "react-step-wizard";
import { toast } from "react-toastify";
import ActionButtons from "../../../components/instructor/common/ActionButtons";
import MyStepper from "../../../components/instructor/common/Stepper";
import Loading from "../../../components/learner/Loading";
import { AppContext } from "../../../context/AppContext";
import BasicInfoStep from "./common/BasicInfoStep";
import ChaptersStep from "./common/ChaptersStep";
import ReviewStep from "./common/ReviewStep";
import ThumbnailStep from "./common/ThumbnailStep";
import ActivitiesStep from "./common/ActivitiesStep";

const AddCourse = () => {
  const { backendUrl, getToken, isEducator, userData, navigate } =
    useContext(AppContext);
  const [instance, setInstance] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [basicInfo, setBasicInfo] = useState({
    courseTitle: "",
    courseCode: "",
    getDescription: () => "",
  });
  const [thumbnailInfo, setThumbnailInfo] = useState({
    image: null,
  });
  const [chapterInfo, setChapterInfo] = useState({
    chapters: [],
  });
  const [activityInfo, setActivityInfo] = useState({
    activities: [],
  });
  const [fileInfo, setFileInfo] = useState({
    files: [],
  });
  const [activityFileInfo, setActivityFIleInfo] = useState({
    activityFiles: [],
  });

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          basicInfo.courseTitle.trim() !== "" &&
          basicInfo.courseCode.trim() !== ""
        );
      case 2:
        return thumbnailInfo.image !== null;
      case 3:
        return (
          chapterInfo.chapters.length > 0 &&
          !chapterInfo.chapters.some(
            (chapter) => chapter.chapterContent.length === 0
          )
        );
      default:
        return true;
    }
  };

  const addCoursesCount = async () => {
    if (!userData) {
      return toast.error("User not found");
    }

    try {
      const token = await getToken();
      const { data } = await axios.post(
        backendUrl + "/api/user/add-course-count",
        {},
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

  const handleSubmit = async () => {
    try {
      if (!thumbnailInfo.image) {
        toast.error("Thumbnail image is required");
        return;
      }

      if (userData?.coursesCount >= 3 && !userData?.isMember) {
        return toast.error(
          "You have reached the maximum number of courses, please join the membership to add more courses"
        );
      }

      if (chapterInfo.chapters.length === 0) {
        toast.error("Please add at least one chapter");
        return;
      }

      if (
        chapterInfo.chapters.some(
          (chapter) => chapter.chapterContent.length === 0
        )
      ) {
        toast.error("Please add at least one lecture to each chapter");
        return;
      }

      if (
        chapterInfo.chapters.some(
          (chapter) => chapter.chapterTitle.trim() === ""
        )
      ) {
        toast.error("Chapter title cannot be empty");
        return;
      }

      const courseData = {
        courseTitle: basicInfo.courseTitle,
        courseCode: basicInfo.courseCode,
        courseDescription: basicInfo.getDescription(),
        courseContent: chapterInfo.chapters,
        chapterActivities: activityInfo.activities,
      };

      const formData = new FormData();
      formData.append("courseData", JSON.stringify(courseData));
      formData.append("image", thumbnailInfo.image);

      if (fileInfo.files && fileInfo.files.length > 0) {
        fileInfo.files.forEach((fileObj) => {
          if (fileObj.file) {
            formData.append("file", fileObj.file);
          }
        });
      }

      if (
        activityFileInfo.activityFiles &&
        activityFileInfo.activityFiles.length > 0
      ) {
        activityFileInfo.activityFiles.forEach((fileObj) => {
          if (fileObj.file) {
            formData.append("activity", fileObj.file);
          }
        });
      }

      toast.info("Creating course... Please wait.");

      const token = await getToken();
      const { data } = await axios.post(
        backendUrl + "/api/educator/add-course",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        setBasicInfo({
          courseTitle: "",
          courseCode: "",
          getDescription: () => "",
        });
        setThumbnailInfo({ image: null });
        setChapterInfo({ chapters: [] });
        setActivityInfo({ activities: [] });
        setFileInfo({ files: [] });
        setActivityFIleInfo({ activityFiles: [] });
        await addCoursesCount();

        if (instance) {
          instance.goToStep(1);
        }

        toast.info("Redirecting to courses");
        setTimeout(() => {
          navigate("/educator/courses");
        }, 1000);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const setStepWizardInstance = (wizardInstance) => {
    setInstance(wizardInstance);
  };

  const goToNextStep = () => {
    if (instance && currentStep < 5) {
      if (validateCurrentStep()) {
        instance.nextStep();
      } else {
        switch (currentStep) {
          case 1:
            toast.error("Please enter a course title");
            break;
          case 2:
            toast.error("Please upload a thumbnail image");
            break;
          case 3:
            toast.error(
              "Please add at least one chapter with at least one lecture"
            );
            break;
        }
      }
    }
  };

  const goToPrevStep = () => {
    if (instance && currentStep > 1) {
      instance.previousStep();
    }
  };

  return isEducator ? (
    <div className="bg-blue-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 px-2 sm:px-0">
          Create New Course
        </h1>

        <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl shadow-sm mb-4 sm:mb-6 lg:mb-8">
          <MyStepper currentStep={currentStep} />
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm min-h-[60vh] sm:min-h-screen p-4 sm:p-6 lg:p-8 pb-16 sm:pb-20 lg:pb-24">
          <div className="max-w-full sm:max-w-4xl mx-auto">
            <StepWizard
              initialStep={1}
              onStepChange={(stats) => setCurrentStep(stats.activeStep)}
              instance={setStepWizardInstance}
              transitions={{}}
            >
              <BasicInfoStep setBasicInfo={setBasicInfo} />
              <ThumbnailStep setThumbnailInfo={setThumbnailInfo} />
              <ChaptersStep
                setChapterInfo={setChapterInfo}
                setFileInfo={setFileInfo}
              />
              <ActivitiesStep
                initialChapters={chapterInfo.chapters}
                setActivitiesInfo={setActivityInfo}
                setActivityFileInfo={setActivityFIleInfo}
              />
              <ReviewStep
                basicInfo={basicInfo}
                thumbnailInfo={thumbnailInfo}
                chapterInfo={chapterInfo}
                activityInfo={activityInfo}
              />
            </StepWizard>
          </div>
        </div>

        <ActionButtons
          currentStep={currentStep}
          totalSteps={5}
          nextStep={goToNextStep}
          previousStep={goToPrevStep}
          onFinish={handleSubmit}
          isStepValid={validateCurrentStep()}
        />
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default AddCourse;