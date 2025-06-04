import { useState, useEffect, useContext } from 'react';
import { format, parseISO } from 'date-fns';
import { Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { AppContext } from '@/context/AppContext';
import { config } from '@/lib/config';
import { Membership, Restaurant } from '@/lib/types';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

type MembershipWithRestaurant = Membership & {
  restaurant: Restaurant;
};

export default function MembershipsPage() {
  const [memberships, setMemberships] = useState<MembershipWithRestaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [dateEdits, setDateEdits] = useState<Record<string, { endDate: string }>>({});

  const context = useContext(AppContext);
  
  if (!context) {
    throw new Error("AppContext must be used within an AppProvider");
  }

  const { token } = context;

  useEffect(() => {
    fetchMemberships();
  }, [token]);

  const fetchMemberships = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${config.backend_url}/api/memberships`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!res.ok) throw new Error('Failed to fetch memberships');
      const data = await res.json();
      setMemberships(data);
    } catch (error) {
    if(error)
    toast.error("Failed to fetch memberships");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckActive = async () => {
    setUpdating(true);
    try {
      const res = await fetch(`${config.backend_url}/api/memberships/check-status`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to check memberships");
      }
      
      const data = await res.json();
      toast.success(data.message);
      fetchMemberships();
    } catch (error: unknown) {
        if(error)
      toast.error("Failed to check memberships");
    } finally {
      setUpdating(false);
    }
  };

  const handleDateChange = (id: string, field: "endDate", value: string) => {
    setDateEdits(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const handleSaveDate = async (id: string) => {
    const updates = dateEdits[id];
    if (!updates?.endDate) return;

    try {
      const res = await fetch(`${config.backend_url}/api/memberships/${id}`, {
        method: "PATCH",
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          end_date: updates.endDate
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update membership");
      }

      toast.success("Membership updated successfully");
      fetchMemberships();
      setDateEdits(prev => {
        const newEdits = { ...prev };
        delete newEdits[id];
        return newEdits;
      });
    } catch (error: unknown) {
        if(error)
      toast.error('Failed to update membership');
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "ACTIVE": return "default";
      case "EXPIRED": return "destructive";
      case "PAUSED": return "secondary";
      case "CANCELED": return "outline";
      default: return "outline";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <CardTitle>Membership Management</CardTitle>
        <Button onClick={handleCheckActive} disabled={updating} className="w-full sm:w-auto">
          {updating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Check Active Status
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">Restaurant</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="whitespace-nowrap">Start Date</TableHead>
                <TableHead className="whitespace-nowrap">End Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading memberships...
                    </div>
                  </TableCell>
                </TableRow>
              ) : memberships.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                    No memberships found
                  </TableCell>
                </TableRow>
              ) : (
                memberships.map((membership) => (
                  <TableRow key={membership.id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{membership.restaurant.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {membership.restaurant.slug}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(membership.status)} className="capitalize">
                        {membership.status.toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {format(parseISO(membership.startDate), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      {dateEdits[membership.id] ? (
                        <Input
                          type="date"
                          value={dateEdits[membership.id].endDate}
                          onChange={(e) => handleDateChange(membership.id, "endDate", e.target.value)}
                          className="w-[150px]"
                        />
                      ) : (
                        <span className="whitespace-nowrap">
                          {format(parseISO(membership.endDate), "MMM dd, yyyy")}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {dateEdits[membership.id] ? (
                          <Button
                            size="sm"
                            onClick={() => handleSaveDate(membership.id)}
                          >
                            Save
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDateChange(membership.id, "endDate", membership.endDate)}
                          >
                            Edit
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}