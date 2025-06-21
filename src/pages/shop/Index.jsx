import { SearchBar } from "@/components/SearchBar";
import { PopularShops } from "../../components/PopularShops";
import { ArrowRight, Store, ShoppingBag, Users2, StarIcon, TrendingUp, Heart, ShieldCheck, Zap, MessageCircle, Clock, BadgeCheck } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-accent to-white">
      <main className="container px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-6 relative">
          <div className="absolute inset-0 -top-24 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent blur-3xl" />
          
          <div className="relative space-y-4 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-secondary-foreground shadow-sm">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <TrendingUp className="w-4 h-4" />
              +2000 nouvelles boutiques ce mois
            </div>
            
            <h1 className="text-display-2 md:text-display-1 font-bold text-secondary-foreground mb-4 tracking-tight">
              Découvrez des{" "}
              <span className="text-gradient bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                boutiques uniques
              </span>
            </h1>
            
            <p className="text-body-large text-secondary/80 max-w-2xl mx-auto leading-relaxed">
              Explorez notre réseau de boutiques en ligne et trouvez des produits exceptionnels
              créés par des passionnés
            </p>

            {/* <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-8">
              <button className="group bg-secondary-foreground text-white px-6 py-3 rounded-full font-medium hover:bg-secondary-foreground/90 transition-all duration-300 hover:scale-105">
                <Store className="inline-block w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
                Créer ma boutique
                <ArrowRight className="inline-block ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button className="text-secondary-foreground hover:text-primary transition-colors flex items-center">
                En savoir plus 
                <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div> */}
          </div>
        </div>

        {/* Bannière de statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          {[
            { number: "1,000+", label: "Boutiques", icon: Store },
            { number: "50,000+", label: "Produits", icon: ShoppingBag },
            { number: "100k+", label: "Clients", icon: Users2 },
            { number: "4.8/5", label: "Note moyenne", icon: StarIcon },
          ].map((stat, index) => (
            <div 
              key={index}
              className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl text-center group hover:bg-white hover:shadow-lg transition-all duration-300"
            >
              <stat.icon className="w-6 h-6 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform duration-300" />
              <div className="text-2xl md:text-3xl font-bold text-secondary-foreground group-hover:scale-110 transition-transform duration-300">
                {stat.number}
              </div>
              <div className="text-secondary mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Section Caractéristiques */}
        <div className="mb-16">
          <h2 className="text-heading-2 text-center text-secondary-foreground mb-12">
            Pourquoi choisir notre plateforme ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Mise en route rapide",
                description: "Créez votre boutique en quelques minutes et commencez à vendre immédiatement"
              },
              {
                icon: ShieldCheck,
                title: "Paiements sécurisés",
                description: "Transactions sécurisées et protection des données garantie"
              },
              {
                icon: MessageCircle,
                title: "Support réactif",
                description: "Une équipe dédiée pour vous accompagner à chaque étape"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-white/30 backdrop-blur-sm p-6 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300"
              >
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-heading-3 text-secondary-foreground mb-2">{feature.title}</h3>
                <p className="text-body text-secondary">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bannière des boutiques tendances */}
        <div className="bg-gradient-to-r from-primary/5 to-purple-50 rounded-3xl p-8 mb-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div>
              <h2 className="text-heading-2 text-secondary-foreground mb-2">Boutiques tendances</h2>
              <p className="text-body text-secondary">Découvrez les boutiques qui font sensation</p>
            </div>
            <div className="flex gap-2">
              <div className="flex -space-x-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-white/80 border-2 border-white ring-2 ring-primary/10" />
                ))}
              </div>
              <span className="text-small font-medium text-secondary ml-2">+1.2k cette semaine</span>
            </div>
          </div>
        </div>

        {/* Section de recherche avec titre */}
        <div className="mb-16 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <div className="text-center mb-8">
            <h2 className="text-heading-2 text-secondary-foreground mb-2">
              Trouvez votre prochaine boutique préférée
            </h2>
            <p className="text-body text-secondary max-w-2xl mx-auto">
              Utilisez notre moteur de recherche intelligent pour découvrir des boutiques qui correspondent à vos centres d'intérêt
            </p>
          </div>
          <SearchBar />
        </div>

        {/* Section des boutiques populaires avec contexte */}
        <div className="animate-fade-in" style={{ animationDelay: "0.6s" }}>
          <PopularShops 
            title="Boutiques populaires" 
            subtitle="Une sélection de nos meilleures boutiques" 
            viewAllLink="/shops" 
            viewAllText="Voir plus" 
          />
        </div>

        
      </main>
    </div>
  );
};

export default Index;
