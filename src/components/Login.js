import { useState } from "react";
import Header from "./Header";

const Login = () => {
  const [isSignInForm, setSignInForm] = useState(true);

  const toggleSignInForm = () => {
    setSignInForm(!isSignInForm);
    console.log("Clicked");
  };
  return (
    <div>
      <Header />
      <div className="absolute">
        <img
          src="https://assets.nflxext.com/ffe/siteui/vlv3/cacfadb7-c017-4318-85e4-7f46da1cae88/e43aa8b1-ea06-46a5-abe3-df13243e718d/IN-en-20240603-popsignuptwoweeks-perspective_alpha_website_large.jpg"
          alt="logo"
        />
      </div>
      <form className="w-3/12 absolute p-12 bg-black my-36 mx-auto right-0 left-0 text-white  rounded-lg">
        <h1 className="font-bold text-3xl py-4">
          {isSignInForm ? "Sign In" : "Sign Up"}
        </h1>
        {/* Only show Full Name when SignUP is Active */}
        {!isSignInForm && (
          <input
            type="text"
            placeholder="Full Name"
            className="p-4   my-6 w-full bg-gray-700"
          />
        )}
        <input
          type="text"
          placeholder="Email Adress"
          className="p-4   my-6 w-full bg-gray-700"
        />
        <input
          type="password"
          placeholder="password"
          className="p-4 my-6 w-full bg-gray-700"
        />
        <button className="p-4 my-6 bg-red-700 w-full rounded-lg font-bold">
          {isSignInForm ? "Sign In" : "Sign Up"}
        </button>{" "}
        <p className="p-4 text-lg " onClick={toggleSignInForm}>
          {isSignInForm ? (
            <>
              New to Netflix?
              <span className="cursor-pointer hover:underline">
                Sign up now.
              </span>
            </>
          ) : (
            <>
              Already Registered?
              <span className="cursor-pointer hover:underline">
                Sign In now
              </span>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default Login;
