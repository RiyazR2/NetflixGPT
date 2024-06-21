import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { NETFLIX_LOGO } from "../utils/constant";
import { useEffect } from "react";
import { addUser, removeUser } from "../utils/userSlice";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {})
      .catch((error) => {
        // An error happened.
        navigate("/error", error);
      });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // console.log("onAuthStateChanged => user info", user);
      if (user) {
        const { uid, email, displayName, photoURL } = user;

        dispatch(
          addUser({
            uid: uid,
            email: email,
            displayName: displayName,
            photoURL: photoURL,
          })
        );
        navigate("/browse");
      } else {
        dispatch(removeUser());
        navigate("/");
      }
    });

    //unsubscribe when component unmount
    return () => unsubscribe(); // it will Remove onAuthStateChange from our Browsers when our component unload/unmount
  }, []);

  return (
    <div className="absolute w-screen px-8 py-2 bg-gradient-to-b  from-black z-10 flex justify-between">
      <img className="w-44 " src={NETFLIX_LOGO} alt="NETFLIX_LOGO" />

      {/* only show when user is logged in */}
      {user && (
        <div className="flex p-2">
          <img className="w-12 h-12 mx-2" src={user?.photoURL} alt="AVATAR" />
          <p className="font-bold text-white p-4">{user?.displayName}</p>
          <button className="font-bold text-white" onClick={handleSignOut}>
            (Sign Out)
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
