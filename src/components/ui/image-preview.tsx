import { cn } from "@/lib/utils";

interface ImagePreviewProps {
  imageUrl?: string;
  alt?: string;
  className?: string;
  onClick?: () => void;
}

export function ImagePreview({ imageUrl, alt, className, onClick }: ImagePreviewProps) {
  if (!imageUrl) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-gray-100 rounded-md",
          className,
          onClick && "cursor-pointer"
        )}
        onClick={onClick}
      >
        <div className="text-gray-400 text-xs p-4 text-center">
          No image available
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-md bg-gray-100",
        className,
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      <img
        src={imageUrl}
        alt={alt || "Menu item preview"}
        className="w-full h-full object-cover"
        onError={(e) => {
          // Fallback if image fails to load
          const target = e.target as HTMLImageElement;
          target.onerror = null;
          target.src = '';
          target.parentElement!.className = cn(
            "flex items-center justify-center bg-gray-100 rounded-md",
            className
          );
          target.parentElement!.innerHTML = `
            <div class="text-gray-400 text-xs p-4 text-center">
              Image not available
            </div>
          `;
        }}
      />
    </div>
  );
}