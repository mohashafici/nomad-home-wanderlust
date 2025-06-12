
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

type Booking = Tables<'bookings'>;
type BookingInsert = TablesInsert<'bookings'>;

export const useBookings = () => {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      console.log('Fetching user bookings...');
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          properties (
            id,
            title,
            city,
            state,
            images,
            price_per_night
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
        throw error;
      }

      console.log('Bookings fetched:', data);
      return data;
    },
  });
};

export const useHostBookings = () => {
  return useQuery({
    queryKey: ['host-bookings'],
    queryFn: async () => {
      console.log('Fetching host bookings...');
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          properties!inner (
            id,
            title,
            city,
            state,
            images,
            price_per_night,
            host_id
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching host bookings:', error);
        throw error;
      }

      console.log('Host bookings fetched:', data);
      return data;
    },
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (bookingData: Omit<BookingInsert, 'guest_id'>) => {
      console.log('Creating booking:', bookingData);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('bookings')
        .insert([{
          ...bookingData,
          guest_id: user.id,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating booking:', error);
        throw error;
      }

      console.log('Booking created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['host-bookings'] });
      toast({
        title: "Success!",
        description: "Booking created successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Create booking error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create booking.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string; status: string }) => {
      console.log('Updating booking status:', { bookingId, status });
      const { data, error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId)
        .select()
        .single();

      if (error) {
        console.error('Error updating booking:', error);
        throw error;
      }

      console.log('Booking updated:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['host-bookings'] });
      toast({
        title: "Success!",
        description: "Booking status updated successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Update booking error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update booking.",
        variant: "destructive",
      });
    },
  });
};
