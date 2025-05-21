import { useEffect, useState } from "react";
import { FaImage } from "react-icons/fa";

const ThumbnailStep = (props) => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    props.setThumbnailInfo({ image });
  }, [image]);

  return (
    <div className="flex flex-col gap-6 w-full">
      <h2 className="text-xl font-semibold text-gray-800">Course Thumbnail</h2>
      <p className="text-gray-600">
        Upload an image that represents your course. A good thumbnail helps
        attract students.
      </p>

      <div className="flex flex-col items-center mt-4">
        <label
          htmlFor="thumbnailImage"
          className="cursor-pointer w-full max-w-md"
        >
          <div
            className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center ${
              image
                ? "border-blue-300 bg-blue-50"
                : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
            } transition-colors`}
          >
            <div className="p-4 bg-blue-100 rounded-full mb-4">
              <FaImage className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-center font-medium text-gray-700">
              {image ? "Change thumbnail image" : "Click to upload thumbnail"}
            </p>
            <p className="text-center text-sm text-gray-500 mt-2">
              JPG, PNG or GIF (Recommended: 1280×720px)
            </p>
          </div>
          <input
            type="file"
            id="thumbnailImage"
            onChange={(e) => setImage(e.target.files[0])}
            accept="image/*"
            hidden
          />
        </label>

        {image && (
          <div className="mt-8 w-full max-w-md">
            <h3 className="font-medium text-gray-700 mb-3">
              Thumbnail Preview
            </h3>
            <div className="border rounded-lg overflow-hidden shadow-sm">
              <img
                className="w-full object-cover h-48"
                src={URL.createObjectURL(image)}
                alt="Course Thumbnail"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {image.name} ({(image.size / 1024).toFixed(2)} KB)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThumbnailStep;