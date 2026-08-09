import Header from "./Header";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../utils/firebase";
import { useRef, useState } from "react";
import { checkValidData } from "../utils/validate";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { USER_AVATAR, BG_IMG_URL } from "../utils/constant";

const Login = () => {
  const [isSignInForm, setSignInForm] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const dispatch = useDispatch();

  const name = useRef(null);
  const email = useRef(null);
  const password = useRef(null);

  // Validation
  // console.log(name.current.value)
  const handleButtonClick = () => {
    // console.log(email.current.value, password.current.value);
    const message = checkValidData(
      email.current.value,
      password.current.value,
      // name.current.value
    );
    setErrorMessage(message);
    if (message) return; //if message->(error msg) then return Message

    //Sign up Logic
    if (!isSignInForm) {
      createUserWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value,
      )
        .then((userCredential) => {
          const user = userCredential.user;

          // As Soon As new user Successfuly register then updating the profile with name and photoURL
          updateProfile(user, {
            displayName: name.current.value,
            photoURL: USER_AVATAR,
          })
            .then(() => {
              // Profile updated!
              const { uid, email, displayName, photoURL } = auth.currentUser;
              dispatch(
                addUser({
                  uid: uid,
                  email: email,
                  displayName: displayName,
                  photoURL: photoURL,
                }),
              );
            })
            .catch((error) => {
              // An error occurred
              setErrorMessage(error.message);
            });
          // console.log(user);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setErrorMessage(errorCode + "-" + errorMessage);
        });
    } else {
      //Sign in Logic

      signInWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value,
      )
        .then((userCredential) => {
          // Signed in
          // const user = userCredential.user;
          // console.log(user);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setErrorMessage(errorCode + "-" + errorMessage);
        });
    }
  };

  const toggleSignInForm = () => {
    // console.log("Toggle SignIn Clicked");
    setSignInForm(!isSignInForm);
  };

  return (
    <div>
      <Header />

      <div className="absolute ">
        <img
          className="h-screen fixed object-cover w-screen aspect-video"
          src={BG_IMG_URL}
          alt="Background"
        />
        <div className="absolute text-white top-10 left-0 right-0  flex items-center justify-center text-2xl z-10"></div>
      </div>

      <form
        className="w-11/12 md:w-3/12 absolute p-8 bg-black my-28 mx-auto right-0 left-0 text-white  rounded-lg bg-opacity-80"
        onSubmit={(e) => e.preventDefault()}
      >
        <h1 className="font-bold text-2xl md:text-3xl py-4">
          {isSignInForm ? "Sign In" : "Sign Up"}
        </h1>

        {/* Test Credentials - Only show on Sign In page */}
        {isSignInForm && (
          <div className="mb-4 p-3 bg-gradient-to-r from-gray-800/60 to-gray-900/60 rounded-lg border border-gray-700/50">
            <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              Quick Test Login:
            </p>
            <p className="text-sm text-white font-mono bg-gray-900/50 px-2 py-1 rounded">
              user1@gmail.com / User1@1234
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Or create your own account using Sign Up →
            </p>
          </div>
        )}
        {/* Only show Full Name when SignUP is Active */}
        {!isSignInForm && (
          <input
            ref={name}
            type="text"
            placeholder="Full Name"
            className="p-4 my-4 w-full bg-gray-700 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
          />
        )}
        <input
          ref={email}
          type="email"
          placeholder="Email Address"
          className="p-4 my-4 w-full bg-gray-700 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
        />
        <input
          ref={password}
          type="password"
          placeholder="Password"
          className="p-4 my-4 w-full bg-gray-700 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
        />

        {errorMessage && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 mb-4 animate-shake">
            <p className="text-red-400 text-sm font-medium flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {errorMessage}
            </p>
          </div>
        )}

        <button
          className="group relative w-full p-4 my-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-red-500/50 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black overflow-hidden"
          onClick={handleButtonClick}
        >
          {/* Shine effect */}
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

          <span className="relative flex items-center justify-center gap-2">
            {isSignInForm ? (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                Sign In
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                Sign Up
              </>
            )}
          </span>
        </button>

        <div className="text-center mt-4">
          <button
            className="text-gray-400 hover:text-white transition-colors duration-200 text-sm group"
            onClick={toggleSignInForm}
          >
            {isSignInForm ? (
              <span className="flex items-center justify-center gap-1">
                New to Netflix?
                <span className="text-white font-semibold group-hover:underline">
                  Sign up now
                </span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1">
                Already Registered?
                <span className="text-white font-semibold group-hover:underline">
                  Sign In now
                </span>
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
