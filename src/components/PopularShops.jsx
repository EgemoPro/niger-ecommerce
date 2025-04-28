
import { ArrowRight } from "lucide-react";
import { ShopCard } from "../components/shop/ShopCard";

export const popularShops = [
  {
    id: "shop1",
    name: "Boutique Mode",
    description: "Les dernières tendances à prix mini",
    products: 120,
    banner: "https://images.unsplash.com/photo-1500673922987-e212871fec22",
    popularProducts: [
      {
        id: "p1",
        image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105",
        name: "Robe d'été",
      },
      {
        id: "p2",
        image: "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7",
        name: "Ensemble casual",
      },
      {
        id: "p3",
        image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa",
        name: "Sneakers",
      },
    ],
  },
  {
    id: "shop2",
    name: "Tech Store",
    description: "Tout pour les passionnés de technologie",
    products: 85,
    banner: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    popularProducts: [
      {
        id: "p4",
        image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12",
        name: "Smart Watch",
      },
      {
        id: "p5",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
        name: "Casque Audio",
      },
      {
        id: "p6",
        image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45",
        name: "Laptop",
      },
    ],
  },
  {
    id: "shop3",
    name: "Déco & Co",
    description: "Donnez vie à votre intérieur",
    products: 200,
    banner: "https://images.unsplash.com/photo-1527576539890-dfa815648363",
    popularProducts: [
      {
        id: "p7",
        image: "https://images.unsplash.com/photo-1592078615290-033ee584e267",
        name: "Lampe design",
      },
      {
        id: "p8",
        image: "https://images.unsplash.com/photo-1540638349517-3abd5afc5847",
        name: "Coussin déco",
      },
      {
        id: "p9",
        image: "https://images.unsplash.com/photo-1517705008128-361805f42e86",
        name: "Vase moderne",
      },
    ],
  },
];


export const PopularShops = ({
  shops = popularShops,
  title = "Boutiques populaires",
  subtitle,
  viewAllLink,
  viewAllText = "Voir plus",
}) => {
  return (
    <div className="w-full max-w-6xl mx-auto mt-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-secondary-foreground">
            {title}
          </h2>
          {subtitle && <p className="text-body text-secondary">{subtitle}</p>}
        </div>
        {viewAllLink && (
          <a
            href={viewAllLink}
            className="text-primary hover:text-primary/80 transition-colors flex items-center gap-2"
          >
            {viewAllText} <ArrowRight className="w-4 h-4" />
          </a>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shops.map((shop, index) => (
          <ShopCard key={shop.id} shop={shop} index={index} />
        ))}
      </div>
    </div>
  );
};
