import { useRef, useState } from "react";
import Header from "./Header";
import { checkValidData } from "../utils/validate";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../utils/firebase";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { BG_IMG_URL, USER_AVATAR } from "../utils/constant";

const Login = () => {
  const [isSignInForm, setIsSignInForm] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const dispatch = useDispatch();

  const name = useRef(null);
  const email = useRef(null);
  const password = useRef(null);

  const handleButtonClick = () => {
    // Validate the form data
    const message = checkValidData(email.current.value, password.current.value);
    setErrorMessage(message);
    if (message) return;

    if (!isSignInForm) {
      // Sign Up Logic
      createUserWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value,
      )
        .then((userCredential) => {
          const user = userCredential.user;
          updateProfile(user, {
            displayName: name.current.value,
            photoURL: USER_AVATAR,
          })
            .then(() => {
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
              setErrorMessage(error.message);
            });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setErrorMessage(errorCode + "-" + errorMessage);
        });
    } else {
      // Sign In Logic
      signInWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value,
      )
        .then(() => {
          // Signed in successfully
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setErrorMessage(errorCode + "-" + errorMessage);
        });
    }
  };

  const toggleSignInForm = () => {
    setIsSignInForm(!isSignInForm);
  };

  return (
    <div className="relative">
      <Header />
      <div className="fixed inset-0 -z-10">
        <img
          className="h-full w-full object-cover"
          src={BG_IMG_URL}
          alt="Bg-img"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      <div className="flex items-center justify-center min-h-screen px-4 py-12">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="w-full max-w-md p-12 md:p-16 bg-black bg-opacity-85 text-white rounded-md shadow-2xl"
        >
          <h1 className="font-bold text-4xl mb-8">
            {isSignInForm ? "Sign In" : "Sign Up"}
          </h1>

          {isSignInForm && (
            <div className="bg-gradient-to-r from-yellow-900 to-yellow-800 p-4 rounded-md mb-6 border-l-4 border-yellow-400">
              <p className="text-yellow-200 font-semibold mb-2 flex items-center">
                <span className="mr-2">🔑</span> Test Credentials
              </p>
              <p className="text-xs text-yellow-100">
                <span className="font-semibold">Email:</span> user1@gmail.com
              </p>
              <p className="text-xs text-yellow-100">
                <span className="font-semibold">Password:</span> User1@1234
              </p>
            </div>
          )}

          {!isSignInForm && (
            <input
              ref={name}
              type="text"
              placeholder="Full Name"
              className="p-4 my-3 w-full bg-gray-700 bg-opacity-70 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 transition"
            />
          )}
          <input
            ref={email}
            type="text"
            placeholder="Email Address"
            className="p-4 my-3 w-full bg-gray-700 bg-opacity-70 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 transition"
          />
          <input
            ref={password}
            type="password"
            placeholder="Password"
            className="p-4 my-3 w-full bg-gray-700 bg-opacity-70 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 transition"
          />

          {errorMessage && (
            <p className="text-red-400 font-semibold text-sm py-2 bg-red-900 bg-opacity-30 px-3 rounded-md">
              ⚠️ {errorMessage}
            </p>
          )}

          <button
            className="p-4 my-6 w-full bg-red-600 hover:bg-red-700 text-white font-bold rounded-md transition duration-200 transform hover:scale-105"
            onClick={handleButtonClick}
          >
            {isSignInForm ? "Sign In" : "Sign Up"}
          </button>

          <p className="text-gray-400 text-sm">
            {isSignInForm ? "New to Netflix? " : "Already registered? "}
            <span
              className="text-white hover:underline cursor-pointer font-semibold"
              onClick={toggleSignInForm}
            >
              {isSignInForm ? "Sign Up Now" : "Sign In Now"}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
