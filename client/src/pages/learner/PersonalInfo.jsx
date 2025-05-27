import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/learner/Loading";
import { useUser } from "@clerk/clerk-react";
import { FaUser, FaEnvelope, FaCalendarAlt, FaCrown, FaPhone, FaGraduationCap, FaUsers } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

const PersonalInfo = () => {
  const { userData } = useContext(AppContext);
  const { user } = useUser();

  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  if (!userData || !user) return <Loading />;

  const isStudent = user.publicMetadata.role === "student";
  const isEducator = user.publicMetadata.role === "educator";

  return (
    <div className="min-h-screen bg-blue-50 p-4 pt-8 md:p-8">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        <div className="text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Personal Information
          </h2>
          <p className="text-gray-600">Manage your account details and preferences</p>
        </div>

        <div className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6 md:p-8 hover:shadow-xl transition-shadow duration-300">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <img
                src={userData.imageUrl || "/default-avatar.png"}
                alt="Profile"
                className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-blue-100 shadow-lg"
              />
              {userData.isMember && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-2 shadow-lg">
                  <FaCrown className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
            
            <div className="text-center md:text-left flex-1">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                {userData.name}
              </h3>
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-gray-600">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <FaEnvelope className="h-4 w-4 text-blue-500" />
                  <span className="text-sm md:text-base truncate">{userData.email}</span>
                </div>
                {userData.phone && (
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <FaPhone className="h-4 w-4 text-green-500" />
                    <span className="text-sm md:text-base">{userData.phone}</span>
                  </div>
                )}
              </div>
              
              {userData.isMember && (
                <div className="mt-3 inline-flex items-center bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-full px-4 py-2">
                  <HiSparkles className="h-4 w-4 text-yellow-600 mr-2" />
                  <span className="text-sm font-medium text-yellow-700">Premium Member</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <InfoCard 
            title="Account Type" 
            value={capitalize(user.publicMetadata.role)}
            icon={<FaUser className="h-5 w-5 text-blue-500" />}
            bgColor="bg-blue-50"
            borderColor="border-blue-200"
          />

          <InfoCard
            title="Joined On"
            value={
              userData.createdAt
                ? new Date(userData.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                : "N/A"
            }
            icon={<FaCalendarAlt className="h-5 w-5 text-green-500" />}
            bgColor="bg-green-50"
            borderColor="border-green-200"
          />

          <InfoCard
            title="Membership Status"
            value={userData.isMember ? "Active Membership" : "No Active Membership"}
            icon={<FaCrown className="h-5 w-5 text-yellow-500" />}
            bgColor={userData.isMember ? "bg-yellow-50" : "bg-gray-50"}
            borderColor={userData.isMember ? "border-yellow-200" : "border-gray-200"}
            className="md:col-span-2 lg:col-span-1"
          />
        </div>

        <div className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6 md:p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <div className="h-6 w-1 bg-blue-500 rounded-full"></div>
            Account Statistics
          </h3>
          
          <div className="w-full max-w-md mx-auto">
            {isStudent && (
              <StatCard
                label="Enrolled Courses"
                value={userData.enrollmentCount || 0}
                bgColor="bg-indigo-50"
                textColor="text-indigo-600"
                icon={<FaGraduationCap className="h-6 w-6" />}
              />
            )}
            
            {isEducator && (
              <StatCard
                label="Total Students"
                value={userData.students?.length || 0}
                bgColor="bg-emerald-50"
                textColor="text-emerald-600"
                icon={<FaUsers className="h-6 w-6" />}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ title, value, icon, bgColor, borderColor, className = "" }) => (
  <div className={`bg-white shadow-lg border ${borderColor} rounded-xl p-4 md:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${className}`}>
    <div className={`inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 ${bgColor} rounded-lg mb-3 md:mb-4`}>
      {icon}
    </div>
    <p className="text-gray-500 text-xs md:text-sm mb-2 font-medium">{title}</p>
    <p className="text-gray-800 text-lg md:text-xl font-bold break-words">{value}</p>
  </div>
);

const StatCard = ({ label, value, bgColor, textColor, icon }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-8 hover:shadow-lg transition-all duration-300 w-full">
    <div className={`${bgColor} rounded-xl p-6 mb-6 flex items-center justify-center`}>
      <div className="flex flex-col items-center gap-3">
        <div className={`${textColor}`}>
          {icon}
        </div>
        <p className={`text-4xl font-bold ${textColor}`}>{value}</p>
      </div>
    </div>
    <p className="text-gray-600 font-medium text-center text-lg">{label}</p>
  </div>
);

export default PersonalInfo;
