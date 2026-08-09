import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { NETFLIX_LOGO, SUPPORTED_LANGUAGES } from "../utils/constant";
import { useEffect } from "react";
import { addUser, removeUser } from "../utils/userSlice";
import { resetGptState, toggleGptSearchView } from "../utils/gptSlice";
import { changeLanguage } from "../utils/configSlice";
import lang from "../utils/languageConstants";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const showGptSearch = useSelector((store) => store.gpt.showGptSearch);
  const langKey = useSelector((store) => store.config.lang);

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

  // onAuthStateChange event moved here from body component because header is always there for any component
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
          }),
        );
        navigate("/browse");
      } else {
        dispatch(removeUser());
        navigate("/");
      }
    });

    //unsubscribe when component unmount
    return () => unsubscribe(); // it will Remove onAuthStateChange from our Browsers when our component unload/unmount
  }, [dispatch, navigate]);

  // Toggle GptSearch and clear Search Results
  const handleGptSearchClick = () => {
    if (showGptSearch) {
      dispatch(resetGptState());
    }
    dispatch(toggleGptSearchView());
  };

  const handleLanguageChange = (e) => {
    dispatch(changeLanguage(e.target.value));
  };

  return (
    <div className="absolute w-screen px-8 py-2 bg-gradient-to-b from-black z-50 flex flex-col md:flex-row justify-between">
      <img
        className="w-44 mx-auto md:mx-0"
        src={NETFLIX_LOGO}
        alt="NETFLIX_LOGO"
      />

      {/* only show when user is logged in */}
      {user && (
        <div className="flex items-center gap-2 md:gap-4 p-2">
          {/* Compact Language Selector - Always show with icon */}
          <div className="relative group">
            <select
              className="appearance-none bg-gray-800/80 border border-gray-600 text-white pl-3 pr-8 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 hover:bg-gray-700 transition-all duration-300 cursor-pointer"
              onChange={handleLanguageChange}
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option value={lang.identifier} key={lang.identifier}>
                  {lang.name}
                </option>
              ))}
            </select>
            {/* Globe Icon */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          {/* GPT Search Toggle Button */}
          <button
            className="group relative px-3 py-2 md:px-5 md:py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-xs md:text-sm rounded-lg shadow-lg hover:shadow-purple-500/50 transform hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 whitespace-nowrap cursor-pointer"
            onClick={handleGptSearchClick}
          >
            <span className="flex items-center gap-1.5">
              {showGptSearch ? (
                <>
                  <svg
                    className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  <span className="hidden sm:inline">{lang[langKey].home}</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 group-hover:scale-110 transition-transform"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  <span className="hidden sm:inline">
                    {lang[langKey].aiSearch}
                  </span>
                </>
              )}
            </span>
          </button>

          {/* User Profile */}
          <div className="hidden md:flex items-center gap-2">
            <img
              className="w-8 h-8 md:w-10 md:h-10 rounded-full ring-2 ring-white/20 hover:ring-red-500/50 transition-all duration-300 cursor-pointer"
              src={user?.photoURL}
              alt="AVATAR"
            />
            <p className="font-medium text-white text-xs md:text-sm max-w-[100px] truncate">
              {user?.displayName}
            </p>
          </div>

          {/* Sign Out Button */}
          <button
            className="group relative px-3 py-2 md:px-4 md:py-2 bg-red-600/80 hover:bg-red-700 text-white font-semibold text-xs md:text-sm rounded-lg border border-red-500/50 hover:border-red-400 shadow-md hover:shadow-red-500/50 transform hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 whitespace-nowrap cursor-pointer"
            onClick={handleSignOut}
          >
            <span className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="hidden sm:inline">{lang[langKey].signOut}</span>
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
