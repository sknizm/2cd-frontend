import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import React, {   useContext, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { config } from "@/lib/config";
import { AppContext } from "@/context/AppContext";
import { handleContactClick } from "@/lib/utils";

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [restaurantTitle, setRestaurantTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
   const context = useContext(AppContext);
    
      if (!context) {
        throw new Error("AppContext must be used within an AppProvider");
      }
    
      const { token } = context;

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setErrorMessage("");

  try {
    if (!restaurantTitle || !slug) {
      throw new Error("Restaurant title and URL slug are required");
    }

    // Sanitize slug: lowercase and replace invalid chars with '-'
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');

    // 🔍 Check if slug already exists
    const checkRes = await fetch(`${config.backend_url}/api/check-slug/${cleanSlug}`);
    const checkData = await checkRes.json();

    if (checkData.exists) {
      setErrorMessage("Slug is already taken. Please choose a different one.");
      setIsLoading(false);  // STOP further execution if slug is taken
      return;               // Exit early
    }

    // ✅ Create restaurant
    const response = await fetch(`${config.backend_url}/api/create-restaurant`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,  // ✅ Required for Sanctum token
        Accept: "application/json",        // ✅ Important for Laravel to return JSON
      },
      body: JSON.stringify({
        title: restaurantTitle,
        slug: cleanSlug,
        whatsapp: whatsappNumber,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      toast.message(`${errorData.errors}`)
      console.log(errorData.errors)
      
      throw new Error(errorData.error || "Failed to create restaurant");
    }

    toast.success("Restaurant Created Successfully");
    navigate("/dashboard");

  } catch (error) {
    setErrorMessage(error instanceof Error ? error.message : "Failed to create restaurant");
    console.error("Restaurant creation error:", error);
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 p-4">
      <Card className="w-full max-w-md shadow-xl rounded-xl overflow-hidden border border-amber-100">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 border border-amber-100">
  <span className="text-sm font-bold bg-gradient-to-r from-amber-600 to-amber-600 bg-clip-text text-transparent">
    MenuLink
  </span>
</span>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-amber-800">Complete Your Setup</CardTitle>
            <CardDescription className="text-gray-600">
              A few more details to get started
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="restaurantTitle" className="block text-sm font-medium text-gray-700">
                Restaurant Title
              </label>
              <Input
                id="restaurantTitle"
                placeholder="My Awesome Restaurant"
                value={restaurantTitle}
                onChange={(e) => setRestaurantTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                Your Restaurant Slug (Link)
              </label>
              <div className="flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  {config.public_url || "menulink.in"}/
                </span>
                <Input
                  id="slug"
                  type="text"
                  placeholder="your-restaurant"
                  value={slug}
                  onChange={(e) => {
                    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-');
                    setSlug(value);
                  }}
                  required
                  pattern="[a-z0-9-]+"
                  title="Only lowercase letters, numbers, and hyphens are allowed"
                  className="flex-1 block w-full rounded-none rounded-r-md"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Only lowercase letters, numbers, and hyphens are allowed
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700">
                WhatsApp Number
              </label>
              <Input
                id="whatsappNumber"
                placeholder="+91 9876543210"
                type="tel"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                You will receive orders on this number
              </p>
            </div>

            <Button 
              disabled={isLoading} 
              type="submit" 
              className="w-full bg-amber-600 hover:bg-amber-700 transition-colors duration-200 shadow-md mt-4"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up...
                </>
              ) : "Complete Setup"}
            </Button>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                {errorMessage}
              </div>
            )}
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Need help? <span onClick={handleContactClick} className="font-medium text-amber-600 hover:text-amber-700 hover:underline">Contact support</span>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OnboardingPage;
