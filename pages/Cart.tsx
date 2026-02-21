import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Trash2, ShoppingBag, ArrowLeft, MapPin, Phone, User as UserIcon } from 'lucide-react';
import { DeliveryAddress } from '../types';

import PaymentModal from '../context/components/PaymentModal';

const Cart: React.FC = () => {
  const { cart, removeFromCart, placeOrder, user } = useStore();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = React.useState(false);
  const [address, setAddress] = React.useState<DeliveryAddress>({
    name: '',
    phone: '',
    addressLine: '',
    city: '',
    pincode: ''
  });
  const [addressErrors, setAddressErrors] = React.useState<Record<string, string>>({});
  const navigate = useNavigate();

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantityOrdered), 0);

  const validateAddress = () => {
    const errors: Record<string, string> = {};
    if (!address.name) errors.name = 'Name is required';
    if (!address.phone) errors.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(address.phone)) errors.phone = 'Invalid phone number';
    if (!address.addressLine) errors.addressLine = 'Address is required';
    if (!address.city) errors.city = 'City is required';
    if (!address.pincode) errors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(address.pincode)) errors.pincode = 'Invalid pincode';

    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCheckout = () => {
    if (validateAddress()) {
      setIsPaymentModalOpen(true);
    }
  };

  const handlePaymentComplete = async (paymentDetails: any) => {
    const success = await placeOrder(paymentDetails, address);
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

          <div className="bg-gray-50 px-6 py-8 border-t border-gray-200">
            {/* Delivery Address Form */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-flora-600" />
                Delivery Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      className={`pl-10 w-full border rounded-lg py-2.5 px-3 focus:ring-flora-500 focus:border-flora-500 ${addressErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter receiver's name"
                      value={address.name}
                      onChange={e => setAddress({ ...address, name: e.target.value })}
                    />
                  </div>
                  {addressErrors.name && <p className="text-red-500 text-xs mt-1">{addressErrors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      className={`pl-10 w-full border rounded-lg py-2.5 px-3 focus:ring-flora-500 focus:border-flora-500 ${addressErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="10-digit mobile number"
                      value={address.phone}
                      onChange={e => setAddress({ ...address, phone: e.target.value })}
                    />
                  </div>
                  {addressErrors.phone && <p className="text-red-500 text-xs mt-1">{addressErrors.phone}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                  <textarea
                    rows={2}
                    className={`w-full border rounded-lg py-2.5 px-3 focus:ring-flora-500 focus:border-flora-500 ${addressErrors.addressLine ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="House No, Building Name, Street, Area"
                    value={address.addressLine}
                    onChange={e => setAddress({ ...address, addressLine: e.target.value })}
                  />
                  {addressErrors.addressLine && <p className="text-red-500 text-xs mt-1">{addressErrors.addressLine}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    className={`w-full border rounded-lg py-2.5 px-3 focus:ring-flora-500 focus:border-flora-500 ${addressErrors.city ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter city"
                    value={address.city}
                    onChange={e => setAddress({ ...address, city: e.target.value })}
                  />
                  {addressErrors.city && <p className="text-red-500 text-xs mt-1">{addressErrors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    className={`w-full border rounded-lg py-2.5 px-3 focus:ring-flora-500 focus:border-flora-500 ${addressErrors.pincode ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="6-digit PIN"
                    value={address.pincode}
                    onChange={e => setAddress({ ...address, pincode: e.target.value })}
                  />
                  {addressErrors.pincode && <p className="text-red-500 text-xs mt-1">{addressErrors.pincode}</p>}
                </div>
              </div>
            </div>

            <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
              <p>Subtotal</p>
              <p>₹{totalAmount.toFixed(2)}</p>
            </div>
            <p className="mt-0.5 text-sm text-gray-500 mb-6 font-medium">
              Free delivery for Floraverse members.
            </p>
            <button
              onClick={handleCheckout}
              className={`w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-flora-600 hover:bg-flora-700 transition-colors`}
            >
              Verify Address & Pay
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

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentComplete={handlePaymentComplete}
        amount={totalAmount}
      />
    </div>
  );
};

export default Cart;
