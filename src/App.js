import React, { useContext, useEffect } from "react";
import Routes from "./components/layout/Routes";
import Navbar from "./components/layout/Navbar";
import Firebase from "./firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { UserContext } from "./contexts/UserContext";

function App() {
  const [user, initialising] = useAuthState(Firebase.auth);
  const { currentUserId, setCurrentUserId } = useContext(UserContext);

  useEffect(() => {
    if (!initialising) {
      if (user) {
        user.getIdTokenResult().then(idTokenResult => {
          user.admin = idTokenResult.claims.admin ? true : false;
          user.restaurantManager = idTokenResult.claims.restaurantID
            ? idTokenResult.claims.restaurantID
            : false;
          setCurrentUserId(user);
        });
      } else if (currentUserId.uid !== null) {
        setCurrentUserId({ uid: null });
      }
    }
  }, [user, initialising]); // eslint-disable-line react-hooks/exhaustive-deps

  if (initialising) {
    return <div className="loader container center"></div>;
  }

  return (
    <div className="App wholepage">
      <Navbar user={user} />
      <Routes user={user} />
    </div>
  );
}

export default App;
