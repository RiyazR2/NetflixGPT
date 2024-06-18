import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { NETFLIX_LOGO } from "../utils/constant";

const Header = () => {
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigate("/");
      })
      .catch((error) => {
        // An error happened.
        navigate("/error");
      });
  };
  return (
    <div className="absolute w-screen px-8 py-2 bg-gradient-to-b  from-black z-10 flex justify-between">
      <img
        className="w-44 "
        src={NETFLIX_LOGO}
        alt="NETFLIX_LOGO"
      />

      {/* only show when user is logged in */}
      {user && (
        <div className="flex p-2">
          <img className="w-12 h-12 mx-2" src={user?.photoURL} alt="AVATAR" />
          <button className="font-bold text-white" onClick={handleSignOut}>
            (Sign Out)
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
