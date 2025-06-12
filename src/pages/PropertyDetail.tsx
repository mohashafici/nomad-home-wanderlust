
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Heart, Share, MapPin, Wifi, Car, Utensils, Tv } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "@/components/Header";
import { useProperty } from "@/hooks/useProperties";
import { useCreateBooking } from "@/hooks/useBookings";
import { useAuth } from "@/contexts/AuthContext";

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: property, isLoading } = useProperty(id || '');
  const createBooking = useCreateBooking();
  
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("1");
  const [isFavorite, setIsFavorite] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-pulse">Loading property...</div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Property Not Found</h1>
          <Button onClick={() => navigate('/properties')}>Back to Properties</Button>
        </div>
      </div>
    );
  }

  const amenities = [
    { icon: Wifi, name: "WiFi" },
    { icon: Car, name: "Free parking" },
    { icon: Utensils, name: "Kitchen" },
    { icon: Tv, name: "TV" }
  ];

  const handleBooking = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!checkIn || !checkOut) return;

    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * property.price_per_night;

    try {
      await createBooking.mutateAsync({
        property_id: property.id,
        check_in: checkIn,
        check_out: checkOut,
        guests: parseInt(guests),
        total_price: totalPrice,
      });
      navigate('/bookings');
    } catch (error) {
      console.error('Booking failed:', error);
    }
  };

  const calculateTotal = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return nights * property.price_per_night;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
            <div className="flex items-center space-x-4 text-gray-600">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">4.9</span>
                <span>(127 reviews)</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{property.city}, {property.state}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Button variant="outline" size="sm">
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Heart className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              Save
            </Button>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-8 h-96">
          <div className="md:col-span-2">
            <img 
              src={property.images?.[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1200"} 
              alt="Property main"
              className="w-full h-full object-cover rounded-l-lg"
            />
          </div>
          <div className="grid grid-rows-2 gap-2">
            <img 
              src={property.images?.[1] || "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=600"} 
              alt="Property"
              className="w-full h-full object-cover"
            />
            <img 
              src={property.images?.[2] || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=600"} 
              alt="Property"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-rows-2 gap-2">
            <img 
              src={property.images?.[3] || "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=600"} 
              alt="Property"
              className="w-full h-full object-cover"
            />
            <img 
              src={property.images?.[4] || "https://images.unsplash.com/photo-1566908829077-d35afd0c5d6d?auto=format&fit=crop&q=80&w=600"} 
              alt="Property"
              className="w-full h-full object-cover rounded-r-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Details */}
          <div className="lg:col-span-2">
            {/* Host Info */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">
                  Hosted by Host
                </h2>
                <p className="text-gray-600">
                  {property.max_guests} guests · {property.bedrooms} bedrooms · {property.bathrooms} bathrooms
                </p>
              </div>
              <Avatar className="h-12 w-12">
                <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b5bc?auto=format&fit=crop&q=80&w=150" />
                <AvatarFallback>H</AvatarFallback>
              </Avatar>
            </div>

            <Separator className="my-6" />

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">About this place</h3>
              <p className="text-gray-700 leading-relaxed">{property.description || "A wonderful place to stay."}</p>
            </div>

            <Separator className="my-6" />

            {/* Amenities */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">What this place offers</h3>
              <div className="grid grid-cols-2 gap-4">
                {(property.amenities || amenities.map(a => a.name)).map((amenity, index) => {
                  const amenityIcon = amenities.find(a => a.name === amenity)?.icon || Wifi;
                  const IconComponent = amenityIcon;
                  return (
                    <div key={index} className="flex items-center space-x-3">
                      <IconComponent className="h-5 w-5 text-gray-600" />
                      <span>{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold">${property.price_per_night}</span>
                    <span className="text-gray-600"> / night</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">4.9</span>
                  </div>
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="checkin">Check in</Label>
                      <Input
                        id="checkin"
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="checkout">Check out</Label>
                      <Input
                        id="checkout"
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="guests">Guests</Label>
                    <Input
                      id="guests"
                      type="number"
                      min="1"
                      max={property.max_guests}
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                    />
                  </div>
                  
                  <Button 
                    onClick={handleBooking}
                    className="w-full bg-rose-500 hover:bg-rose-600"
                    disabled={!checkIn || !checkOut || createBooking.isPending}
                  >
                    {createBooking.isPending ? 'Booking...' : 'Reserve'}
                  </Button>
                  
                  {checkIn && checkOut && (
                    <div className="space-y-2 pt-4 border-t">
                      <div className="flex justify-between">
                        <span>Total</span>
                        <span className="font-semibold">${calculateTotal()}</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
