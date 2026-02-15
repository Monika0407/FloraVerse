import React, { useState } from 'react';
import { X, CreditCard, Lock } from 'lucide-react';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPaymentComplete: (details: any) => Promise<void>;
    amount: number;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onPaymentComplete, amount }) => {
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [name, setName] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simple mock validation
        if (cardNumber.length < 13 || cvc.length < 3) {
            alert("Invalid card details. For demo, enter any 16 digits.");
            setIsProcessing(false);
            return;
        }

        await onPaymentComplete({
            transactionId: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            cardLast4: cardNumber.slice(-4),
            paymentMethod: 'Credit Card (Mock)'
        });

        setIsProcessing(false);
        onClose();
    };

    // Format card number with spaces
    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '').substring(0, 16);
        setCardNumber(value);
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-flora-100 sm:mx-0 sm:h-10 sm:w-10">
                                <CreditCard className="h-6 w-6 text-flora-600" />
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                    Secure Payment
                                </h3>
                                <div className="mt-2 text-sm text-gray-500">
                                    <p className="mb-4">Complete your purchase of <span className="font-bold text-gray-900">₹{amount.toFixed(2)}</span></p>

                                    <div className="bg-yellow-50 p-3 rounded-md mb-4 border border-yellow-200">
                                        <p className="text-yellow-800 text-xs flex items-center">
                                            <Lock className="w-3 h-3 mr-1" />
                                            This is a secure mock payment. No real money will be charged.
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700">Name on Card</label>
                                            <input
                                                type="text"
                                                required
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-flora-500 focus:border-flora-500 sm:text-sm"
                                                placeholder="John Doe"
                                                value={name}
                                                onChange={e => setName(e.target.value)}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-700">Card Number</label>
                                            <input
                                                type="text"
                                                required
                                                maxLength={19}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-flora-500 focus:border-flora-500 sm:text-sm"
                                                placeholder="0000 0000 0000 0000"
                                                value={cardNumber.replace(/(.{4})/g, '$1 ').trim()}
                                                onChange={handleCardNumberChange}
                                            />
                                        </div>

                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <label className="block text-xs font-medium text-gray-700">Expiry</label>
                                                <input
                                                    type="text"
                                                    required
                                                    maxLength={5}
                                                    placeholder="MM/YY"
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-flora-500 focus:border-flora-500 sm:text-sm"
                                                    value={expiry}
                                                    onChange={e => setExpiry(e.target.value)}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-xs font-medium text-gray-700">CVC</label>
                                                <input
                                                    type="text"
                                                    required
                                                    maxLength={3}
                                                    placeholder="123"
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-flora-500 focus:border-flora-500 sm:text-sm"
                                                    value={cvc}
                                                    onChange={e => setCvc(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                                            <button
                                                type="submit"
                                                disabled={isProcessing}
                                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-flora-600 text-base font-medium text-white hover:bg-flora-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-flora-500 sm:col-start-2 sm:text-sm disabled:opacity-50"
                                            >
                                                {isProcessing ? 'Processing...' : `Pay ₹{amount.toFixed(2)}`}
                                            </button>
                                            <button
                                                type="button"
                                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-flora-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                                                onClick={onClose}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
