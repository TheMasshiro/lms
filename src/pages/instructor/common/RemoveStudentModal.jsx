import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { BiErrorCircle } from "react-icons/bi";

const RemoveStudentModal = ({
  isOpen,
  onClose,
  onStudentsRemoved,
  backendUrl,
  getToken,
}) => {
  const [searchResults, setSearchResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const searchUsers = async () => {
    try {
      setSearchLoading(true);
      const token = await getToken();
      const { data } = await axios.get(backendUrl + `/api/educator/my-students`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setSearchResults(data.students || []);
        setFilteredResults(data.students || []);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    if (searchResults.length > 0) {
      const filtered = searchResults.filter(
        (user) =>
          userSearchTerm === "" ||
          user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
      );
      setFilteredResults(filtered);
    }
  }, [userSearchTerm, searchResults]);

  useEffect(() => {
    if (isOpen) {
      searchUsers();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedUsers([]);
      setUserSearchTerm("");
      setSearchResults([]);
      setFilteredResults([]);
    }
  }, [isOpen]);

  const toggleUserSelection = (user) => {
    setSelectedUsers((prev) =>
      prev.some((u) => u.id === user.id)
        ? prev.filter((u) => u.id !== user.id)
        : [...prev, user]
    );
  };

  const handleRemoveStudents = async () => {
    try {
      if (selectedUsers.length === 0) {
        return toast.error("Please select at least one student to remove");
      }
      await onStudentsRemoved(selectedUsers);
      onClose();
    } catch (error) {
      toast.error("Error removing students");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Remove Students
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 flex-grow overflow-auto">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Students
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                placeholder="Search by name or email"
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Current Students
              {filteredResults.length > 0 && ` (${filteredResults.length})`}
            </h3>
            <div className="border border-gray-200 rounded-md max-h-60 overflow-y-auto">
              {filteredResults.length > 0 ? (
                filteredResults.map((student) => (
                  <div
                    key={student.id}
                    className={`flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer ${
                      selectedUsers.some((u) => u.id === student.id)
                        ? "bg-red-50"
                        : ""
                    }`}
                    onClick={() => toggleUserSelection(student)}
                  >
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full overflow-hidden mr-3">
                        <img
                          src={
                            student.imageUrl || "https://via.placeholder.com/40"
                          }
                          alt={student.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">
                          {student.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {student.email}
                        </div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedUsers.some((u) => u.id === student.id)}
                      onChange={() => {}}
                      className="h-4 w-4 text-red-600"
                    />
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-gray-500">
                  {searchLoading
                    ? "Loading..."
                    : userSearchTerm
                    ? "No matching students found"
                    : "No students found"}
                </div>
              )}
            </div>
          </div>

          {selectedUsers.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Selected for Removal ({selectedUsers.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm"
                  >
                    {student.name}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleUserSelection(student);
                      }}
                      className="ml-2 text-red-600 hover:text-red-800"
                    >
                      <FaTimes className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedUsers.length > 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              <div className="flex items-start">
                <BiErrorCircle className="h-5 w-5 mr-2 mt-0.5 text-red-600" />
                <div>
                  <p className="font-medium">Warning</p>
                  <p>
                    You are about to remove {selectedUsers.length} student(s)
                    from your account. This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleRemoveStudents}
              disabled={selectedUsers.length === 0}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:bg-red-300"
            >
              Remove Students
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveStudentModal;