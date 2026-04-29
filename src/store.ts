import { reactive } from "vue";

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  sizes: string[];
  colors: string[];
  isNew?: boolean;
  featured?: boolean;
}

export const products = [
  {
    id: 1,
    name: "Essential Oversized Tee",
    category: "T-Shirt",
    price: 3500.00,
    originalPrice: 8500.0,
    rating: 5.0,
    reviews: 1240,
    image: "/images/products/tshirt.png",
    description:
      "The foundation of the modern wardrobe. Our Essential Oversized Tee is crafted from 400GSM heavy-weight organic cotton, offering a structured silhouette that maintains its form. Features dropped shoulders and a meticulous charcoal wash unique to Black 12.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["#F5F5F5", "#1A1A1A", "#717171"],
    isNew: true,
    featured: true,
  },
  {
    id: 2,
    name: "Linen Drape Dress",
    category: "Dress",
    price: 4500.00,
    originalPrice: 12000.99,
    rating: 5.0,
    reviews: 7932,
    image: "/images/products/dress.png",
    description:
      "A study in minimalist elegance. This Linen Drape Dress features a fluid, architectural silhouette designed for effortless movement. Breathable, ethically sourced linen combined with a subtle sand palette makes it a versatile piece for high-luxury lounging.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["#F5F5F5", "#717171", "#1A1A1A"],
    isNew: true,
    featured: true,
  },
  {
    id: 3,
    name: "Monolith Tailored Blazer",
    category: "Jacket",
    price: 8500.0,
    originalPrice: 25000.0,
    rating: 4.9,
    reviews: 842,
    image: "/images/products/blazer.png",
    description:
      "Precision engineering meets timeless style. The Monolith Blazer is constructed with sharp lines and reinforced shoulders for a powerful presence. Fully lined with vegan silk and finished with signature Black 12 matte buttons.",
    sizes: ["M", "L", "XL"],
    colors: ["#1A1A1A"],
    isNew: false,
    featured: true,
  },
  {
    id: 4,
    name: "Grain Texture Sweater",
    category: "Knitwear",
    price: 2500.0,
    originalPrice: 15000.0,
    rating: 4.8,
    reviews: 320,
    image: "/images/products/sweater.png",
    description:
      "Sophistication in every stitch. This heavy-gauge knit sweater features a unique grain texture that provides depth and character. Soft to the touch yet durable enough for the coldest city winters.",
    sizes: ["S", "M", "L"],
    colors: ["#F5F5F5", "#E5E5E5"],
    isNew: false,
  },
  {
    id: 5,
    name: "Nomad Camel Coat",
    category: "Jacket",
    price: 12000.0,
    originalPrice: 45000.0,
    rating: 5.0,
    reviews: 156,
    image: "/images/products/coat.png",
    description:
      "The ultimate investment piece. Our Nomad Coat is hand-finished from a premium wool-camel blend, offering unparalleled warmth and a luxuriously soft hand-feel. A long, relaxed cut designed for layering over our tailored staples.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["#D2B48C", "#1A1A1A"],
    isNew: true,
  },
  {
    id: 6,
    name: "Raw Indigo Denim",
    category: "Jacket",
    price: 5500.0,
    originalPrice: 18000.0,
    rating: 4.7,
    reviews: 512,
    image: "/images/products/jacket.png",
    description:
      "A tribute to heritage denim. This jacket is crafted from raw indigo selvedge denim that will develop a unique patina over time. A rugged addition to the Black 12 collection, balancing raw aesthetics with refined construction.",
    sizes: ["S", "M", "L"],
    colors: ["#4682B4", "#1A1A1A"],
    isNew: false,
  },
  {
    id: 7,
    name: "Junior Urban Joggers",
    category: "Children",
    price: 1500.0,
    originalPrice: 5000.0,
    rating: 4.9,
    reviews: 88,
    image: "/images/products/joggers.png",
    description: "Premium cotton joggers for the little ones. Durable, stylish, and comfortable for all-day play.",
    sizes: ["2Y", "4Y", "6Y"],
    colors: ["#1A1A1A", "#717171"],
    isNew: true,
  },
  {
    id: 8,
    name: "Vintage Silk Scarf",
    category: "Accessories",
    price: 1000.0,
    originalPrice: 4500.0,
    rating: 4.8,
    reviews: 245,
    image: "/images/products/scarf.png",
    description: "Authentic vintage silk scarf. A touch of classic luxury to complete any outfit.",
    sizes: ["One Size"],
    colors: ["#E5E5E5", "#D2B48C"],
    isNew: false,
  }
];

export const store = reactive({
  cart: [] as {
    product: Product;
    quantity: number;
    size: string;
    color: string;
  }[],
  activeCategory: "All Items",
  searchQuery: "",
  favorites: [] as number[],
  currentProfileTab: null as string | null,
  userPreferences: {
    pushNotifications: true,
    emailMarketing: false,
  },

  addToCart(product: Product, quantity: number, size: string, color: string) {
    const existing = this.cart.find(
      (item) =>
        item.product.id === product.id &&
        item.size === size &&
        item.color === color,
    );
    if (existing) {
      // existing.quantity += quantity
    } else {
      this.cart.push({ product, quantity, size, color });
    }
  },

  reorderAllItems(
    cartItems: {
      product: Product;
      quantity: number;
      size: string;
      color: string;
    }[],
  ) {
    this.cart = [...cartItems];
  },

  removeFromCart(index: number) {
    this.cart.splice(index, 1);
  },

  toggleFavorite(productId: number) {
    const index = this.favorites.indexOf(productId);
    if (index === -1) {
      this.favorites.push(productId);
    } else {
      this.favorites.splice(index, 1);
    }
  },
});
