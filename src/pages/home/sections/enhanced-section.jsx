// "use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Menu,
  ChevronRight,
  Star,
  ArrowRight,
  TrendingUp,
  Truck,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  // LineChart,
  // Line,
  // XAxis,
  // YAxis,
  // CartesianGrid,
  // Tooltip,
  // Legend,
} from "@/components/ui/chart";
import { useSelector } from "react-redux";

const _products = [
  {
    id: 1,
    name: "Montre élégante",
    price: "199,99 €",
    image: "/placeholder.svg?height=200&width=200",
    category: "Montres",
  },
  {
    id: 2,
    name: "Sac en cuir",
    price: "149,99 €",
    image: "/placeholder.svg?height=200&width=200",
    category: "Sacs",
  },
  {
    id: 3,
    name: "Chaussures de sport",
    price: "89,99 €",
    image: "/placeholder.svg?height=200&width=200",
    category: "Chaussures",
  },
  {
    id: 4,
    name: "Lunettes de soleil",
    price: "79,99 €",
    image: "/placeholder.svg?height=200&width=200",
    category: "Accessoires",
  },
  {
    id: 5,
    name: "Bracelet en or",
    price: "299,99 €",
    image: "/placeholder.svg?height=200&width=200",
    category: "Bijoux",
  },
  {
    id: 6,
    name: "Ceinture en cuir",
    price: "59,99 €",
    image: "/placeholder.svg?height=200&width=200",
    category: "Accessoires",
  }
];

const categories = [
  { name: "Montres", image: "/placeholder.svg?height=300&width=300" },
  { name: "Sacs", image: "/placeholder.svg?height=300&width=300" },
  { name: "Chaussures", image: "/placeholder.svg?height=300&width=300" },
  { name: "Accessoires", image: "/placeholder.svg?height=300&width=300" },
  { name: "Bijoux", image: "/placeholder.svg?height=300&width=300" },
];

const testimonials = [
  {
    id: 1,
    name: "Sophie L.",
    comment:
      "J'adore la qualité des produits Élégance. Chaque achat est un vrai plaisir !",
    rating: 5,
  },
  {
    id: 2,
    name: "Thomas M.",
    comment:
      "Le service client est exceptionnel. Ils ont résolu mon problème rapidement et efficacement.",
    rating: 5,
  },
  {
    id: 3,
    name: "Emma R.",
    comment:
      "Les produits sont à la hauteur de mes attentes. Je recommande vivement !",
    rating: 4,
  },
];

const deliveryData = [
  { month: "Jan", speed: 2.4 },
  { month: "Fév", speed: 2.2 },
  { month: "Mar", speed: 2.5 },
  { month: "Avr", speed: 2.3 },
  { month: "Mai", speed: 2.1 },
  { month: "Juin", speed: 2.0 },
];

const salesData = [
  { month: "Jan", sales: 4000 },
  { month: "Fév", sales: 3000 },
  { month: "Mar", sales: 5000 },
  { month: "Avr", sales: 4500 },
  { month: "Mai", sales: 5500 },
  { month: "Juin", sales: 6000 },
];

export default function EnhancedSection() {
  const products = useSelector((state) => state.data);
  // console.log(products);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredProducts =
    selectedCategory === "Tous"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (<div>
      <section className=" relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center z-10"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            Découvrez l'Élégance
          </h2>
          <p className="text-xl mb-8">
            Des produits de luxe pour votre style de vie
          </p>
          <Button size="lg">
            Voir la collection
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
        >
          <img
            src="/placeholder.svg?height=1080&width=1920"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </section>

      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold mb-8 text-center">Nos produits</h3>
          <Tabs defaultValue="Tous" className="mb-8">
            <TabsList className="flex justify-center flex-wrap">
              <TabsTrigger
                value="Tous"
                onClick={() => setSelectedCategory("Tous")}
              >
                Tous
              </TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger
                  key={category.name}
                  value={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                className="bg-card rounded-lg shadow-lg overflow-hidden"
                whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h4 className="font-semibold mb-2">{product.title}</h4>
                  <p className="text-muted-foreground">{product.price}</p>
                  <Badge className="mt-2">{product.category}</Badge>
                  <Button className="mt-4 w-full">Ajouter au panier</Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold mb-8 text-center">
            Explorez nos catégories
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.category}
                className="relative overflow-hidden rounded-lg shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <h4 className="text-white text-2xl font-bold">
                    {product.category}
                  </h4>
                </div>
                <Button
                  variant="secondary"
                  className="absolute bottom-4 right-4"
                >
                  Découvrir
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold mb-8 text-center">
            Nos performances
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Vitesse de livraison moyenne</CardTitle>
                <CardDescription>En jours</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={deliveryData}
                  width={500}
                  height={300}
                  className="w-full"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="speed"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Ventes mensuelles</CardTitle>
                <CardDescription>En euros</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={salesData}
                  width={500}
                  height={300}
                  className="w-full"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#82ca9d"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </CardContent>
            </Card>
          </div>
        </div>
      </section> 
      */}

      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-8">Offre spéciale</h3>
          <p className="text-xl mb-8">
            Profitez de 20% de réduction sur votre première commande !
          </p>
          <Button variant="secondary" size="lg">
            Utiliser le code BIENVENUE20
          </Button>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold mb-8 text-center">
            Ce que disent nos clients
          </h3>
          <Carousel className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
            <CarouselContent>
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id}>
                  <div className="p-4">
                    <div className="bg-card rounded-lg shadow-lg p-6 text-center">
                      <p className="mb-4">&quot;{testimonial.comment}&quot;</p>
                      <p className="font-semibold">{testimonial.name}</p>
                      <div className="flex justify-center mt-2">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-5 w-5 text-yellow-400 fill-current"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-8">Restez informé</h3>
          <p className="mb-8 text-muted-foreground">
            Inscrivez-vous à notre newsletter pour recevoir les dernières
            nouvelles et offres exclusives.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Votre adresse e-mail"
              className="flex-grow"
            />
            <Button type="submit">S'inscrire</Button>
          </form>
        </div>
      </section>
    </div>
  );
}
