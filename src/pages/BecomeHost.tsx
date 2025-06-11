
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateProperty } from "@/hooks/useProperties";
import { Home, DollarSign, Users, MapPin } from "lucide-react";

interface PropertyFormData {
  title: string;
  description: string;
  property_type: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  price_per_night: number;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
}

const BecomeHost = () => {
  const [step, setStep] = useState(1);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  const createProperty = useCreateProperty();

  const { register, handleSubmit, formState: { errors }, watch } = useForm<PropertyFormData>();

  const amenitiesList = [
    "WiFi", "Kitchen", "Washer", "Dryer", "AC", "Heating", "Pool", "Hot Tub",
    "Gym", "Parking", "TV", "Workspace", "Fireplace", "Balcony", "Garden", "Pet Friendly"
  ];

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const onSubmit = async (data: PropertyFormData) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await createProperty.mutateAsync({
        ...data,
        amenities: selectedAmenities,
        price_per_night: Number(data.price_per_night),
        max_guests: Number(data.max_guests),
        bedrooms: Number(data.bedrooms),
        bathrooms: Number(data.bathrooms),
      });
      navigate('/host-dashboard');
    } catch (error) {
      console.error('Error creating property:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Please Sign In</h1>
          <p className="text-gray-600 mb-8">You need to be signed in to become a host.</p>
          <Button onClick={() => navigate('/login')}>Sign In</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Become a Host</h1>
          <p className="text-gray-600">Share your space and earn extra income</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber ? 'bg-rose-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && <div className="w-12 h-1 bg-gray-200 mx-2"></div>}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Property Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Property Title</Label>
                  <Input
                    id="title"
                    {...register("title", { required: "Title is required" })}
                    placeholder="Beautiful beachfront villa"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="Describe your property..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="property_type">Property Type</Label>
                  <select
                    id="property_type"
                    {...register("property_type", { required: "Property type is required" })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select type</option>
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="cabin">Cabin</option>
                    <option value="condo">Condo</option>
                  </select>
                  {errors.property_type && (
                    <p className="text-sm text-red-600 mt-1">{errors.property_type.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      min="1"
                      {...register("bedrooms", { required: "Bedrooms required" })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      min="1"
                      {...register("bathrooms", { required: "Bathrooms required" })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="max_guests">Max Guests</Label>
                    <Input
                      id="max_guests"
                      type="number"
                      min="1"
                      {...register("max_guests", { required: "Max guests required" })}
                    />
                  </div>
                </div>

                <Button type="button" onClick={() => setStep(2)} className="w-full">
                  Next Step
                </Button>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    {...register("address", { required: "Address is required" })}
                    placeholder="123 Main Street"
                  />
                  {errors.address && (
                    <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      {...register("city", { required: "City is required" })}
                      placeholder="Los Angeles"
                    />
                    {errors.city && (
                      <p className="text-sm text-red-600 mt-1">{errors.city.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      {...register("state", { required: "State is required" })}
                      placeholder="California"
                    />
                    {errors.state && (
                      <p className="text-sm text-red-600 mt-1">{errors.state.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="postal_code">Postal Code</Label>
                  <Input
                    id="postal_code"
                    {...register("postal_code")}
                    placeholder="90210"
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>
                    Previous
                  </Button>
                  <Button type="button" onClick={() => setStep(3)} className="flex-1">
                    Next Step
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Pricing & Amenities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="price_per_night">Price per Night ($)</Label>
                  <Input
                    id="price_per_night"
                    type="number"
                    min="1"
                    {...register("price_per_night", { required: "Price is required" })}
                    placeholder="100"
                  />
                  {errors.price_per_night && (
                    <p className="text-sm text-red-600 mt-1">{errors.price_per_night.message}</p>
                  )}
                </div>

                <div>
                  <Label>Amenities</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {amenitiesList.map((amenity) => (
                      <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedAmenities.includes(amenity)}
                          onChange={() => toggleAmenity(amenity)}
                          className="rounded"
                        />
                        <span className="text-sm">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="button" variant="outline" onClick={() => setStep(2)}>
                    Previous
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1"
                    disabled={createProperty.isPending}
                  >
                    {createProperty.isPending ? "Creating..." : "Create Property"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </form>
      </div>
    </div>
  );
};

export default BecomeHost;
