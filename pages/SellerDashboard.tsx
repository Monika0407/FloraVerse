import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCategory } from '../types';
import { PlusCircle, Bell, DollarSign, Package, Upload, LayoutDashboard, Tag, TrendingUp, IndianRupee } from 'lucide-react';

const SellerDashboard: React.FC = () => {
  const { user, products, addProduct, updateProduct, deleteProduct, notifications, loading, fetchNotifications } = useStore();
  const [activeTab, setActiveTab] = useState<'add' | 'inventory' | 'notifications' | 'analytics'>('inventory');

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Form State
  const [productForm, setProductForm] = useState({
    name: '',
    category: ProductCategory.PLANTS,
    description: '',
    price: '',
    quantity: '',
    image: null as File | null,
    imageUrl: '' // For editing existing products
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  if (!user || (user.role !== 'seller' && user.role !== 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <div className="text-red-500 mb-4 mx-auto w-12 h-12"><LayoutDashboard className="w-full h-full" /></div>
          <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
          <p className="text-gray-500 mt-2">You need a seller or admin account to view this page.</p>
        </div>
      </div>
    );
  }

  const isAdmin = user.role === 'admin';

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setProductForm({ ...productForm, image: e.dataTransfer.files[0] });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProductForm({ ...productForm, image: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const mockImageUrl = productForm.image
      ? URL.createObjectURL(productForm.image)
      : (productForm.imageUrl || 'https://picsum.photos/400/400?random=' + Math.random());

    const productData = {
      name: productForm.name,
      category: productForm.category,
      description: productForm.description,
      price: parseFloat(productForm.price),
      quantityAvailable: parseInt(productForm.quantity),
      imageUrl: mockImageUrl
    };

    try {
      if (editingId) {
        await updateProduct(editingId, productData);
        alert("Product updated successfully!");
      } else {
        await addProduct(productData);
        alert("Product added successfully!");
      }

      setProductForm({
        name: '',
        category: ProductCategory.PLANTS,
        description: '',
        price: '',
        quantity: '',
        image: null,
        imageUrl: ''
      });
      setEditingId(null);
      setActiveTab('inventory');
    } catch (err) {
      alert("Failed to save product.");
    }
  };

  const handleEdit = (product: any) => {
    setProductForm({
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price.toString(),
      quantity: product.quantityAvailable.toString(),
      image: null,
      imageUrl: product.imageUrl
    });
    setEditingId(product.id);
    setActiveTab('add');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
    }
  };

  // Role-based data filtering
  const sellerProducts = isAdmin ? products : products.filter(p => p.sellerId === user.id);
  const userNotifications = notifications; // notifications are already filtered by StoreContext based on role
  const totalSales = userNotifications.reduce((acc, curr) => acc + curr.totalPrice, 0);

  // Dynamic Sales Data for Graph (Last 7 Days)
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(`${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`);
    }
    return days;
  };

  const last7Days = getLast7Days();
  const salesData = last7Days.map(dateStr => {
    // Standardize comparison to DD/MM by stripping the year part
    const targetBase = dateStr.split('/').slice(0, 2).join('/');

    return userNotifications
      .filter(n => {
        const orderBase = String(n.date || '').split('/').slice(0, 2).join('/');
        return orderBase === targetBase;
      })
      .reduce((sum, n) => {
        const price = parseFloat(String(n.totalPrice)) || 0;
        return sum + price;
      }, 0);
  });

  // Debug log to trace data (visible in browser F12 console)
  console.log('Analytics Debug:', {
    dates: last7Days,
    orderDates: userNotifications.map(n => n.date),
    calculatedSales: salesData
  });

  const maxSale = Math.max(...salesData, 100); // Default to 100 to avoid division by zero

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-flora-100 p-2 rounded-lg"><LayoutDashboard className="h-6 w-6 text-flora-700" /></div>
            <h1 className="text-2xl font-bold text-gray-900 font-serif">{isAdmin ? 'Admin Management' : 'Seller Dashboard'}</h1>
          </div>
          <div className="flex space-x-2 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => { setActiveTab('inventory'); setEditingId(null); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'inventory' ? 'bg-white text-flora-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <span className="flex items-center"><Package className="mr-2 h-4 w-4" /> My Products</span>
            </button>
            <button
              onClick={() => { setActiveTab('add'); setEditingId(null); setProductForm({ name: '', category: ProductCategory.PLANTS, description: '', price: '', quantity: '', image: null, imageUrl: '' }); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'add' ? 'bg-white text-flora-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <span className="flex items-center"><PlusCircle className="mr-2 h-4 w-4" /> Add Product</span>
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'notifications' ? 'bg-white text-flora-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <span className="flex items-center">
                <Bell className="mr-2 h-4 w-4" />
                Orders
                {userNotifications.length > 0 && <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{userNotifications.length}</span>}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'analytics' ? 'bg-white text-flora-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <span className="flex items-center"><TrendingUp className="mr-2 h-4 w-4" /> Analytics</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><IndianRupee className="h-6 w-6" /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{isAdmin ? 'Global Revenue' : 'Total Revenue'}</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalSales.toFixed(2)}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Package className="h-6 w-6" /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{isAdmin ? 'Total System Orders' : 'Total Orders'}</p>
              <p className="text-2xl font-bold text-gray-900">{userNotifications.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl"><Tag className="h-6 w-6" /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{isAdmin ? 'Global Catalog' : 'Active Listings'}</p>
              <p className="text-2xl font-bold text-gray-900">{isAdmin ? products.length : sellerProducts.length}</p>
            </div>
          </div>
        </div>

        {activeTab === 'analytics' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Weekly Sales Performance</h2>
            <div className="h-64 flex items-end justify-between gap-4">
              {salesData.map((value, index) => {
                const heightPercent = Math.min(100, (value / maxSale) * 100);
                return (
                  <div key={index} className="flex-1 flex flex-col items-center group h-full justify-end">
                    <div
                      className="w-full max-w-[40px] bg-flora-500 rounded-t-md hover:bg-flora-600 transition-all relative"
                      style={{ height: `${heightPercent || (value > 0 ? 2 : 0)}%` }}
                    >
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                        ₹{value.toLocaleString()}
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 mt-2 font-medium">
                      {last7Days[index].split('/').slice(0, 2).join('/')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Your Product Listings</h2>
              <button
                onClick={() => setActiveTab('add')}
                className="bg-flora-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-flora-700 transition"
              >
                Add New Product
              </button>
            </div>
            {loading ? (
              <div className="text-center py-20 text-gray-500">Loading products...</div>
            ) : sellerProducts.length === 0 ? (
              <div className="text-center py-20 px-6">
                <div className="mx-auto h-24 w-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Package className="h-10 w-10 text-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No products yet</h3>
                <p className="text-gray-500 mt-1">Start by listing your first product for sale.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sellerProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img src={product.imageUrl} alt="" className="h-10 w-10 rounded-lg object-cover mr-3" />
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">₹{product.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.quantityAvailable}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button onClick={() => handleEdit(product)} className="text-flora-600 hover:text-flora-900 mr-4">Edit</button>
                          <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'add' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{editingId ? 'Edit Product' : 'List a New Product'}</h2>
                <form onSubmit={handleSubmit} className="space-y-8">

                  {/* Image Upload Area */}
                  <div
                    className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${dragActive ? 'border-flora-500 bg-flora-50' : 'border-gray-300 hover:border-gray-400'}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      id="file-upload"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center justify-center">
                      {productForm.image || productForm.imageUrl ? (
                        <div className="relative group">
                          <img
                            src={productForm.image ? URL.createObjectURL(productForm.image) : productForm.imageUrl}
                            alt="Preview"
                            className="h-48 object-contain rounded-lg shadow-md"
                          />
                          <button
                            type="button"
                            onClick={() => setProductForm({ ...productForm, image: null, imageUrl: '' })}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="bg-gray-100 p-4 rounded-full mb-4">
                            <Upload className="h-8 w-8 text-gray-400" />
                          </div>
                          <label htmlFor="file-upload" className="cursor-pointer">
                            <span className="text-flora-600 font-semibold hover:text-flora-700">Upload an image</span>
                            <span className="text-gray-500"> or drag and drop</span>
                          </label>
                          <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                        <input
                          type="text"
                          required
                          className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-flora-500 focus:border-transparent transition"
                          placeholder="e.g., Monstera Deliciosa"
                          value={productForm.name}
                          onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                          className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-flora-500 focus:border-transparent transition bg-white"
                          value={productForm.category}
                          onChange={e => setProductForm({ ...productForm, category: e.target.value as ProductCategory })}
                        >
                          {Object.values(ProductCategory).map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">₹</span>
                          </div>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            required
                            className="appearance-none block w-full pl-7 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-flora-500 focus:border-transparent transition"
                            placeholder="0.00"
                            value={productForm.price}
                            onChange={e => setProductForm({ ...productForm, price: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity Available</label>
                        <input
                          type="number"
                          min="1"
                          required
                          className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-flora-500 focus:border-transparent transition"
                          placeholder="10"
                          value={productForm.quantity}
                          onChange={e => setProductForm({ ...productForm, quantity: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      required
                      rows={4}
                      className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-flora-500 focus:border-transparent transition"
                      placeholder="Describe your product in detail..."
                      value={productForm.description}
                      onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                    />
                  </div>

                  <div className="pt-4 flex justify-end gap-4">
                    {editingId && (
                      <button
                        type="button"
                        onClick={() => { setEditingId(null); setActiveTab('inventory'); }}
                        className="px-8 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      className="px-8 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-flora-600 hover:bg-flora-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-flora-500 transition-all transform hover:-translate-y-1"
                    >
                      {editingId ? 'Update Product' : 'Publish Product'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            </div>
            {userNotifications.length === 0 ? (
              <div className="text-center py-20 px-6">
                <div className="mx-auto h-24 w-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Package className="h-10 w-10 text-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
                <p className="text-gray-500 mt-1">When buyers purchase your products, the orders will appear here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Buyer</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Qty</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Delivery Address</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userNotifications.map((notif) => (
                      <tr key={notif.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{notif.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-flora-100 flex items-center justify-center text-flora-600 font-bold text-xs mr-3">
                              {notif.buyerName.charAt(0)}
                            </div>
                            <div className="text-sm font-medium text-gray-900">{notif.buyerName}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{notif.productName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{notif.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">₹{notif.totalPrice.toFixed(2)}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {notif.deliveryAddress ? (
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-800">{notif.deliveryAddress.name}</span>
                              <span className="text-xs">{notif.deliveryAddress.phone}</span>
                              <span className="text-xs mt-1 leading-tight">
                                {notif.deliveryAddress.addressLine}, {notif.deliveryAddress.city} - {notif.deliveryAddress.pincode}
                              </span>
                            </div>
                          ) : (
                            <span className="italic text-gray-400">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Paid
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
