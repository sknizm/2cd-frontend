import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save, Loader2,  } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import BouncingDotsLoader from "@/components/ui/bounce-loader";
import { config } from "@/lib/config";
import { AppContext } from "@/context/AppContext";

type Settings = {
  isGrid?: boolean | null;
  isOrder?: boolean | null;
  facebook?: string | null;
};

export default function RestaurantSettingsPage() {
  const [restaurant, setRestaurant] = useState({
    name: "",
    address: "",
    whatsapp: "",
    phone: "",
    instagram: "",
    settings: {} as Settings,
  });

  const [initialData, setInitialData] = useState(restaurant);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext must be used within an AppProvider");
  }
  const { token } = context;

  // Prevent navigation if there are unsaved changes


  useEffect(() => {
    if (!token) return;

    const fetchRestaurant = async () => {
      try {
        const res = await fetch(`${config.backend_url}/api/restaurant-by-user`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch restaurant");

        const data = await res.json();

        if (data.success && data.data) {
          const settings: Settings = data.data.settings || {};
          const restaurantData = { ...data.data, settings };
          setRestaurant(restaurantData);
          setInitialData(restaurantData);
        } else {
          throw new Error(data.message || "Restaurant not found");
        }
      } catch (err) {
        toast.error("Failed to load restaurant");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [token]);

  useEffect(() => {
    // Check if current data differs from initial data
    const changesDetected = JSON.stringify(restaurant) !== JSON.stringify(initialData);
    setHasChanges(changesDetected);
  }, [restaurant, initialData]);

  const handleChange = (field: string, value: string) => {
    setRestaurant((prev) => ({ ...prev, [field]: value }));
  };

  const handleSettingsChange = (field: keyof Settings, value: boolean | string | null) => {
    setRestaurant((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    if (!token) {
      toast.error("You must be logged in to update.");
      return;
    }

    try {
      setSaving(true);
      const res = await fetch(`${config.backend_url}/api/update-restaurant`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: restaurant.name,
          address: restaurant.address,
          whatsapp: restaurant.whatsapp,
          phone: restaurant.phone,
          instagram: restaurant.instagram,
          settings: {
            isGrid: restaurant.settings.isGrid ?? null,
            isOrder: restaurant.settings.isOrder ?? null,
            facebook: restaurant.settings.facebook ?? null,
          },
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to update");
      }

      const data = await res.json();
      setInitialData({ ...restaurant, settings: data.data.settings || {} });
      toast.success("Changes saved successfully");
    } catch (err) {
      toast.error("Failed to save changes");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <BouncingDotsLoader />;

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Restaurant Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your restaurant details and preferences
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving || !hasChanges}
          className="w-full md:w-auto"
        >
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Changes
          {hasChanges && !saving && (
            <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
              Unsaved
            </span>
          )}
        </Button>
      </div>

      <div className="space-y-8">
        {/* Restaurant Information Section */}
        <div className="bg-white rounded-lg border p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-6 pb-2 border-b">Restaurant Information</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Business Name</Label>
                <Input
                  id="name"
                  value={restaurant.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={restaurant.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder="Enter your restaurant address"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2 flex items-center justify-between">
                <div>
                  <Label htmlFor="isOrder">Enable Online Orders</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow customers to place orders online
                  </p>
                </div>
                <Switch
                  id="isOrder"
                  checked={!!restaurant.settings.isOrder}
                  onCheckedChange={(checked) => handleSettingsChange("isOrder", checked)}
                />
              </div>

              <div className="space-y-2 flex items-center justify-between">
                <div>
                  <Label htmlFor="isGrid">Display Menu as Grid</Label>
                  <p className="text-sm text-muted-foreground">
                    Show menu items in a grid layout instead of list
                  </p>
                </div>
                <Switch
                  id="isGrid"
                  checked={!!restaurant.settings.isGrid}
                  onCheckedChange={(checked) => handleSettingsChange("isGrid", checked)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="bg-white rounded-lg border p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-6 pb-2 border-b">Contact Information</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp Number</Label>
                <Input
                  id="whatsapp"
                  value={restaurant.whatsapp}
                  onChange={(e) => handleChange("whatsapp", e.target.value)}
                  required
                  placeholder="+91XXXXXXXXXX"
                />
                <p className="text-sm text-muted-foreground">
                  Customers will contact you on this number
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={restaurant.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+91XXXXXXXXXX"
                />
                <p className="text-sm text-muted-foreground">
                  Additional contact number (optional)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="bg-white rounded-lg border p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-6 pb-2 border-b">Social Media</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram Handle</Label>
                <Input
                  id="instagram"
                  value={restaurant.instagram}
                  onChange={(e) => handleChange("instagram", e.target.value)}
                  placeholder="@yourhandle"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook Page</Label>
                <Input
                  id="facebook"
                  placeholder="https://facebook.com/yourpage"
                  value={restaurant.settings.facebook || ""}
                  onChange={(e) => handleSettingsChange("facebook", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {hasChanges && (
        <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-amber-200 flex items-center gap-4">
          <div className="text-amber-800">You have unsaved changes</div>
          <Button
            onClick={handleSave}
            disabled={saving}
            size="sm"
            className="bg-amber-600 hover:bg-amber-700"
          >
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save
          </Button>
        </div>
      )}
    </div>
  );
}