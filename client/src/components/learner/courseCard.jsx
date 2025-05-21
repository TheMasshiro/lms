import { useContext } from "react";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { FaGraduationCap } from "react-icons/fa";

const CourseCard = ({ course }) => {
  const { calculateRating } = useContext(AppContext);
  
  return (
    <Link
      to={"/student/courses/view/" + course._id}
      onClick={() => scrollTo(0, 0)}
      className="block h-full overflow-hidden"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
          src={course.courseThumbnail}
          alt={`${course.courseTitle} Thumbnail`}
        />
        {course.isFeatured && (
          <div className="absolute top-3 right-3 bg-yellow-500 text-white text-xs font-medium px-2 py-1 rounded-full">
            Featured
          </div>
        )}
      </div>
      
      <div className="p-4 h-full">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
          {course.courseTitle}
        </h3>
        
        <p className="text-sm text-gray-600 mb-2 flex items-center">
          <FaGraduationCap className="h-4 w-4 mr-1 text-gray-500" />
          {course.educator.name}
        </p>
        
        <div className="flex items-center mt-auto">
          <div className="flex items-center">
            <span className="text-amber-500 font-medium mr-1">
              {calculateRating(course).toFixed(1)}
            </span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <img
                  key={i}
                  src={
                    i < Math.floor(calculateRating(course))
                      ? assets.star
                      : assets.star_blank
                  }
                  alt=""
                  className="w-3.5 h-3.5"
                />
              ))}
            </div>
            <span className="ml-2 text-xs text-gray-500">
              ({course.courseRatings.length})
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;