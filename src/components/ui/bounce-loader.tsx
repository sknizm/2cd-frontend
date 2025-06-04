const BouncingDotsLoader = () => {
  return (
    <div className="flex items-center justify-center space-x-2 h-12">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="w-3 h-3 bg-amber-600 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
};

export default BouncingDotsLoader;