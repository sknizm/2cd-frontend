import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Copy, ArrowRight, QrCode } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { config } from "@/lib/config";
import { AppContext } from "@/context/AppContext";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardHomePage() {
  const navigate = useNavigate();
  const [loadingSlug, setLoadingSlug] = useState(true);
  const [slug, setSlug] = useState("");
  
  const context = useContext(AppContext);
  
  if (!context) {
    throw new Error("AppContext must be used within an AppProvider");
  }

  const { token } = context;
  const menuLink = slug ? `${config.public_url}/${slug}` : "";

  useEffect(() => {
    const fetchSlug = async () => {
      try {
        const res = await fetch(`${config.backend_url}/api/get-slug`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });

        const data = await res.json();

        if (data.success && data.slug) {
          setSlug(data.slug);
        } else {
          throw new Error(data.message || "Slug not found");
        }

      } catch (err) {
        console.error("Error fetching slug", err);
        toast.error("Failed to load restaurant slug.");
      } finally {
        setLoadingSlug(false);
      }
    };

    if (token) {
      fetchSlug();
    }
  }, [token]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(menuLink);
    toast.success("Link Copied Successfully");
  };
 const openLink = () => {
  window.open(`https://${menuLink}`, "_blank", "noopener,noreferrer");
};

  const openWhatsApp = () => {
    window.open(`https://wa.me/918455838503?text=Hi,%20I%20would%20like%20to%20get%20my%20QR%20code%20for%20my%20menu`, '_blank');
  };

  return (
    <div className="space-y-6 p-4 max-w-6xl mx-auto">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Menu Link Card or Skeleton */}
       
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Your Menu Link</CardTitle>
                
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
              { loadingSlug?  <Skeleton className="h-11 w-full rounded-md" /> : <Input
                  value={menuLink}
                  readOnly
                  className="flex-1 text-sm truncate bg-gray-50"
                />}
                <div className="flex space-x-2">
                  <Button 
                    onClick={copyToClipboard} 
                    size="sm"
                    disabled={loadingSlug}
                    variant="outline"
                    className="p-2"
                    title="Copy link"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                   <Button onClick={openLink}
                    disabled={loadingSlug} size="sm" variant="outline" className="p-2" title="Preview">
                     <Eye className="h-4 w-4" />
                     
                    </Button>
                  
                </div>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Share this link with your customers to access your digital menu
              </p>
            </CardContent>
          </Card>

     
        
        {/* Create Menu Card */}
        <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-amber-50 to-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Create Your Digital Menu</CardTitle>
            <CardDescription className="text-sm">
              Add and organize all your menu items
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/dashboard/menu')} 
              className="w-full md:w-auto gap-2 bg-amber-600 hover:bg-amber-700 text-white shadow-md hover:shadow-lg transition-all"
              size="lg"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
        

           {/* QR Code Card */}
        <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-green-50 to-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <QrCode className="h-5 w-5 text-green-600" />
              Get Your QR Code
            </CardTitle>
            <CardDescription className="text-sm">
              Print or display this QR code for customers to scan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={openWhatsApp}
              className="w-full md:w-auto gap-2 bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all"
              size="lg"
            >
              Request QR Code
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        
        {/* Restaurant Details Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Restaurant Profile</CardTitle>
            <CardDescription className="text-sm">
              Customize your restaurant details and branding
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Add your social links, contact info, and edit menu page
                </p>
              </div>
              <Button 
                onClick={() => navigate('/dashboard/restaurant')} 
                className="w-full md:w-auto gap-2 bg-amber-600 hover:bg-amber-700 text-white shadow-md hover:shadow-lg transition-all"
                size="lg"
              >
                Edit Profile
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}