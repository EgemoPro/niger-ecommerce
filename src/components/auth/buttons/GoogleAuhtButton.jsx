import { auth } from "../../../lib/firebase";
import {
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
// import { useDispatch } from "react-redux";
import GoogleIcon from "../../../assets/google-color-svgrepo-com.svg";
import { useEffect } from "react";

export const signInWithGoogleRedirect = async () => {
    const provider = new GoogleAuthProvider();
  try {
    // Redirige l'utilisateur pour l'authentification
    await signInWithRedirect(auth, provider);
  } catch (error) {
    console.error("Erreur lors de la redirection :", error.message);
    throw error;
  }
};

// Récupère les résultats de la redirection après connexion
export const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      const user = result.user;
      console.log("Utilisateur connecté :", user);
      return user; // Retourne l'utilisateur connecté
    }
    return null; // Aucun utilisateur connecté
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des résultats de redirection :",
      error.message
    );
    throw error;
  }
};


const GoogleAuhtButton = () => {
  useEffect(()=>{
    const fetchRedirectResult = async () => {
        try {
          const user = await handleRedirectResult();
          if (user) {
            console.log("Utilisateur connecté via redirection :", user.displayName);
            // Ajouter une logique supplémentaire ici si nécessaire
          }
        } catch (error) {
          console.error("Erreur après la redirection :", error.message);
        }
      };
      fetchRedirectResult();
  }, [])

  const handleSignIn = () => {
    signInWithGoogleRedirect();
  };

  return (
    <button
      className={`flex items-center justify-center h-12 md:h-11 rounded-xl transition-all duration-200 bg-red-50 hover:bg-red-100 border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow group`}
      onClick={handleSignIn}
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
