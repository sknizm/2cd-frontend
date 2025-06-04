// src/components/restaurant/MenuCategory.tsx
import { Card, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MenuItem } from '@/lib/types';
import { useCart } from '@/context/CartContext';

interface MenuCategoryProps {
  category: {
    id: string;
    name: string;
    menuItems?: MenuItem[];
  };
  isGrid: boolean;
  isOrder: boolean;
}

export function MenuCategory({ category, isGrid, isOrder }: MenuCategoryProps) {
  const { addToCart, updateQuantity, getQuantity } = useCart();

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 mt-15">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 whitespace-nowrap">
          {category.name}
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      <div className={`${isGrid ? 'grid grid-cols-2 sm:grid-cols-3' : 'grid'} gap-4`}>
        {category.menuItems?.map((item) => {
          const quantity = getQuantity(item.id);

          return (
            <Card
              key={item.id}
              className={`overflow-hidden transition-all hover:shadow-md border border-gray-100 ${
                isGrid ? 'flex flex-col h-full' : ''
              }`}
            >
              <div className={isGrid ? 'flex flex-col h-full' : 'flex h-full'}>
                {item.image && (
                  <div
                    className={`${
                      isGrid
                        ? 'w-full aspect-square flex-shrink-0'
                        : 'flex-shrink-0 w-32 h-30'
                    }`}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className={`${
                        isGrid ? 'w-full h-full' : 'w-auto h-full'
                      } object-cover`}
                      loading="lazy"
                    />
                  </div>
                )}

                <div
                  className={`${
                    isGrid
                      ? 'flex-1 p-4 flex flex-col justify-between'
                      : 'flex-1 p-2 flex flex-col justify-between'
                  } ${!item.image && !isGrid ? 'pl-2' : ''}`}
                >
                  <div>
                    <h3 className="font-semibold text-gray-900 line-clamp-1">
                      {item.name}
                    </h3>
                    {item.description && (
                      <p
                        className={`text-sm text-gray-600 mt-1 ${
                          isGrid ? 'line-clamp-3' : 'line-clamp-2'
                        }`}
                      >
                        {item.description}
                      </p>
                    )}
                  </div>

                 <CardFooter
  className={`p-0 pt-3 flex items-start ${
    isGrid ? 'flex-col mt-auto gap-2' : 'justify-between items-center'
  }`}
>
  <span className="font-bold text-amber-600">
    ₹{item.price.toFixed(2)}
  </span>

  {quantity === 0 ? (
    <div className={`${isGrid ? 'mt-2' : ''}`}>
      {isOrder ? (
        <Button
          className="bg-amber-600"
          size="sm"
          onClick={() =>
            addToCart({
              id: item.id,
              name: item.name,
              price: item.price,
            })
          }
        >
          Add to Cart
        </Button>
      ) : null}
    </div>
  ) : (
    <div className={`${isGrid ? 'mt-2' : ''} flex items-center gap-2`}>
      <Button
        size="icon"
        variant="outline"
        onClick={() => updateQuantity(item.id, quantity - 1)}
      >
        −
      </Button>
      <span className="text-sm font-medium">{quantity}</span>
      <Button
        size="icon"
        variant="outline"
        onClick={() => updateQuantity(item.id, quantity + 1)}
      >
        +
      </Button>
    </div>
  )}
</CardFooter>

                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}