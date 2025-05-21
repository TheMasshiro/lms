import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loading from "../../components/learner/Loading";
import { AppContext } from "../../context/AppContext";

const LearnersEnrolled = () => {
  const { backendUrl, getToken, isEducator } = useContext(AppContext);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEnrolledStudents = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(
        backendUrl + "/api/educator/enrolled-students",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setEnrolledStudents(data.enrolledStudents.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchEnrolledStudents();
    }
  }, [isEducator]);

  if (!isEducator || isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="w-full">
        {enrolledStudents.length === 0 ? (
          <div className="text-center mt-20 w-full text-gray-600">
            <h3 className="text-2xl font-semibold mb-4">No Enrollments Yet</h3>
            <p className="text-lg">
              No students have enrolled in your course yet.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
            <table className="table-fixed md:table-auto w-full overflow-hidden pb-4">
              <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold text-center hidden sm:table-cell">
                    #
                  </th>
                  <th className="px-4 py-3 font-semibold">Student Name</th>
                  <th className="px-4 py-3 font-semibold">Course Title</th>
                  <th className="px-4 py-3 font-semibold hidden sm:table-cell">
                    Member
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-500">
                {enrolledStudents.map((item, index) => (
                  <tr key={index} className="border-b border-gray-500/20">
                    <td className="px-4 py-3 text-center hidden sm:table-cell">
                      {index + 1}
                    </td>
                    <td className="md:px-4 px-2 py-3 flex items-center space-x-3">
                      {item.student.imageUrl && (
                        <img
                          src={item.student.imageUrl}
                          alt="Profile"
                          className="w-9 h-9 rounded-full"
                        />
                      )}
                      <span className="truncate">{item.student.name}</span>
                    </td>
                    <td className="px-4 py-3 truncate">{item.courseTitle}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          item.student.isMember
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.student.isMember ? "Member" : "Not yet member"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearnersEnrolled;
