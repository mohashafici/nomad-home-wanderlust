
import { useState } from "react";
import { Search, Filter, MapPin, DollarSign, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface SearchFiltersProps {
  onFiltersChange: (filters: any) => void;
  className?: string;
}

const amenitiesList = [
  "WiFi", "Kitchen", "Parking", "Pool", "Air Conditioning", "Heating",
  "TV", "Washer", "Dryer", "Pets Allowed", "Smoking Allowed", "Gym"
];

export const SearchFilters = ({ onFiltersChange, className }: SearchFiltersProps) => {
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [guests, setGuests] = useState(1);
  const [bedrooms, setBedrooms] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    const filters = {
      location,
      priceRange,
      guests,
      bedrooms,
      bathrooms,
      amenities: selectedAmenities,
      checkIn,
      checkOut,
    };
    console.log('Applying filters:', filters);
    onFiltersChange(filters);
  };

  const clearFilters = () => {
    setLocation("");
    setPriceRange([0, 1000]);
    setGuests(1);
    setBedrooms(0);
    setBathrooms(0);
    setSelectedAmenities([]);
    setCheckIn("");
    setCheckOut("");
    onFiltersChange({});
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const activeFiltersCount = [
    location,
    priceRange[0] > 0 || priceRange[1] < 1000,
    guests > 1,
    bedrooms > 0,
    bathrooms > 0,
    selectedAmenities.length > 0,
    checkIn,
    checkOut,
  ].filter(Boolean).length;

  return (
    <div className={className}>
      {/* Main Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-lg shadow-md">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <Input
              placeholder="Where are you going?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border-0 focus-visible:ring-0"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <Input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="border-0 focus-visible:ring-0"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <Input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="border-0 focus-visible:ring-0"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-gray-500" />
          <Input
            type="number"
            min="1"
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
            className="border-0 focus-visible:ring-0 w-16"
          />
        </div>

        <div className="flex space-x-2">
          <Popover open={showFilters} onOpenChange={setShowFilters}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="relative">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" side="bottom" align="end">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Price Range</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={1000}
                      min={0}
                      step={10}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Bedrooms</Label>
                    <Input
                      type="number"
                      min="0"
                      value={bedrooms}
                      onChange={(e) => setBedrooms(parseInt(e.target.value) || 0)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Bathrooms</Label>
                    <Input
                      type="number"
                      min="0"
                      value={bathrooms}
                      onChange={(e) => setBathrooms(parseInt(e.target.value) || 0)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Amenities</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto">
                    {amenitiesList.map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Checkbox
                          id={amenity}
                          checked={selectedAmenities.includes(amenity)}
                          onCheckedChange={() => toggleAmenity(amenity)}
                        />
                        <Label htmlFor={amenity} className="text-xs">
                          {amenity}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button onClick={clearFilters} variant="outline" className="flex-1">
                    Clear
                  </Button>
                  <Button onClick={handleSearch} className="flex-1">
                    Apply
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button onClick={handleSearch}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>
    </div>
  );
};
