import React from "react";
import AssignedTask from "./AssignedTask";
import UserHeader from "./UserHeader";
import UserNotifications from "./UserNotifications";
import FileShared from "./FileShared";

function UserDashboard() {
  return (
    <>
      <UserHeader />
      <AssignedTask />
      <UserNotifications />
      <FileShared />
    </>
  );
}

export default UserDashboard;
