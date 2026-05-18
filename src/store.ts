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
  stock?: number;
}

export interface Order {
  id: string;
  customerId: number;
  customerName: string;
  items: { productId: number; quantity: number; price: number }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  paymentStatus: 'paid' | 'pending' | 'failed';
  phoneNumber: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'inactive';
  joinedDate: string;
  avatar: string;
  phoneNumber: string;
}

export interface Payment {
  id: string;
  orderId: string;
  customerId: number;
  customerName: string;
  amount: number;
  status: 'successful' | 'pending' | 'failed' | 'refunded';
  method: 'Card' | 'Transfer' | 'USSD';
  date: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'payment' | 'refund' | 'system' | 'customer';
  status: 'unread' | 'read';
  date: string;
  link?: string;
}

export const products = reactive<Product[]>([
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
    stock: 45,
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
    stock: 22,
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
    stock: 12,
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
    stock: 31,
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
    stock: 8,
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
    stock: 15,
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
    stock: 50,
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
    stock: 100,
  }
]);

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

  // Admin Data
  orders: [
    {
      id: "ORD-7721",
      customerId: 1,
      customerName: "Albert Stevano",
      items: [{ productId: 1, quantity: 1, price: 3500.00 }],
      total: 3500.00,
      status: 'processing',
      date: '2024-04-28',
      paymentStatus: 'paid',
      phoneNumber: '+234 812 345 6789'
    },
    {
      id: "ORD-7722",
      customerId: 2,
      customerName: "Sarah Jenkins",
      items: [{ productId: 2, quantity: 1, price: 4500.00 }],
      total: 4500.00,
      status: 'delivered',
      date: '2024-04-25',
      paymentStatus: 'paid',
      phoneNumber: '+234 901 234 5678'
    },
    {
      id: "ORD-7723",
      customerId: 3,
      customerName: "Michael Chen",
      items: [{ productId: 5, quantity: 1, price: 12000.00 }],
      total: 12000.00,
      status: 'pending',
      date: '2024-04-29',
      paymentStatus: 'pending',
      phoneNumber: '+234 703 456 7890'
    }
  ] as Order[],

  customers: [
    {
      id: 1,
      name: "Albert Stevano",
      email: "albert@example.com",
      totalOrders: 12,
      totalSpent: 125000.00,
      status: 'active',
      joinedDate: '2023-11-15',
      avatar: "https://i.pravatar.cc/150?u=albert",
      phoneNumber: '+234 812 345 6789'
    },
    {
      id: 2,
      name: "Sarah Jenkins",
      email: "sarah.j@example.com",
      totalOrders: 5,
      totalSpent: 45000.00,
      status: 'active',
      joinedDate: '2024-01-20',
      avatar: "https://i.pravatar.cc/150?u=sarah",
      phoneNumber: '+234 901 234 5678'
    },
    {
      id: 3,
      name: "Michael Chen",
      email: "m.chen@example.com",
      totalOrders: 1,
      totalSpent: 12000.00,
      status: 'active',
      joinedDate: '2024-04-10',
      avatar: "https://i.pravatar.cc/150?u=michael",
      phoneNumber: '+234 703 456 7890'
    }
  ] as Customer[],

  payments: [
    {
      id: "PAY-9901",
      orderId: "ORD-7721",
      customerId: 1,
      customerName: "Albert Stevano",
      amount: 3500.00,
      status: 'successful',
      method: 'Card',
      date: '2024-04-28'
    },
    {
      id: "PAY-9902",
      orderId: "ORD-7722",
      customerId: 2,
      customerName: "Sarah Jenkins",
      amount: 4500.00,
      status: 'successful',
      method: 'Transfer',
      date: '2024-04-25'
    },
    {
      id: "PAY-9903",
      orderId: "ORD-7723",
      customerId: 3,
      customerName: "Michael Chen",
      amount: 12000.00,
      status: 'pending',
      method: 'Card',
      date: '2024-04-29'
    }
  ] as Payment[],

  notifications: [
    {
      id: 'notif-1',
      title: 'Welcome Back, Admin',
      message: 'System is running smoothly. 3 new orders since your last login.',
      type: 'system',
      status: 'unread',
      date: new Date().toISOString()
    },
    {
      id: 'notif-2',
      title: 'High Demand Alert',
      message: 'The "Essential Oversized Tee" is running low on stock (5 left).',
      type: 'system',
      status: 'unread',
      date: new Date(Date.now() - 3600000).toISOString()
    }
  ] as Notification[],

  addToCart(product: Product, quantity: number, size: string, color: string) {
    const existing = this.cart.find(
      (item) =>
        item.product.id === product.id &&
        item.size === size &&
        item.color === color,
    );
    if (existing) {
      existing.quantity += quantity
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

  // Admin Methods
  deleteProduct(id: number) {
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) products.splice(index, 1);
  },

  updateProduct(updatedProduct: Product) {
    const index = products.findIndex(p => p.id === updatedProduct.id);
    if (index !== -1) products[index] = updatedProduct;
  },

  addProduct(newProduct: Product) {
    products.push({ ...newProduct, id: Date.now() });
  },

  updateOrderStatus(orderId: string, status: Order['status']) {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      this.addNotification({
        title: 'Order Status Updated',
        message: `Order ${orderId} has been marked as ${status}.`,
        type: 'order',
        link: '/admin/orders'
      });
    }
  },

  refundPayment(paymentId: string) {
    const payment = this.payments.find(p => p.id === paymentId);
    if (payment) {
      payment.status = 'refunded';
      this.addNotification({
        title: 'Refund Processed',
        message: `A refund of ₦${payment.amount.toLocaleString()} for payment ${paymentId} has been processed.`,
        type: 'refund',
        link: '/admin/payments'
      });
    }
  },

  addNotification(notification: Omit<Notification, 'id' | 'status' | 'date'>) {
    this.notifications.unshift({
      ...notification,
      id: `notif-${Math.random().toString(36).substr(2, 9)}`,
      status: 'unread',
      date: new Date().toISOString()
    });
  },

  markNotificationAsRead(id: string) {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) notif.status = 'read';
  },

  markAllNotificationsAsRead() {
    this.notifications.forEach(n => n.status = 'read');
  },

  placeOrder(customerDetails: { fullName: string; email: string; phone: string; address: string; city: string; state: string }, total: number) {
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const paymentId = `PAY-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // 1. Find or Create Customer
    let customer = this.customers.find(c => c.email === customerDetails.email);
    if (!customer) {
      customer = {
        id: this.customers.length + 1,
        name: customerDetails.fullName,
        email: customerDetails.email,
        totalOrders: 0,
        totalSpent: 0,
        status: 'active' as const,
        joinedDate: new Date().toISOString().split('T')[0],
        avatar: `https://i.pravatar.cc/150?u=${customerDetails.fullName}`,
        phoneNumber: customerDetails.phone
      };
      this.customers.push(customer);
    }

    // 2. Create Order
    const newOrder: Order = {
      id: orderId,
      customerId: customer.id,
      customerName: customer.name,
      items: this.cart.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price
      })),
      total: total,
      status: 'pending' as const,
      date: new Date().toISOString().split('T')[0],
      paymentStatus: 'paid' as const,
      phoneNumber: customerDetails.phone
    };
    this.orders.unshift(newOrder);

    // 3. Create Payment
    const newPayment: Payment = {
      id: paymentId,
      orderId: orderId,
      customerId: customer.id,
      customerName: customer.name,
      amount: total,
      status: 'successful' as const,
      method: 'Card' as const,
      date: new Date().toISOString().split('T')[0]
    };
    this.payments.unshift(newPayment);

    // 4. Trigger Notification
    this.addNotification({
      title: 'New Order Received',
      message: `A new order (${orderId}) has been placed by ${customerDetails.fullName}.`,
      type: 'order',
      link: '/admin/orders'
    });

    // 5. Update Customer Stats
    customer.totalOrders += 1;
    customer.totalSpent += total;

    // 5. Clear Cart
    this.cart = [];
    
    return orderId;
  }
});
