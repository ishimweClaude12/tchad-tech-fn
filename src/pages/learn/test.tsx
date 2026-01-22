import React, { useState } from "react";
import {
  CreditCard,
  Smartphone,
  ShoppingBag,
  Lock,
  AlertCircle,
} from "lucide-react";

// Types
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface FormErrors {
  cardNumber?: string;
  cardName?: string;
  expiryDate?: string;
  cvv?: string;
  phoneNumber?: string;
}

const CheckoutPage = () => {
  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState<"card" | "mobile">("card");

  // Form states
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock cart items
  const cartItems: CartItem[] = [
    {
      id: "1",
      name: "Premium Laptop Stand",
      price: 45000,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100&h=100&fit=crop",
    },
    {
      id: "2",
      name: "Wireless Mouse",
      price: 15000,
      quantity: 2,
      image:
        "https://images.unsplash.com/photo-1527814050087-3793815479db?w=100&h=100&fit=crop",
    },
  ];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.18; // 18% tax
  const total = subtotal + tax;

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    return formatted.substring(0, 19); // Max 16 digits + 3 spaces
  };

  // Format expiry date as MM/YY
  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + "/" + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  // Format phone number
  const formatPhoneNumber = (value: string) => {
    return value.replace(/\D/g, "").substring(0, 15);
  };

  // Validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (paymentMethod === "card") {
      if (!cardNumber || cardNumber.replace(/\s/g, "").length < 13) {
        newErrors.cardNumber = "Enter a valid card number";
      }
      if (!cardName || cardName.trim().length < 3) {
        newErrors.cardName = "Enter the cardholder name";
      }
      if (!expiryDate || expiryDate.length < 5) {
        newErrors.expiryDate = "Enter expiry date (MM/YY)";
      }
      if (!cvv || cvv.length < 3) {
        newErrors.cvv = "Enter CVV";
      }
    } else {
      if (!phoneNumber || phoneNumber.length < 8) {
        newErrors.phoneNumber = "Enter a valid phone number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      alert(
        `Payment of ${total.toLocaleString()} CFA processed successfully via ${
          paymentMethod === "card" ? "Card" : "Mobile Money"
        }!`
      );
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your purchase securely</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Payment Method Selection */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setPaymentMethod("card")}
                    className={`flex items-center justify-center gap-3 p-4 border-2 rounded-lg transition-all ${
                      paymentMethod === "card"
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <CreditCard className="w-6 h-6" />
                    <span className="font-medium">Card Payment</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod("mobile")}
                    className={`flex items-center justify-center gap-3 p-4 border-2 rounded-lg transition-all ${
                      paymentMethod === "mobile"
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Smartphone className="w-6 h-6" />
                    <span className="font-medium">Mobile Money</span>
                  </button>
                </div>
              </div>

              {/* Payment Form */}
              <div>
                {paymentMethod === "card" ? (
                  // Card Payment Form
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold mb-4">Card Details</h3>

                    {/* Card Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) =>
                          setCardNumber(formatCardNumber(e.target.value))
                        }
                        placeholder="1234 5678 9012 3456"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.cardNumber
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.cardNumber && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.cardNumber}
                        </p>
                      )}
                    </div>

                    {/* Cardholder Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="John Doe"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.cardName ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.cardName && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.cardName}
                        </p>
                      )}
                    </div>

                    {/* Expiry and CVV */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={expiryDate}
                          onChange={(e) =>
                            setExpiryDate(formatExpiryDate(e.target.value))
                          }
                          placeholder="MM/YY"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.expiryDate
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {errors.expiryDate && (
                          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.expiryDate}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          value={cvv}
                          onChange={(e) =>
                            setCvv(
                              e.target.value.replace(/\D/g, "").substring(0, 4)
                            )
                          }
                          placeholder="123"
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.cvv ? "border-red-500" : "border-gray-300"
                          }`}
                        />
                        {errors.cvv && (
                          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.cvv}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  // Mobile Money Form
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold mb-4">
                      Mobile Money Details
                    </h3>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <p className="text-sm text-blue-800">
                        <strong>Note:</strong> A payment request will be sent to
                        your phone. Please confirm the transaction on your
                        device.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="flex gap-2">
                        <select className="px-3 py-3 border border-gray-300 rounded-lg bg-white">
                          <option>+235</option>
                          <option>+237</option>
                          <option>+250</option>
                        </select>
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) =>
                            setPhoneNumber(formatPhoneNumber(e.target.value))
                          }
                          placeholder="912345678"
                          className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.phoneNumber
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                      </div>
                      {errors.phoneNumber && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.phoneNumber}
                        </p>
                      )}
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <p className="font-medium text-gray-900">
                        Supported Providers:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm">
                          MTN Money
                        </span>
                        <span className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm">
                          Orange Money
                        </span>
                        <span className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm">
                          Moov Money
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Notice */}
                <div className="mt-6 flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                  <Lock className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Secure Payment
                    </p>
                    <p className="text-sm text-gray-600">
                      Your payment information is encrypted and secure. We never
                      store your card details.
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isProcessing}
                  className="w-full mt-6 bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>Pay {total.toLocaleString()} CFA</>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Order Summary
              </h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {(item.price * item.quantity).toLocaleString()} CFA
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    {subtotal.toLocaleString()} CFA
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (18%)</span>
                  <span className="font-medium">
                    {tax.toLocaleString()} CFA
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-semibold text-lg">Total</span>
                  <span className="font-bold text-lg text-blue-600">
                    {total.toLocaleString()} CFA
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
