// src/pages/RestaurantPage.tsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { config } from '@/lib/config';
import { Restaurant } from '@/lib/types';
import { RestaurantSkeleton } from '@/components/restaurant/RestaurantSkeleton';
import { RestaurantHeader } from '@/components/restaurant/RestaurantHeader';
import { ContactButtons } from '@/components/restaurant/ContactButtons';
import { MenuCategory } from '@/components/restaurant/MenuCategory';
import { RestaurantFooter } from '@/components/restaurant/RestaurantFooter';
import { MembershipInactive } from '@/components/restaurant/MembershipInactive';
import { RestaurantError } from '@/components/restaurant/RestaurantError';
import { NotFound } from '@/components/restaurant/NotFound';
import { CartProvider } from '@/context/CartContext';
import { pageview } from '@/lib/gtag';

export default function RestaurantPage() {
  const { slug } = useParams<{ slug: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{
    type: 'not_found' | 'inactive' | 'other';
    message: string;
  } | null>(null);


  useEffect(() => {
    pageview('Restaurant Page')
  }, [])

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${config.backend_url}/api/restaurant/${slug}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          if (data.slug === false) {
            setError({
              type: 'not_found',
              message: data.message || 'Restaurant not found',
            });
          } else if (data.membership === false) {
            setError({
              type: 'inactive',
              message: data.message || 'Membership is not active',
            });
          } else {
            setError({
              type: 'other',
              message: data.message || 'Failed to load restaurant',
            });
          }
          return;
        }

        // Everything is OK
        setRestaurant(data.restaurant);
      } catch (err) {
        if (err)
          setError({
            type: 'other',
            message: 'Something went wrong. Please try again later.',
          });
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchRestaurantData();
    }
  }, [slug]);

  if (loading) return <RestaurantSkeleton />;

  if (error) {
    if (error.type === 'not_found') return <NotFound />;
    if (error.type === 'inactive') return <MembershipInactive />;
    return <RestaurantError message={error.message} />;
  }

  if (!restaurant) return null;

  const isOrder = restaurant.settings?.isOrder ?? true
  return (
    <CartProvider>
      <div className="max-w-4xl mx-auto px-4 pb-6">
        <RestaurantHeader restaurant={restaurant} slug={`${slug}`} isOrder={isOrder} />

        {(restaurant.phone || restaurant.whatsapp || restaurant.instagram) && (
          <ContactButtons restaurant={restaurant} />
        )}

        <div className="space-y-10 mb-12">
          {restaurant.categories.map((category, idx) => (
            <MenuCategory isOrder={isOrder} key={idx} category={category} isGrid={restaurant.settings?.isGrid ?? false} />
          ))}
        </div>

        <RestaurantFooter />
      </div>
    </CartProvider>
  );
}
