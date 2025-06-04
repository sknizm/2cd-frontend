import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, User, Phone, Mail, Globe, Calendar, Download, Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { config } from "@/lib/config";
import { format } from "date-fns";

type User = {
  id: string;
  email: string;
  slug: string;
  whatsapp_number: string;
  created_at: string;
  is_active: boolean;
};

export function UsersPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await fetch(`${config.backend_url}/api/admin/all-users`);
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    }
  });

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
            <Mail className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="font-medium">{row.getValue("email")}</p>
            <p className="text-xs text-muted-foreground">ID: {row.original.id}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "slug",
      header: "Restaurant",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-muted-foreground" />
          {row.getValue("slug") ? (
            <Badge variant="outline" className="font-mono">
              {row.getValue("slug")}
            </Badge>
          ) : (
            <span className="text-muted-foreground">Not set</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "whatsapp_number",
      header: "Contact",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-muted-foreground" />
          {row.getValue("whatsapp_number") ? (
            <a 
              href={`https://wa.me/${row.getValue("whatsapp_number")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {row.getValue("whatsapp_number")}
            </a>
          ) : (
            <span className="text-muted-foreground">Not provided</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Joined",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="w-4 h-4" />
          {format(new Date(row.getValue("created_at")), 'MMM dd, yyyy')}
        </div>
      ),
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.getValue("is_active") ? "default" : "destructive"}>
          {row.getValue("is_active") ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(row.original.id)}
              >
                Copy User ID
              </DropdownMenuItem>
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem>Edit User</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                Delete User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage all registered users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 rounded-lg border border-dashed">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium">Failed to load users</h3>
              <p className="text-sm text-muted-foreground">
                Please try again later or contact support
              </p>
              <Button variant="outline" className="mt-4">
                Retry
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Users Management</h2>
          <p className="text-muted-foreground">
            View and manage all registered users
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Download className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>
          <Button size="sm" className="h-8 gap-1">
            <Plus className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add User
            </span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription>
                {isLoading ? "Loading..." : `Total ${data?.length || 0} users`}
              </CardDescription>
            </div>
            {/* Add search/filter components here if needed */}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={data || []}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}