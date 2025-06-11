
-- Create properties table
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  host_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  property_type TEXT NOT NULL DEFAULT 'house',
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'United States',
  postal_code TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  price_per_night DECIMAL(10, 2) NOT NULL,
  max_guests INTEGER NOT NULL DEFAULT 1,
  bedrooms INTEGER NOT NULL DEFAULT 1,
  bathrooms INTEGER NOT NULL DEFAULT 1,
  amenities TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on properties table
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Create policy that allows anyone to view active properties
CREATE POLICY "Anyone can view active properties" 
  ON public.properties 
  FOR SELECT 
  USING (is_active = true);

-- Create policy that allows hosts to view their own properties
CREATE POLICY "Hosts can view their own properties" 
  ON public.properties 
  FOR SELECT 
  USING (auth.uid() = host_id);

-- Create policy that allows hosts to create properties
CREATE POLICY "Hosts can create properties" 
  ON public.properties 
  FOR INSERT 
  WITH CHECK (auth.uid() = host_id);

-- Create policy that allows hosts to update their own properties
CREATE POLICY "Hosts can update their own properties" 
  ON public.properties 
  FOR UPDATE 
  USING (auth.uid() = host_id);

-- Create policy that allows hosts to delete their own properties
CREATE POLICY "Hosts can delete their own properties" 
  ON public.properties 
  FOR DELETE 
  USING (auth.uid() = host_id);

-- Create trigger to automatically update updated_at for properties
CREATE TRIGGER handle_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
