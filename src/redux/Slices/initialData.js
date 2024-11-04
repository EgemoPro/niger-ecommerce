import { createSlice } from "@reduxjs/toolkit";



const initialState = [
  {
    id: "#46647",
    title: "Chaise Blanche Élégante Ice",
    description:
      "Chaise moderne et élégante avec une finition blanche impeccable",
    rating: 3.0,
    reviews: 400,
    price: 789.99,
    originalPrice: 1200.5,
    discount: 34,
    images: [
      "https://picsum.photos/600/400?random=1",
      "https://picsum.photos/600/400?random=2",
      "https://picsum.photos/600/400?random=3",
      "https://picsum.photos/600/400?random=4",
    ],
    category: "Chair",
    customer: "Arlene McCoy",
    status: "Not started",
    quantity: 45,
    location: "Salem (OR)",
    date: "12 Feb 2024",
    total: "$56.99",
    colors: ["#FFFFFF", "#F0F0F0", "#E0E0E0"],
    sizes: [
      { id: 1, name: "Small", dimensions: "45x45x90cm" },
      { id: 2, name: "Medium", dimensions: "50x50x95cm" },
      { id: 3, name: "Large", dimensions: "55x55x100cm" }
    ]
  },
  {
    id: "#46648",
    title: "Ensemble de Salon Luxueux Noir",
    description:
      "Ensemble complet comprenant une chaise élégante noire et un canapé assorti",
    rating: 4.5,
    reviews: 320,
    price: 1299.99,
    originalPrice: 1500.0,
    discount: 13,
    images: [
      "https://picsum.photos/600/400?random=5",
      "https://picsum.photos/600/400?random=6",
    ],
    category: "Living Room Set",
    customer: "John Doe",
    status: "In progress",
    quantity: 30,
    location: "Portland (ME)",
    date: "15 Mar 2024",
    total: "$89.99",
    colors: ["#000000", "#1A1A1A", "#333333"],
    sizes: [
      { id: 1, name: "Small", dimensions: "160x90x85cm" },
      { id: 2, name: "Medium", dimensions: "200x90x85cm" },
      { id: 3, name: "Large", dimensions: "240x90x85cm" }
    ]
  },  
  {
    id: "#46649",
    title: "Canapé Sombre Moelleux",
    description:
      "Canapé confortable et accueillant avec un rembourrage riche et foncé",
    rating: 4.8,
    reviews: 550,
    price: 549.5,
    originalPrice: 799.99,
    discount: 31,
    images: [
      "https://picsum.photos/600/400?random=7",
      "https://picsum.photos/600/400?random=8",
      "https://picsum.photos/600/400?random=9",
      "https://picsum.photos/600/400?random=10",
    ],
    category: "Sofa",
    customer: "Emma Watson",
    status: "Completed",
    quantity: 20,
    location: "Austin (TX)",
    date: "5 Apr 2024",
    total: "$129.99",
    colors: ["#4A4A4A", "#3A3A3A", "#2A2A2A"],
    sizes: [
      { id: 1, name: "Small", dimensions: "160x90x85cm" },
      { id: 2, name: "Medium", dimensions: "200x90x85cm" },
      { id: 3, name: "Large", dimensions: "240x90x85cm" }
    ]
  },
  {
    id: "#46650",
    title: "Chaise Enfant Orange Vibrante",
    description:
      "Chaise amusante et colorée parfaite pour les chambres d'enfants",
    rating: 4.2,
    reviews: 180,
    price: 89.99,
    originalPrice: 129.99,
    discount: 31,
    images: [
      "https://picsum.photos/600/400?random=11",
      "https://picsum.photos/600/400?random=12",
    ],
    category: "Kids Furniture",
    customer: "Michael Brown",
    status: "Pending",
    quantity: 60,
    location: "Miami (FL)",
    date: "20 May 2024",
    total: "$39.99",
    colors: ["#FFA500", "#FF8C00", "#FF7F50"],
    sizes: [
      { id: 1, name: "Small", dimensions: "45x45x90cm" },
      { id: 2, name: "Medium", dimensions: "50x50x95cm" },
      { id: 3, name: "Large", dimensions: "55x55x100cm" }
    ]
  },  
  {
    id: "#46651",
    title: "Canapé Orange Confortable",
    description: "Canapé chaleureux et accueillant avec une teinte orange vive",
    rating: 4.7,
    reviews: 420,
    price: 899.99,
    originalPrice: 1199.99,
    discount: 25,
    images: [
      "https://picsum.photos/600/400?random=13",
      "https://picsum.photos/600/400?random=14",
    ],
    category: "Sofa",
    customer: "Sarah Johnson",
    status: "Shipped",
    quantity: 15,
    location: "Chicago (IL)",
    date: "8 Jun 2024",
    total: "$159.99",
    colors: ["#FFA500", "#FF8C00", "#FF7F50"],
    sizes: [
      { id: 1, name: "Small", dimensions: "160x90x85cm" },
      { id: 2, name: "Medium", dimensions: "200x90x85cm" },
      { id: 3, name: "Large", dimensions: "240x90x85cm" }
    ]
  },
  {
    id: "#46652",
    title: "Chaise Jaune Ludique",
    description: "Chaise joyeuse avec un design unique de Chaton Banane",
    rating: 4.9,
    reviews: 300,
    price: 249.99,
    originalPrice: 349.99,
    discount: 29,
    images: [
      "https://picsum.photos/600/400?random=15",
      "https://picsum.photos/600/400?random=16",
    ],
    category: "Chair",
    customer: "David Lee",
    status: "Processing",
    quantity: 1,
    location: "Seattle (WA)",
    date: "17 Jul 2024",
    total: "$79.99",
    colors: ["#FFFF00", "#FFD700", "#FFA500"],
    sizes: [
      { id: 1, name: "Small", dimensions: "45x45x90cm" },
      { id: 2, name: "Medium", dimensions: "50x50x95cm" },
      { id: 3, name: "Large", dimensions: "55x55x100cm" }
    ]
  },
  {
    id: "#46653",
    title: "Ensemble de Bureau Professionnel Noir",
    description:
      "Combinaison élégante de bureau et chaise pour un espace de travail moderne",
    rating: 4.6,
    reviews: 280,
    price: 1099.99,
    originalPrice: 1399.99,
    discount: 21,
    images: [
      "https://picsum.photos/600/400?random=17",
      "https://picsum.photos/600/400?random=18",
    ],
    category: "Office Furniture",
    customer: "Emily Davis",
    status: "Delivered",
    quantity: 25,
    location: "Denver (CO)",
    date: "3 Aug 2024",
    total: "$199.99",
    colors: ["#000000", "#1A1A1A", "#333333"],
    sizes: [
      { id: 1, name: "Small", dimensions: "120x60x75cm" },
      { id: 2, name: "Medium", dimensions: "140x70x75cm" },
      { id: 3, name: "Large", dimensions: "160x80x75cm" }
    ]
  }, 
  {
    id: "#46654",
    title: "Armoire Verte Polyvalente",
    description:
      "Solution de rangement élégante avec une finition verte rafraîchissante",
    rating: 4.3,
    reviews: 350,
    price: 399.99,
    originalPrice: 599.99,
    discount: 33,
    images: [
      "https://picsum.photos/600/400?random=19",
      "https://picsum.photos/600/400?random=20",
    ],
    category: "Storage",
    customer: "Robert Wilson",
    status: "Backordered",
    quantity: 35,
    location: "Boston (MA)",
    date: "22 Sep 2024",
    total: "$109.99",
    colors: ["#008000", "#006400", "#228B22"],
    sizes: [
      { id: 1, name: "Small", dimensions: "80x40x180cm" },
      { id: 2, name: "Medium", dimensions: "100x50x200cm" },
      { id: 3, name: "Large", dimensions: "120x60x220cm" }
    ]
  },
  {
    id: "#46655",
    title: "Lampe de Table Moderne",
    description: "Lampe élégante avec un design minimaliste pour votre bureau",
    rating: 4.5,
    reviews: 180,
    price: 79.99,
    originalPrice: 99.99,
    discount: 20,
    images: [
      "https://picsum.photos/600/400?random=21",
      "https://picsum.photos/600/400?random=22",
    ],
    category: "Lighting",
    customer: "Sophie Martin",
    status: "Shipped",
    quantity: 50,
    location: "San Francisco (CA)",
    date: "10 Oct 2024",
    total: "$79.99",
    colors: ["#FFFFFF", "#F5F5F5", "#DCDCDC"],
    sizes: [
      { id: 1, name: "Small", dimensions: "20x20x35cm" },
      { id: 2, name: "Medium", dimensions: "25x25x45cm" },
      { id: 3, name: "Large", dimensions: "30x30x55cm" }
    ]
  },
  {
    id: "#46656",
    title: "Tapis Moelleux Gris",
    description: "Tapis doux et confortable pour votre salon ou chambre",
    rating: 4.8,
    reviews: 220,
    price: 149.99,
    originalPrice: 199.99,
    discount: 25,
    images: [
      "https://picsum.photos/600/400?random=23",
      "https://picsum.photos/600/400?random=24",
    ],
    category: "Rugs",
    customer: "Michael Brown",
    status: "Processing",
    quantity: 30,
    location: "New York (NY)",
    date: "15 Nov 2024",
    total: "$149.99",
    colors: ["#808080", "#A9A9A9", "#D3D3D3"],
    sizes: [
      { id: 1, name: "Small", dimensions: "120x180cm" },
      { id: 2, name: "Medium", dimensions: "160x230cm" },
      { id: 3, name: "Large", dimensions: "200x290cm" }
    ]
  },
  {
    id: "#46657",
    title: "Bibliothèque en Bois Rustique",
    description:
      "Bibliothèque spacieuse avec un charme rustique pour vos livres",
    rating: 4.7,
    reviews: 190,
    price: 299.99,
    originalPrice: 399.99,
    discount: 25,
    images: [
      "https://picsum.photos/600/400?random=25",
      "https://picsum.photos/600/400?random=26",
    ],
    category: "Storage",
    customer: "Emma Thompson",
    status: "Delivered",
    quantity: 20,
    location: "Austin (TX)",
    date: "5 Dec 2024",
    total: "$299.99",
    colors: ["#8B4513", "#A0522D", "#CD853F"],
    sizes: [
      { id: 1, name: "Small", dimensions: "80x30x180cm" },
      { id: 2, name: "Medium", dimensions: "100x35x200cm" },
      { id: 3, name: "Large", dimensions: "120x40x220cm" }
    ]
  },
  {
    id: "#46658",
    title: "Fauteuil Scandinave Bleu",
    description: "Fauteuil confortable avec un design scandinave épuré",
    rating: 4.6,
    reviews: 210,
    price: 249.99,
    originalPrice: 329.99,
    discount: 24,
    images: [
      "https://picsum.photos/600/400?random=27",
      "https://picsum.photos/600/400?random=28",
    ],
    category: "Chair",
    customer: "Lucas Dupont",
    status: "Shipped",
    quantity: 40,
    location: "Portland (OR)",
    date: "20 Jan 2025",
    total: "$249.99",
    colors: ["#4169E1", "#1E90FF", "#87CEEB"],
    sizes: [
      { id: 1, name: "Small", dimensions: "60x65x85cm" },
      { id: 2, name: "Medium", dimensions: "65x70x90cm" },
      { id: 3, name: "Large", dimensions: "70x75x95cm" }
    ]
  },
  {
    id: "#46659",
    title: "Table Basse en Marbre",
    description: "Table basse élégante avec plateau en marbre et pieds dorés",
    rating: 4.9,
    reviews: 150,
    price: 399.99,
    originalPrice: 499.99,
    discount: 20,
    images: [
      "https://picsum.photos/600/400?random=29",
      "https://picsum.photos/600/400?random=30",
    ],
    category: "Table",
    customer: "Olivia Garcia",
    status: "Processing",
    quantity: 15,
    location: "Miami (FL)",
    date: "8 Feb 2025",
    total: "$399.99",
    colors: ["#FFFFFF", "#FFD700", "#B8860B"],
    sizes: [
      { id: 1, name: "Small", dimensions: "80x50x45cm" },
      { id: 2, name: "Medium", dimensions: "100x60x45cm" },
      { id: 3, name: "Large", dimensions: "120x70x45cm" }
    ]
  },
  {
    id: "#46660",
    title: "Chandelier en Cristal Luxueux",
    description:
      "Magnifique chandelier en cristal pour une ambiance somptueuse",
    rating: 4.9,
    reviews: 80,
    price: 12999.99,
    originalPrice: 15999.99,
    discount: 19,
    images: [
      "https://picsum.photos/600/400?random=31",
      "https://picsum.photos/600/400?random=32",
    ],
    category: "Lighting",
    customer: "Sophie Laurent",
    status: "Delivered",
    quantity: 5,
    location: "Paris (FR)",
    date: "15 Mar 2025",
    total: "$12999.99",
    colors: ["#FFD700", "#FFFAFA", "#E6E6FA"],
    sizes: [
      { id: 1, name: "Small", dimensions: "50x50x60cm" },
      { id: 2, name: "Medium", dimensions: "70x70x80cm" },
      { id: 3, name: "Large", dimensions: "90x90x100cm" }
    ]
  },
  {
    id: "#46661",
    title: "Canapé en Cuir Italien",
    description:
      "Canapé haut de gamme en cuir italien avec finitions luxueuses",
    rating: 4.8,
    reviews: 95,
    price: 8499.99,
    originalPrice: 9999.99,
    discount: 15,
    images: [
      "https://picsum.photos/600/400?random=33",
      "https://picsum.photos/600/400?random=34",
    ],
    category: "Sofa",
    customer: "Alexandre Dubois",
    status: "Shipped",
    quantity: 8,
    location: "Milan (IT)",
    date: "22 Apr 2025",
    total: "$8499.99",
    colors: ["#8B4513", "#A52A2A", "#D2691E"],
    sizes: [
      { id: 1, name: "Small", dimensions: "180x85x90cm" },
      { id: 2, name: "Medium", dimensions: "220x85x90cm" },
      { id: 3, name: "Large", dimensions: "260x85x90cm" }
    ]
  },
  {
    id: "#46662",
    title: "Table de Salle à Manger en Bois Précieux",
    description:
      "Table de salle à manger en bois exotique avec incrustation de nacre",
    rating: 4.7,
    reviews: 60,
    price: 18999.99,
    originalPrice: 22999.99,
    discount: 17,
    images: [
      "https://picsum.photos/600/400?random=35",
      "https://picsum.photos/600/400?random=36",
    ],
    category: "Dining",
    customer: "Isabella Rossi",
    status: "Processing",
    quantity: 3,
    location: "Rome (IT)",
    date: "10 May 2025",
    total: "$18999.99",
    colors: ["#8B4513", "#D2691E", "#CD853F"],
    sizes: [
      { id: 1, name: "Small", dimensions: "160x90x75cm" },
      { id: 2, name: "Medium", dimensions: "200x100x75cm" },
      { id: 3, name: "Large", dimensions: "240x110x75cm" }
    ]
  },
  {
    id: "#46663",
    title: "Lit à Baldaquin Royal",
    description:
      "Lit à baldaquin somptueux avec des détails dorés et des rideaux en soie",
    rating: 4.9,
    reviews: 40,
    price: 24999.99,
    originalPrice: 29999.99,
    discount: 17,
    images: [
      "https://picsum.photos/600/400?random=37",
      "https://picsum.photos/600/400?random=38",
    ],
    category: "Bedroom",
    customer: "Elizabeth Windsor",
    status: "Shipped",
    quantity: 2,
    location: "London (UK)",
    date: "18 Jun 2025",
    total: "$24999.99",
    colors: ["#FFD700", "#8B0000", "#FFFAFA"],
    sizes: [
      { id: 1, name: "Small", dimensions: "140x190x220cm" },
      { id: 2, name: "Medium", dimensions: "160x200x220cm" },
      { id: 3, name: "Large", dimensions: "180x200x220cm" }
    ]
  },
  {
    id: "#46664",
    title: "Tapis Persan Antique",
    description:
      "Tapis persan fait main avec des motifs complexes et des matériaux précieux",
    rating: 4.8,
    reviews: 55,
    price: 35999.99,
    originalPrice: 39999.99,
    discount: 10,
    images: [
      "https://picsum.photos/600/400?random=39",
      "https://picsum.photos/600/400?random=40",
    ],
    category: "Rugs",
    customer: "Amir Khadem",
    status: "Delivered",
    quantity: 1,
    location: "Dubai (UAE)",
    date: "5 Jul 2025",
    total: "$35999.99",
    colors: ["#8B0000", "#DAA520", "#4B0082"],
    sizes: [
      { id: 1, name: "Small", dimensions: "170x240cm" },
      { id: 2, name: "Medium", dimensions: "200x300cm" },
      { id: 3, name: "Large", dimensions: "250x350cm" }
    ]
  },
  {
    id: "#46665",
    title: "Réfrigérateur Intelligent",
    description:
      "Réfrigérateur connecté avec écran tactile et gestion des aliments",
    rating: 4.7,
    reviews: 120,
    price: 3999.99,
    originalPrice: 4499.99,
    discount: 11,
    images: [
      "https://picsum.photos/600/400?random=41",
      "https://picsum.photos/600/400?random=42",
    ],
    category: "Appliances",
    customer: "Sophie Martin",
    status: "Processing",
    quantity: 3,
    location: "Paris (FR)",
    date: "20 Jul 2025",
    total: "$3999.99",
    colors: ["#C0C0C0", "#FFFFFF", "#000000"],
    sizes: [
      { id: 1, name: "Small", dimensions: "60x65x170cm" },
      { id: 2, name: "Medium", dimensions: "70x70x180cm" },
      { id: 3, name: "Large", dimensions: "90x75x180cm" }
    ]
  },
  {
    id: "#46666",
    title: "Machine à Laver Écologique",
    description:
      "Machine à laver économe en eau et en énergie avec programmes intelligents",
    rating: 4.6,
    reviews: 85,
    price: 1299.99,
    originalPrice: 1499.99,
    discount: 13,
    images: [
      "https://picsum.photos/600/400?random=43",
      "https://picsum.photos/600/400?random=44",
    ],
    category: "Appliances",
    customer: "Jean Dupont",
    status: "Shipped",
    quantity: 5,
    location: "Lyon (FR)",
    date: "2 Aug 2025",
    total: "$1299.99",
    colors: ["#FFFFFF", "#F5F5F5", "#DCDCDC"],
    sizes: [
      { id: 1, name: "Small", dimensions: "60x55x85cm" },
      { id: 2, name: "Medium", dimensions: "60x60x85cm" },
      { id: 3, name: "Large", dimensions: "65x60x85cm" }
    ]
  }];

const initialUpdatedState = () => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `https://fakestoreapi.com/products?limit=${initialState.length}`, false);
  xhr.send();
  
  if (xhr.status === 200) {
    const response = JSON.parse(xhr.responseText);
    for(let i = 0; i < response.length; i++) {
      initialState[i].title = response[i].title;
      initialState[i].originalPrice = response[i].price;
      initialState[i].images = [response[i].image];
      initialState[i].description = response[i].description;
      initialState[i].category = response[i].category;
    }
  }
  return initialState;
}

// console.log(await initialUpdatedState(initialState.length));


const dataSlice = createSlice({
  name: "data",
  initialState:  initialUpdatedState(),
  reducers: {
    setQuantity: function (state, action) {
      state.forEach((product) =>
        product.id == action.payload.id
          ? (product.quantity = action.payload.quantity)
          : product
      );
    },
  },
});

// const { addProduct, delProduct } = backetSlice.actions;

export { dataSlice };
