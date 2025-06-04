import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function handleContactClick() {
  const phoneNumber = "8455838503"; // Replace with your number
  const message = encodeURIComponent("Hello, Can I get more info about MenuLink?");
  const url = `https://wa.me/${phoneNumber}?text=${message}`;
  window.open(url, "_blank");
}