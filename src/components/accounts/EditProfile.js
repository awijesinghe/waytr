import React, { useState, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import Firebase from "../../firebase/firebase";

const EditProfile = props => {
  const { currentUserId, currentUserData, setCurrentUserData } = useContext(
    UserContext
  );
  const [firstName, setFirstName] = useState(currentUserData.firstName || "");
  const [lastName, setLastName] = useState(currentUserData.lastName || "");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const saveProfile = async event => {
    event.preventDefault();
    try {
      await Firebase.db
        .collection("users")
        .doc(currentUserId.uid)
        .update({ firstName, lastName });
      if (Firebase.auth.currentUser) {
        await Firebase.auth.currentUser.updateProfile({ displayName: firstName });
      }
      setCurrentUserData({ firstName, lastName });
      setSuccessMessage("Profile updated successfully!");
      setErrorMessage(null);
      setTimeout(() => {
        props.history.push("/users/" + currentUserId.uid);
      }, 1000);
    } catch (err) {
      setErrorMessage("Failed to update profile. Please try again.");
      setSuccessMessage(null);
    }
  };

  return (
    <div className="container">
      <form onSubmit={saveProfile} className="white">
        <h5 className="grey-text text-darken-3 center">Edit Profile</h5>
        <div className="input-field">
          <label htmlFor="firstName" className={firstName ? "active" : ""}>
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            required
            value={firstName}
            onChange={event => setFirstName(event.target.value)}
          />
        </div>
        <div className="input-field">
          <label htmlFor="lastName" className={lastName ? "active" : ""}>
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            required
            value={lastName}
            onChange={event => setLastName(event.target.value)}
          />
        </div>
        <div className="input-field center">
          <button className="btn green lighten-1 z-depth-0">
            Save Changes
          </button>
        </div>
        {errorMessage && (
          <p className="red-text center">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="green-text center">{successMessage}</p>
        )}
      </form>
    </div>
  );
};

export default EditProfile;
