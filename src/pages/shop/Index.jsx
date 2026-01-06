import { SearchBar } from "@/components/SearchBar";
import { PopularShops } from "../../components/PopularShops";
import { ArrowRight, Store, ShoppingBag, Users2, StarIcon, TrendingUp, Heart, ShieldCheck, Zap, MessageCircle, Clock, BadgeCheck } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="container px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-6 relative">
          <div className="absolute inset-0 -top-24 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent blur-3xl" />
          
          <div className="relative space-y-4 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-card/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-foreground shadow-sm border border-border">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <TrendingUp className="w-4 h-4" />
              +2000 nouvelles boutiques ce mois
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
              Découvrez des{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                boutiques uniques
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Explorez notre réseau de boutiques en ligne et trouvez des produits exceptionnels
              créés par des passionnés
            </p>
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
              className="bg-card/50 backdrop-blur-sm p-6 rounded-lg border border-border group hover:bg-card hover:shadow-md hover:border-primary/20 transition-all duration-300"
            >
              <stat.icon className="w-6 h-6 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform duration-300" />
              <div className="text-2xl md:text-3xl font-bold text-foreground group-hover:scale-110 transition-transform duration-300">
                {stat.number}
              </div>
              <div className="text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Section Caractéristiques */}
        <div className="mb-16">
          <h2 className="text-3xl text-center text-foreground mb-12 font-semibold">
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
                className="bg-card/30 backdrop-blur-sm p-6 rounded-lg border border-border hover:bg-card hover:shadow-md hover:border-primary/20 transition-all duration-300"
              >
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl text-foreground mb-2 font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bannière des boutiques tendances */}
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-8 mb-16 border border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div>
              <h2 className="text-3xl text-foreground mb-2 font-semibold">Boutiques tendances</h2>
              <p className="text-muted-foreground">Découvrez les boutiques qui font sensation</p>
            </div>
            <div className="flex gap-2">
              <div className="flex -space-x-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-card border-2 border-background ring-2 ring-primary/10" />
                ))}
              </div>
              <span className="text-sm font-medium text-muted-foreground ml-2">+1.2k cette semaine</span>
            </div>
          </div>
        </div>

        {/* Section de recherche avec titre */}
        <div className="mb-16 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <div className="text-center mb-8">
            <h2 className="text-3xl text-foreground mb-2 font-semibold">
              Trouvez votre prochaine boutique préférée
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
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
