import React, { useContext, useEffect } from "react";
import ProfileData from "./ProfileData";
import { UserContext } from "../../contexts/UserContext";
import Firebase from "../../firebase/firebase";

const ViewProfile = () => {
  const {
    currentUserId,
    currentUserData,
    setCurrentUserData,
    setIsLoading
  } = useContext(UserContext);

  useEffect(() => {
    if (currentUserId.uid) {
      Firebase.getUserData(currentUserId.uid).then(response => {
        setIsLoading(response.loading);
        if (
          response.userData.hasOwnProperty("firstName") &&
          !currentUserData.firstName &&
          !currentUserData.lastName
        ) {
          setCurrentUserData({
            firstName: response.userData.firstName,
            lastName: response.userData.lastName
          });
        }
      });
    }
  }, [currentUserId.uid]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <ProfileData />
    </div>
  );
};

export default ViewProfile;
