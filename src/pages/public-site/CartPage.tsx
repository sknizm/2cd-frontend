import { useCart } from '@/context/CartContext';
import { pageview } from '@/lib/gtag';
import { Trash2, ShoppingCart, Plus, Minus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const [total, setTotal] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const location = useLocation();

  // Get WhatsApp number from location state
  const whatsappNumber = location.state?.whatsappNumber || '';
  const restaurantName = location.state?.restaurantName || '';

  // Refresh page once every time this page loads (but only once per visit)
  useEffect(() => {
    if (!sessionStorage.getItem('cartPageRefreshed')) {
      sessionStorage.setItem('cartPageRefreshed', 'true');
      window.location.reload();
    }

    const clearFlag = () => sessionStorage.removeItem('cartPageRefreshed');
    window.addEventListener('beforeunload', clearFlag);

    pageview('Cart Page')
    return () => {
      clearFlag();
      window.removeEventListener('beforeunload', clearFlag);
    };
  }, []);

  useEffect(() => {
    setIsClient(true);
    setTotal(cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0));
  }, [cartItems]);

  if (!isClient) return null;

  const handlePlaceOrder = () => {
    if (cartItems.length === 0 || !whatsappNumber) return;

    const message = `Hello ${restaurantName ? restaurantName + '!' : '!'}\nI would like to place an order:\n\n${cartItems
      .map(item => `- ${item.name} (${item.quantity} x ₹${item.price}) = ₹${item.quantity * item.price}`)
      .join('\n')}\n\nTotal: ₹${total.toFixed(2)}\n\nPlease confirm my order.`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');

    clearCart();
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 px-4">
        <ShoppingCart className="w-12 h-12 text-gray-400" />
        <p className="text-xl text-gray-500">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 pb-24">
      <h2 className="text-2xl font-bold mb-6 pt-4">Your Cart</h2>

      <div className="space-y-4 mb-6">
        {cartItems.map(item => (
          <div key={item.id} className="flex justify-between items-start p-4 border rounded-lg">
            <div className="flex-1">
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-gray-600">₹{item.price.toFixed(2)} each</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-md">
                <button
                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                  disabled={item.quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-2">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <p className="font-medium w-20 text-right">₹{(item.price * item.quantity).toFixed(2)}</p>

              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:text-red-700 p-1"
                aria-label="Remove item"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 mb-6">
    
     
        <div className="flex justify-between font-bold text-lg mt-4">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={() => clearCart()}
        className=" bg-red-100 px-4 py-2 rounded-md flex items-center gap-1 text-red-500 hover:text-red-700 mb-8"
      >
        <Trash2 className="w-4 h-4" /> Clear Cart
      </button>

      {/* Fixed Place Order button at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="max-w-xl mx-auto px-4 py-3">
          <button
            onClick={handlePlaceOrder}
            disabled={!whatsappNumber}
            className={`w-full ${
              whatsappNumber ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
            } text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2`}
          >
            <ShoppingCart className="w-5 h-5" />
            {whatsappNumber ? `Place Order (₹${total.toFixed(2)})` : 'WhatsApp number not available'}
          </button>
          {!whatsappNumber && (
            <p className="text-sm text-red-500 mt-2 text-center">
              This restaurant hasn't provided a WhatsApp number for orders
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
