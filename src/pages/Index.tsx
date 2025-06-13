
import { useState } from "react";
import { Search, MapPin, Calendar, Users, Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import PropertyCard from "@/components/PropertyCard";
import { useProperties } from "@/hooks/useProperties";

const Index = () => {
  const [searchLocation, setSearchLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("1");
  
  const { data: properties, isLoading } = useProperties();

  // Mock data for featured properties (fallback if no real properties)
  const mockProperties = [
    {
      id: "1",
      title: "Cozy Beachfront Villa",
      address: "123 Beach Road",
      city: "Malibu",
      state: "California",
      country: "United States",
      postal_code: "90265",
      price_per_night: 299,
      average_rating: 4.9,
      total_reviews: 127,
      images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800"],
      host_id: "host1",
      amenities: ["WiFi", "Pool", "Kitchen", "AC"],
      property_type: "Villa",
      description: "Beautiful beachfront villa with stunning ocean views",
      bedrooms: 3,
      bathrooms: 2,
      max_guests: 6,
      latitude: 34.0259,
      longitude: -118.7798,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "2",
      title: "Modern Downtown Loft",
      address: "456 Downtown Ave",
      city: "New York",
      state: "NY",
      country: "United States",
      postal_code: "10001",
      price_per_night: 189,
      average_rating: 4.8,
      total_reviews: 89,
      images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800"],
      host_id: "host2",
      amenities: ["WiFi", "Gym", "Kitchen", "Workspace"],
      property_type: "Loft",
      description: "Stylish loft in the heart of downtown",
      bedrooms: 2,
      bathrooms: 1,
      max_guests: 4,
      latitude: 40.7589,
      longitude: -73.9851,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "3",
      title: "Rustic Mountain Cabin",
      address: "789 Mountain Trail",
      city: "Aspen",
      state: "Colorado",
      country: "United States",
      postal_code: "81611",
      price_per_night: 225,
      average_rating: 4.7,
      total_reviews: 203,
      images: ["https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=800"],
      host_id: "host3",
      amenities: ["WiFi", "Fireplace", "Kitchen", "Hot Tub"],
      property_type: "Cabin",
      description: "Cozy cabin perfect for mountain getaways",
      bedrooms: 4,
      bathrooms: 3,
      max_guests: 8,
      latitude: 39.1911,
      longitude: -106.8175,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "4",
      title: "Luxury City Penthouse",
      address: "321 Luxury Lane",
      city: "Miami",
      state: "Florida",
      country: "United States",
      postal_code: "33101",
      price_per_night: 450,
      average_rating: 4.9,
      total_reviews: 76,
      images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800"],
      host_id: "host4",
      amenities: ["WiFi", "Pool", "Gym", "Concierge"],
      property_type: "Penthouse",
      description: "Stunning penthouse with panoramic city views",
      bedrooms: 5,
      bathrooms: 4,
      max_guests: 10,
      latitude: 25.7617,
      longitude: -80.1918,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  // Use real properties if available, otherwise use mock data
  const displayProperties = properties && properties.length > 0 
    ? properties.slice(0, 4)
    : mockProperties;

  const handleSearch = () => {
    console.log("Searching for:", { searchLocation, checkIn, checkOut, guests });
    // TODO: Implement search functionality
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-rose-50 to-orange-50 py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Find your perfect stay
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Discover unique accommodations around the world, from cozy cabins to luxury villas
          </p>
          
          {/* Search Bar */}
          <Card className="max-w-4xl mx-auto p-6 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Where are you going?"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="date"
                  placeholder="Check in"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="date"
                  placeholder="Check out"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="number"
                  placeholder="Guests"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  min="1"
                  className="pl-10"
                />
              </div>
            </div>
            <Button 
              onClick={handleSearch}
              className="w-full md:w-auto mt-4 bg-rose-500 hover:bg-rose-600 text-white px-8 py-3"
              size="lg"
            >
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </Card>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Featured Stays
          </h2>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="space-y-2">
                    <div className="bg-gray-200 h-4 rounded"></div>
                    <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Beachfront", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400" },
              { name: "Cabins", image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=400" },
              { name: "Luxury", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=400" },
              { name: "City", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=400" }
            ].map((category) => (
              <Card key={category.name} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                <div className="relative h-32">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <h3 className="text-white font-semibold text-lg">{category.name}</h3>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
