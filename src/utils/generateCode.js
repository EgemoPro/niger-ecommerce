import { nanoid } from 'nanoid';

// Fonction pour générer le format personnalisé
const generateCode = () => {
  // Nanoid génère une chaîne de caractères unique (longueur 20 dans cet exemple)
  const randomString = nanoid(20).toUpperCase();

  // On découpe la chaîne pour obtenir le format CDE5-FGHI-JKLM-NOPQ-RSTU-VWXY
  const formattedCode = `${randomString.slice(0, 4)}-${randomString.slice(4, 8)}-${randomString.slice(8, 12)}-${randomString.slice(12, 16)}-${randomString.slice(16, 20)}`;
  
  return formattedCode;
};



export default generateCode;
