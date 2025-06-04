// src/components/restaurant/RestaurantFooter.tsx
export function RestaurantFooter() {
  return (
    <div className="mt-8 pt-6 text-center">
      <p className="text-gray-400 text-xs">
        Made with <span className="text-amber-600">♥</span> using{' '}
        <a 
          href="https://menulink.space" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-amber-600 hover:underline"
        >
          Menu Link
        </a>
      </p>
    </div>
  );
}