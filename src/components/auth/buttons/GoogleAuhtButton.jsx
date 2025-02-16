import GoogleIcon from "../../../assets/google-color-svgrepo-com.svg";

import {
  googleSignInWithRedirect,
  googleSignInWithPopup
} from "../../../lib/firebase";

const GoogleAuhtButton = () => {
  
  const handleSignIn = async () => {
    const data = await googleSignInWithRedirect()
    console.log(data)
  };
  const handleSignIn2 = async () => {
    const data = await googleSignInWithPopup()
    console.log(data)
  };

  


  return (
    <button
      className={`flex items-center justify-center h-12 md:h-11 rounded-xl transition-all duration-200 bg-red-50 hover:bg-red-100 border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow group`}
      onClick={handleSignIn2}
    >
      <img
        src={GoogleIcon}
        alt={"provider-google"}
        className="w-7 h-7 group-hover:scale-110 transition-transform duration-200"
      />
    </button>
  );
};

export default GoogleAuhtButton;
