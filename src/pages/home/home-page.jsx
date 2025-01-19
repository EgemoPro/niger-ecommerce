import NavBare from "../../components/NavBare";
import { motion } from "framer-motion";
import { Facebook, Linkedin, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import Baniere from "../../assets/Baniere.png";
import { useDispatch, useSelector } from "react-redux";
import { FadeText } from "@/components/ui/fade-text";
import { useEffect } from "react";
import { fetchInitialData } from "../../redux/Slices/initialData";

const compagnies = [
  { name: "Entreprise A", logo: "https://placehold.co/600x400" },
  { name: "Entreprise B", logo: "https://placehold.co/600x400" },
  { name: "Entreprise C", logo: "https://placehold.co/600x400" },
  { name: "Entreprise D", logo: "https://placehold.co/600x400" },
  { name: "Entreprise E", logo: "https://placehold.co/600x400" },
];

const Home = () => {
  const dispatch = useDispatch()
  const {data, status, error} = useSelector((state) => state.data);
  // console.log(data);
  useEffect(()=>{
    dispatch(fetchInitialData())
  },[dispatch])

  return (
    <div
      className="min-h-screen flex justify-between flex-col bg-gradient-to-b "
      style={{
        backgroundImage: `url(${Baniere})`,
        backgroundSize: "cover",
        backgroundOrigin: "border-box",
        backgroundPosition: "20px -20px",
      }}
    >
      {/* Navbar, vous pouvez le supprimer si vous n'en avez pas besoin */}
      <NavBare data={data} />

      <main className="container transform translate-y-1/4  mt-10 mx-auto px-4 py-8 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-3xl sm:text-5xl font-bold mb-4 text-blue-800">
            <div className="flex flex-row justify-center gap-1 w-full">
              <FadeText
                direction="up"
                framerProps={{
                  show: { transition: { delay: 0.9 } },
                }}
                text="Achats rapides"
                className="max-md:text-[1.7rem]"
              />
              <FadeText
                direction="up"
                framerProps={{
                  show: { transition: { delay: 1.2 } },
                }}
                text="simplifiés"
                className="text-blue-600 max-md:text-[1.7rem]"
              />
            </div>
            {" "}
            
            <FadeText
              framerProps={{
                show: { transition: { delay: 1.3 } },
              }}
              text="pour les acheteurs en ligne."
            />
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 mb-6 sm:mb-8">
            La plupart des boutiques en ligne sont compliquées. Nous rendons
            <FadeText text="l'achat simple et rapide." />
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 w-full sm:w-auto transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
            >
              <Link to="/product" className="h-full w-auto">
                Commencer les achats
              </Link>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 w-full sm:w-auto transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
            >
              Regarder la démo
            </motion.button>
          </div>
        </motion.div>
      </main>

      <footer className="bg-white mt-8 sm:mt-16 py-6 sm:py-8">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-600 font-semibold">
            Fait confiance par ces entreprises
          </p>
          <div className="flex flex-wrap justify-center space-x-4 sm:space-x-8 mt-4">
            {compagnies.map((company, index) => (
              <motion.div
                key={index}
                className="text-gray-500 mb-2 sm:mb-0 font-medium"
                whileHover={{ scale: 1.1, color: "#3B82F6" }}
              >
                {company.name}
              </motion.div>
            ))}
          </div>
          <div className="flex justify-center space-x-4 mt-6">
            <motion.div whileHover={{ scale: 1.2 }}>
              <Facebook className="w-6 h-6 text-blue-400 hover:text-blue-600 cursor-pointer" />
            </motion.div>
            <motion.div whileHover={{ scale: 1.2 }}>
              <Linkedin className="w-6 h-6 text-blue-400 hover:text-blue-600 cursor-pointer" />
            </motion.div>
            <motion.div whileHover={{ scale: 1.2 }}>
              <Instagram className="w-6 h-6 text-pink-400 hover:text-pink-600 cursor-pointer" />
            </motion.div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
