import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/learner/Loading";
import { useUser } from "@clerk/clerk-react";

const PersonalInfo = () => {
  const { userData } = useContext(AppContext);
  const { user } = useUser();

  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  if (!userData || !user) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 md:p-8 p-4 pt-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        <h2 className="text-3xl font-semibold text-gray-800">Personal Information</h2>

        <div className="flex items-center gap-6 bg-white border border-gray-200 shadow-card rounded-xl p-6">
          <img
            src={userData.imageUrl || "/default-avatar.png"}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border border-gray-300"
          />
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{userData.name}</h3>
            <p className="text-gray-500">{userData.email}</p>
            {userData.phone && <p className="text-gray-500">{userData.phone}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <InfoCard title="Account Type" value={capitalize(user.publicMetadata.role)} />

          <InfoCard
            title="Joined On"
            value={
              userData.createdAt
                ? new Date(userData.createdAt).toLocaleDateString()
                : "N/A"
            }
          />

          <InfoCard
            title="Membership Status"
            value={userData.isMember ? "Active Membership" : "No Active Membership"}
          />
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ title, value }) => (
  <div className="bg-white shadow-card border border-gray-200 rounded-xl p-5">
    <p className="text-gray-500 text-sm mb-1">{title}</p>
    <p className="text-gray-700 text-lg font-medium">{value}</p>
  </div>
);

export default PersonalInfo;
