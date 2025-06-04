import { MapPin, X, ShoppingCart } from 'lucide-react';
import { Restaurant } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { Link } from 'react-router-dom';


export function RestaurantHeader({
  restaurant,
  slug,
  isOrder,
}: {
  restaurant: Restaurant;
  slug: string;
  isOrder: boolean;
}) {
  const { cartItems } = useCart();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          {/* Left side - Menu button and Restaurant name */}
          <div className="flex items-center gap-4">
            {/* <button 
              onClick={() => setIsDrawerOpen(true)}
              className="p-2 rounded-md hover:bg-gray-100"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5 text-gray-700" />
            </button> */}

            <Link to={`/${slug}`} className="text-xl font-bold text-gray-900 line-clamp-1">
              {restaurant.name}
            </Link>
          </div>

          {/* Right side - Cart button */}
          {
            isOrder ? <Link
              to={`/${slug}/cart`}
              state={{ whatsappNumber: restaurant.whatsapp, restaurantName: restaurant.name }}
              className="relative p-2 rounded-md hover:bg-gray-100"
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5 text-gray-700" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link> : <></>
          }
        </div>
      </nav>

      {/* Drawer Menu */}
      <div className={`fixed inset-0 z-50 transform ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div className="relative w-full max-w-xs h-full bg-white shadow-xl">
          {/* Drawer header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold">{restaurant.name}</h2>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 rounded-md hover:bg-gray-100"
              aria-label="Close menu"
            >
              <X className="h-5 w-5 text-gray-700" />
            </button>
          </div>

          {/* Drawer content */}
          <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">
            {/* Restaurant description */}
            {restaurant.description && (
              <p className="text-gray-600 mb-6">
                {restaurant.description}
              </p>
            )}

            {/* Address */}
            {restaurant.address && (
              <div className="flex items-start gap-3 mb-6">
                <MapPin className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">
                  {restaurant.address}
                </p>
              </div>
            )}

            {/* Contact buttons would go here */}
            <div className="space-y-4">
              {restaurant.phone && (
                <a
                  href={`tel:${restaurant.phone}`}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700"
                >
                  <span className="bg-green-100 text-green-700 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5l1.5-2.5 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2"></path>
                    </svg>
                  </span>
                  <span>Call: {restaurant.phone}</span>
                </a>
              )}

              {restaurant.whatsapp && (
                <a
                  href={`https://wa.me/${restaurant.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700"
                >
                  <span className="bg-green-100 text-green-700 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 20l1.3-3.9C1.976 12.663 2.874 8.228 6.4 5.726c3.526-2.501 8.59-2.296 11.845.48 3.255 2.777 3.695 7.266 1.029 10.501C16.608 19.942 11.659 20.922 7.7 19L3 20"></path>
                    </svg>
                  </span>
                  <span>WhatsApp: {restaurant.whatsapp}</span>
                </a>
              )}

              {restaurant.instagram && (
                <a
                  href={`https://instagram.com/${restaurant.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700"
                >
                  <span className="bg-pink-100 text-pink-700 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </span>
                  <span>Instagram: @{restaurant.instagram}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}
    </>
  );
}