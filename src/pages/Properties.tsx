
import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import PropertyCard from "@/components/PropertyCard";
import { useProperties } from "@/hooks/useProperties";

const Properties = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const { data: properties, isLoading, error } = useProperties();

  console.log('Properties page - data:', properties, 'loading:', isLoading, 'error:', error);

  const filteredProperties = properties?.filter(property => 
    property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.state.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="bg-gray-200 h-4 rounded"></div>
                  <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Properties</h2>
            <p className="text-gray-600">Something went wrong. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search properties by location or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <Card className="p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Property Type</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="">All Types</option>
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="cabin">Cabin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Min Price</label>
                  <Input type="number" placeholder="$0" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Max Price</label>
                  <Input type="number" placeholder="$500" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Guests</label>
                  <Input type="number" placeholder="1" min="1" />
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Results */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {filteredProperties.length} Properties Found
          </h2>
          <p className="text-gray-600">
            Discover amazing places to stay around the world
          </p>
        </div>

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard 
                key={property.id} 
                property={{
                  id: Number(property.id.split('-')[0]) || 1,
                  title: property.title,
                  location: `${property.city}, ${property.state}`,
                  price: Number(property.price_per_night),
                  rating: 4.8,
                  reviews: 42,
                  image: property.images?.[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800",
                  host: "Host",
                  amenities: property.amenities || []
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Properties;
