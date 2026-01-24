import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';

const Cart: React.FC = () => {
  const { cart, removeFromCart, placeOrder, user } = useStore();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const navigate = useNavigate();

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantityOrdered), 0);

  const handleCheckout = async () => {
    setIsProcessing(true);
    const success = await placeOrder();
    setIsProcessing(false);
    if (success) {
      alert("Payment Successful! Your order has been placed.");
      navigate('/buyer-dashboard');
    } else {
      alert("Payment failed or an error occurred.");
    }
  };

  if (!user || user.role !== 'buyer') {
    return <div className="p-8 text-center">Please login as a buyer to view cart.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
        <ShoppingBag className="mr-3 h-8 w-8 text-flora-600" />
        Your Cart
      </h1>

      {cart.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-10 text-center">
          <p className="text-xl text-gray-500 mb-6">Your cart is empty.</p>
          <Link to="/buyer-dashboard" className="text-flora-600 font-medium hover:text-flora-800 flex items-center justify-center">
            <ArrowLeft className="mr-2 h-4 w-4" /> Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <ul className="divide-y divide-gray-200">
            {cart.map((item) => (
              <li key={item.id} className="p-6 flex items-center">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-20 w-20 object-cover rounded-md border border-gray-200"
                />
                <div className="ml-6 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                    <p className="text-lg font-bold text-gray-900">₹{(item.price * item.quantityOrdered).toFixed(2)}</p>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Quantity: <span className="font-medium">{item.quantityOrdered}</span> x ₹{item.price}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 flex items-center text-sm font-medium"
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="bg-gray-50 px-6 py-6 border-t border-gray-200">
            <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
              <p>Subtotal</p>
              <p>₹{totalAmount.toFixed(2)}</p>
            </div>
            <p className="mt-0.5 text-sm text-gray-500 mb-6">
              Shipping and taxes calculated at checkout.
            </p>
            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className={`w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-flora-600 hover:bg-flora-700'}`}
            >
              {isProcessing ? 'Processing Payment...' : 'Proceed to Payment'}
            </button>
            <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
              <p>
                or{' '}
                <Link to="/buyer-dashboard" className="text-flora-600 font-medium hover:text-flora-500">
                  Continue Shopping<span aria-hidden="true"> &rarr;</span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
