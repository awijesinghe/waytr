import React from "react";
import { Link } from "react-router-dom";
import Firebase from "../../../firebase/firebase";

const CustomerNav = user => {
  const SignOut = () => {
    Firebase.signOut();
  };

  return (
    <ul className="right">
      <li>
        <Link to={"/users/" + user.user.uid} className="black-text">
          {user.user.displayName}
        </Link>
      </li>
      <li>
        <Link to="/edit_profile" className="black-text">
          Edit Profile
        </Link>
      </li>
      <li>
        <a href="/" onClick={SignOut} className="black-text">
          Log Out
        </a>
      </li>
    </ul>
  );
};

export default CustomerNav;
