
-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_id UUID REFERENCES auth.users NOT NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER NOT NULL DEFAULT 1,
  total_price DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  booking_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on bookings table
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policy that allows guests to view their own bookings
CREATE POLICY "Guests can view their own bookings" 
  ON public.bookings 
  FOR SELECT 
  USING (auth.uid() = guest_id);

-- Create policy that allows hosts to view bookings for their properties
CREATE POLICY "Hosts can view bookings for their properties" 
  ON public.bookings 
  FOR SELECT 
  USING (auth.uid() IN (
    SELECT host_id FROM public.properties WHERE id = property_id
  ));

-- Create policy that allows guests to create bookings
CREATE POLICY "Guests can create bookings" 
  ON public.bookings 
  FOR INSERT 
  WITH CHECK (auth.uid() = guest_id);

-- Create policy that allows guests to update their own bookings
CREATE POLICY "Guests can update their own bookings" 
  ON public.bookings 
  FOR UPDATE 
  USING (auth.uid() = guest_id);

-- Create policy that allows hosts to update bookings for their properties
CREATE POLICY "Hosts can update bookings for their properties" 
  ON public.bookings 
  FOR UPDATE 
  USING (auth.uid() IN (
    SELECT host_id FROM public.properties WHERE id = property_id
  ));

-- Create trigger to automatically update updated_at for bookings
CREATE TRIGGER handle_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Add constraint to ensure check_out is after check_in
ALTER TABLE public.bookings 
ADD CONSTRAINT check_dates_valid 
CHECK (check_out > check_in);
