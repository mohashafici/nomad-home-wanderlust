
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type Property = Tables<'properties'>;
type PropertyInsert = TablesInsert<'properties'>;
type PropertyUpdate = TablesUpdate<'properties'>;

export const useProperties = () => {
  return useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      console.log('Fetching all properties...');
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching properties:', error);
        throw error;
      }

      console.log('Properties fetched:', data);
      return data as Property[];
    },
  });
};

export const useProperty = (id: string) => {
  return useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      console.log('Fetching property:', id);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching property:', error);
        throw error;
      }

      console.log('Property fetched:', data);
      return data as Property;
    },
    enabled: !!id,
  });
};

export const useHostProperties = () => {
  return useQuery({
    queryKey: ['host-properties'],
    queryFn: async () => {
      console.log('Fetching host properties...');
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching host properties:', error);
        throw error;
      }

      console.log('Host properties fetched:', data);
      return data as Property[];
    },
  });
};

export const useCreateProperty = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (propertyData: Omit<PropertyInsert, 'host_id'>) => {
      console.log('Creating property:', propertyData);
      const { data, error } = await supabase
        .from('properties')
        .insert([{
          ...propertyData,
          host_id: (await supabase.auth.getUser()).data.user?.id || '',
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating property:', error);
        throw error;
      }

      console.log('Property created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['host-properties'] });
      toast({
        title: "Success!",
        description: "Property created successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Create property error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create property.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...propertyData }: PropertyUpdate & { id: string }) => {
      console.log('Updating property:', { id, ...propertyData });
      const { data, error } = await supabase
        .from('properties')
        .update(propertyData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating property:', error);
        throw error;
      }

      console.log('Property updated:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['host-properties'] });
      toast({
        title: "Success!",
        description: "Property updated successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Update property error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update property.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (propertyId: string) => {
      console.log('Deleting property:', propertyId);
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);

      if (error) {
        console.error('Error deleting property:', error);
        throw error;
      }

      console.log('Property deleted:', propertyId);
      return propertyId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['host-properties'] });
      toast({
        title: "Success!",
        description: "Property deleted successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Delete property error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete property.",
        variant: "destructive",
      });
    },
  });
};
