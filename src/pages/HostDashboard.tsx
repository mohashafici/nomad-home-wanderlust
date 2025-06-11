
import { Link } from "react-router-dom";
import { Plus, Edit, Eye, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Header from "@/components/Header";
import { useHostProperties } from "@/hooks/useProperties";
import { useAuth } from "@/contexts/AuthContext";

const HostDashboard = () => {
  const { data: properties, isLoading } = useHostProperties();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Please Sign In</h1>
          <p className="text-gray-600 mb-8">You need to be signed in to access your dashboard.</p>
          <Button asChild>
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Host Dashboard</h1>
            <p className="text-gray-600">Manage your properties and bookings</p>
          </div>
          <Button asChild>
            <Link to="/become-host" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Property
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{properties?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {properties?.filter(p => p.is_active).length || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">This Month's Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>
        </div>

        {/* Properties List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Properties</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center space-x-4">
                    <div className="bg-gray-200 h-16 w-24 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="bg-gray-200 h-4 rounded w-1/3"></div>
                      <div className="bg-gray-200 h-3 rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : properties && properties.length > 0 ? (
              <div className="space-y-4">
                {properties.map((property) => (
                  <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <img
                        src={property.images?.[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=100"}
                        alt={property.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <h3 className="font-medium">{property.title}</h3>
                        <p className="text-sm text-gray-600">
                          {property.city}, {property.state}
                        </p>
                        <p className="text-sm text-gray-500">
                          ${property.price_per_night}/night • {property.max_guests} guests
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        property.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {property.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Property
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Property
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No properties yet</h3>
                <p className="text-gray-600 mb-4">Start earning by listing your first property!</p>
                <Button asChild>
                  <Link to="/become-host">Add Your First Property</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HostDashboard;
