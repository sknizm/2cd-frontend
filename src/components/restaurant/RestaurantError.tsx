// src/components/restaurant/RestaurantError.tsx
export function RestaurantError({ message }: { message: string }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <div className="bg-red-50 text-red-600 p-6 rounded-lg inline-block">
        <p className="text-lg font-medium">{message}</p>
        <p className="mt-2">Please try again later.</p>
      </div>
    </div>
  );
}