// src/components/restaurant/ContactButtons.tsx
import { Phone, MessageSquare, Instagram, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Restaurant } from '@/lib/types';

export function ContactButtons({ restaurant }: { restaurant: Restaurant }) {
  const generateOrderMessage = () => {
    return encodeURIComponent(
      `Hi ${restaurant?.name}`
    );
  };

  return (
    <div className="mb-8 mt-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap justify-center gap-3">
          {restaurant.phone && (
            <a href={`tel:${restaurant.phone}`} className="flex-1 min-w-[120px]">
              <Button className="gap-2 bg-amber-600 hover:bg-amber-700 w-full">
                <Phone className="h-4 w-4" />
                <span className="text-xs md:text-sm">Call</span>
              </Button>
            </a>
          )}

          {restaurant.whatsapp && (
            <a 
              href={`https://wa.me/${restaurant.whatsapp}?text=${generateOrderMessage()}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 min-w-[120px]"
            >
              <Button variant="outline" className="gap-2 border-amber-600 text-amber-600 hover:bg-amber-50 w-full">
                <MessageSquare className="h-4 w-4" />
                <span className="text-xs md:text-sm">WhatsApp</span>
              </Button>
            </a>
          )}

          {restaurant.instagram && (
            <a
              href={`https://instagram.com/${restaurant.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[120px]"
            >
              <Button variant="outline" className="gap-2 border-pink-500 text-pink-500 hover:bg-pink-50 w-full">
                <Instagram className="h-4 w-4" />
                <span className="text-xs md:text-sm">Instagram</span>
              </Button>
            </a>
          )}

          {restaurant.settings?.facebook && restaurant.settings.facebook.trim() !== '' && (
            <a
              href={`https://facebook.com/${restaurant.settings.facebook.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[120px]"
            >
              <Button variant="outline" className="gap-2 border-blue-600 text-blue-600 hover:bg-blue-50 w-full">
                <Facebook className="h-4 w-4" />
                <span className="text-xs md:text-sm">Facebook</span>
              </Button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
