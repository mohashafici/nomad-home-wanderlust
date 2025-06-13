
import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import type { Tables } from "@/integrations/supabase/types";

type Property = Tables<'properties'>;

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleCardClick = () => {
    console.log("Navigate to property detail:", property.id);
    // TODO: Navigate to property detail page
  };

  // Use the first image if available, otherwise use a placeholder
  const imageUrl = property.images && property.images.length > 0 
    ? property.images[0] 
    : "/placeholder.svg";

  // Create location string from city and state
  const location = `${property.city}, ${property.state}`;

  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
      onClick={handleCardClick}
    >
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white"
          onClick={handleFavoriteClick}
        >
          <Heart 
            className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
          />
        </Button>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900 truncate">{property.title}</h3>
          {property.average_rating && property.total_reviews ? (
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{property.average_rating}</span>
              <span className="text-sm text-gray-500">({property.total_reviews})</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-gray-300" />
              <span className="text-sm text-gray-500">New</span>
            </div>
          )}
        </div>
        
        <p className="text-gray-600 text-sm mb-2">{location}</p>
        <p className="text-gray-500 text-xs mb-3">{property.property_type}</p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {property.amenities?.slice(0, 3).map((amenity) => (
            <span 
              key={amenity}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
            >
              {amenity}
            </span>
          ))}
          {property.amenities && property.amenities.length > 3 && (
            <span className="text-xs text-gray-500">
              +{property.amenities.length - 3} more
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900">${property.price_per_night}</span>
            <span className="text-gray-500 text-sm"> / night</span>
          </div>
          <div className="text-xs text-gray-500">
            {property.max_guests} guests • {property.bedrooms} bed • {property.bathrooms} bath
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
