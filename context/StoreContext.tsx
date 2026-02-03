import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Product, CartItem, Notification, ProductCategory } from '../types';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

interface StoreContextType {
  user: User | null;
  products: Product[];
  cart: CartItem[];
  notifications: Notification[];
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  addProduct: (product: Omit<Product, 'id' | 'sellerId'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  placeOrder: () => Promise<boolean>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('flora_user');
      return saved ? JSON.parse(saved) : null;
    } catch (err) {
      console.error("Failed to parse user from localStorage", err);
      return null;
    }
  });



  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('flora_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error("Failed to parse cart from localStorage", err);
      return [];
    }
  });

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/products`);
      // Map MongoDB _id to id for frontend consistency
      if (res.data && Array.isArray(res.data)) {
        const mappedProducts = res.data.map((p: any) => ({ ...p, id: p._id }));
        setProducts(mappedProducts);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Error fetching products", err);
      setProducts([]); // Fallback to empty list
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders/notifications for seller
  const fetchNotifications = async (sellerId: string) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/orders/${sellerId}`);
      setNotifications(res.data.map((n: any) => ({ ...n, id: n._id })));
    } catch (err) {
      console.error("Error fetching orders", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (user && user.role === UserRole.SELLER) {
      fetchNotifications(user.id);
    }
  }, [user]);

  // Persistence Effects for local user state
  useEffect(() => {
    if (user) localStorage.setItem('flora_user', JSON.stringify(user));
    else localStorage.removeItem('flora_user');
  }, [user]);



  useEffect(() => {
    localStorage.setItem('flora_cart', JSON.stringify(cart));
  }, [cart]);

  // Actions
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      const user = { ...res.data, id: res.data._id };
      setUser(user);
      return true;
    } catch (err) {
      console.error("Login failed", err);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/register`, { name, email, password, role });
      const user = { ...res.data, id: res.data._id };
      setUser(user);
      return true;
    } catch (err) {
      console.error("Registration failed", err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    setNotifications([]);
  };

  const addProduct = async (newProductData: Omit<Product, 'id' | 'sellerId'>) => {
    if (!user || user.role !== UserRole.SELLER) return;

    try {
      const res = await axios.post(`${API_BASE_URL}/products`, {
        ...newProductData,
        sellerId: user.id
      });
      const newProduct = { ...res.data, id: res.data._id };
      setProducts(prev => [...prev, newProduct]);
    } catch (err: any) {
      console.error("Error adding product", err);
      const msg = err.response?.data?.message || err.message || "Unknown error";
      alert(`Failed to save product: ${msg}\n\nPlease ensure your backend server is running and MongoDB is connected.`);
      throw err;
    }
  };

  const updateProduct = async (id: string, updatedData: Partial<Product>) => {
    try {
      const res = await axios.put(`${API_BASE_URL}/products/${id}`, updatedData);
      const updatedProduct = { ...res.data, id: res.data._id };
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
    } catch (err) {
      console.error("Error updating product", err);
      alert("Failed to update product. Please check your database connection.");
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/products/${id}`);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error("Error deleting product", err);
      alert("Failed to delete product. Please check your database connection.");
      throw err;
    }
  };

  const addToCart = (product: Product, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantityOrdered: Math.min(item.quantityOrdered + quantity, product.quantityAvailable) }
            : item
        );
      }
      return [...prev, { ...product, quantityOrdered: quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const placeOrder = async (): Promise<boolean> => {
    if (!user) return false;

    // MOCK PAYMENT INTEGRATION
    // In a real app, you would integrate Stripe here
    const paymentSuccessful = await new Promise(resolve => setTimeout(() => resolve(true), 1500));

    if (!paymentSuccessful) return false;

    try {
      // Create orders in backend
      for (const item of cart) {
        await axios.post(`${API_BASE_URL}/orders`, {
          sellerId: item.sellerId,
          buyerName: user.name,
          productName: item.name,
          quantity: item.quantityOrdered,
          totalPrice: item.price * item.quantityOrdered,
          date: new Date().toLocaleDateString()
        });

        // Update product quantity in backend
        await axios.put(`${API_BASE_URL}/products/${item.id}`, {
          quantityAvailable: Math.max(0, item.quantityAvailable - item.quantityOrdered)
        });
      }

      await fetchProducts(); // Refresh local product list
      setCart([]);
      return true;
    } catch (err) {
      console.error("Error placing order", err);
      return false;
    }
  };

  return (
    <StoreContext.Provider value={{
      user,
      products,
      cart,
      notifications,
      loading,
      login,
      register,
      logout,
      addProduct,
      updateProduct,
      deleteProduct,
      addToCart,
      removeFromCart,
      placeOrder
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within a StoreProvider");
  return context;
};
