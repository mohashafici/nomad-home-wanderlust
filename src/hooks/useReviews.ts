
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

type Review = Tables<'reviews'>;
type ReviewInsert = TablesInsert<'reviews'>;

export const useReviews = (propertyId?: string) => {
  return useQuery({
    queryKey: ['reviews', propertyId],
    queryFn: async () => {
      console.log('Fetching reviews for property:', propertyId);
      let query = supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (propertyId) {
        query = query.eq('property_id', propertyId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching reviews:', error);
        throw error;
      }

      console.log('Reviews fetched:', data);
      return data as Review[];
    },
    enabled: !!propertyId,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (reviewData: Omit<ReviewInsert, 'guest_id'>) => {
      console.log('Creating review:', reviewData);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('reviews')
        .insert([{
          ...reviewData,
          guest_id: user.id,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating review:', error);
        throw error;
      }

      console.log('Review created:', data);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast({
        title: "Success!",
        description: "Review submitted successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Create review error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit review.",
        variant: "destructive",
      });
    },
  });
};
