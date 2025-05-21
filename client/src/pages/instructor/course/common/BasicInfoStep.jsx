import Quill from "quill";
import { useEffect, useRef, useState } from "react";

const BasicInfoStep = (props) => {
  const [courseTitle, setCourseTitle] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const provideRandomCourseCode = () => {
    const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
      if (i === 3) code += "-";
    }
    return code;
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Write your course description here...",
      });
    }
  }, []);

  useEffect(() => {
    setCourseCode(provideRandomCourseCode());
  }, []);

  useEffect(() => {
    props.setBasicInfo({
      courseTitle,
      courseCode,
      getDescription: () => quillRef.current?.root.innerHTML || "",
    });
  }, [courseTitle, courseCode]);

  return (
    <div className="flex flex-col gap-6 w-full">
      <h2 className="text-xl font-semibold text-gray-800">
        Basic Course Information
      </h2>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
          Course Title
        </label>
        <input
          onChange={(e) => setCourseTitle(e.target.value)}
          value={courseTitle}
          type="text"
          placeholder="Enter your course title"
          className="outline-none py-3 px-4 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Course Code</label>
        <input
          type="text"
          value={courseCode}
          readOnly
          className="py-3 px-4 rounded-md border border-gray-300 bg-gray-50 text-gray-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          This code will be used by students to join your course
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
          Course Description
        </label>
        <div ref={editorRef} className="min-h-40 border rounded-md"></div>
      </div>
    </div>
  );
};

export default BasicInfoStep;