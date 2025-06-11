
import { useState } from "react";
import { Calendar, MapPin, Star, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const MyBookings = () => {
  const { user } = useAuth();

  // Mock bookings data - in real app, this would come from Supabase
  const [bookings] = useState([
    {
      id: "1",
      property: {
        id: "prop1",
        title: "Modern Downtown Apartment",
        city: "San Francisco",
        state: "CA",
        images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=400"]
      },
      checkIn: "2024-01-15",
      checkOut: "2024-01-20",
      guests: 2,
      totalPrice: 750,
      status: "confirmed",
      bookingDate: "2023-12-01"
    },
    {
      id: "2",
      property: {
        id: "prop2",
        title: "Cozy Beach House",
        city: "Santa Monica",
        state: "CA",
        images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=400"]
      },
      checkIn: "2023-12-10",
      checkOut: "2023-12-15",
      guests: 4,
      totalPrice: 1200,
      status: "completed",
      bookingDate: "2023-11-01"
    },
    {
      id: "3",
      property: {
        id: "prop3",
        title: "Mountain Cabin Retreat",
        city: "Lake Tahoe",
        state: "CA",
        images: ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=400"]
      },
      checkIn: "2024-02-01",
      checkOut: "2024-02-05",
      guests: 6,
      totalPrice: 800,
      status: "pending",
      bookingDate: "2023-12-20"
    }
  ]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Please Sign In</h1>
          <p className="text-gray-600 mb-8">You need to be signed in to view your bookings.</p>
          <Button asChild>
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  const upcomingBookings = bookings.filter(booking => 
    booking.status === "confirmed" || booking.status === "pending"
  );
  
  const pastBookings = bookings.filter(booking => 
    booking.status === "completed"
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const BookingCard = ({ booking }: { booking: any }) => (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <img
            src={booking.property.images[0]}
            alt={booking.property.title}
            className="w-full md:w-32 h-32 object-cover rounded-lg"
          />
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">{booking.property.title}</h3>
              <Badge className={getStatusColor(booking.status)}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </Badge>
            </div>
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{booking.property.city}, {booking.property.state}</span>
            </div>
            <div className="flex items-center text-gray-600 mb-2">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{booking.checkIn} - {booking.checkOut}</span>
            </div>
            <div className="flex items-center text-gray-600 mb-4">
              <User className="h-4 w-4 mr-1" />
              <span>{booking.guests} guests</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-lg font-semibold">${booking.totalPrice} total</div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                {booking.status === "completed" && (
                  <Button variant="outline" size="sm">
                    <Star className="h-4 w-4 mr-1" />
                    Review
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">Track your reservations and travel history</p>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingBookings.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({pastBookings.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="mt-6">
            {upcomingBookings.length > 0 ? (
              upcomingBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming bookings</h3>
                  <p className="text-gray-600 mb-4">Start planning your next adventure!</p>
                  <Button asChild>
                    <Link to="/properties">Browse Properties</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="past" className="mt-6">
            {pastBookings.length > 0 ? (
              pastBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No past bookings</h3>
                  <p className="text-gray-600">Your booking history will appear here.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MyBookings;
