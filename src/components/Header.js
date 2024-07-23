import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { NETFLIX_LOGO, SUPPORTED_LANGUAGES } from "../utils/constant";
import { useEffect } from "react";
import { addUser, removeUser } from "../utils/userSlice";
import { resetGptState, toggleGptSearchView } from "../utils/gptSlice";
import { changeLanguage } from "../utils/configSlice";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const showGptSearch = useSelector((store) => store.gpt.showGptSearch);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
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

  // Toggle GptSearch and clear Search Results
  const handleGptSearchClick = () => {
    if (showGptSearch) {
      dispatch(resetGptState());
    } else {
      dispatch(toggleGptSearchView());
    }
  };

  const handleLanguageChange = (e) => {
    dispatch(changeLanguage(e.target.value));
  };

  return (
    <div className="absolute w-screen px-8 py-2 bg-gradient-to-b from-black z-10 flex flex-col md:flex-row justify-between">
      <img
        className="w-44 mx-auto md:mx-0"
        src={NETFLIX_LOGO}
        alt="NETFLIX_LOGO"
      />

      {/* only show when user is logged in */}
      {user && (
        <div className="flex p-2 justify-between">
          {showGptSearch && (
            <select
              className="bg-gray-900 text-white p-2 m-2 rounded-lg"
              onChange={handleLanguageChange}
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option value={lang.identifier} key={lang.identifier}>
                  {lang.name}
                </option>
              ))}
            </select>
          )}
          <button
            className=" py-0 px-3 mx-4 bg-purple-800 text-white rounded-lg"
            onClick={handleGptSearchClick}
          >
            {showGptSearch ? "Home" : "GPT Search"}
          </button>
          <img
            className="hidden md:block w-12 h-12 mx-2"
            src={user?.photoURL}
            alt="AVATAR"
          />
          <p className="hidden md:block font-bold text-white p-4">
            {user?.displayName}
          </p>
          <button
            className="font-bold text-white text-sm"
            onClick={handleSignOut}
          >
            (Sign Out)
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
