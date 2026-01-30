import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  username?: string;
}

async function fetchUser(): Promise<User | null> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email || '',
      username: user.user_metadata?.username,
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

async function logout(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error logging out:', error);
  }
}

export function useAuth() {
  const queryClient = useQueryClient();
  const [isReady, setIsReady] = useState(false);
  
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    queryFn: fetchUser,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Listen for auth state changes
  useEffect(() => {
    setIsReady(true);
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    });

    return () => subscription?.unsubscribe();
  }, [queryClient]);

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(["/api/auth/user"], null);
    },
  });

  return {
    user,
    isLoading: isLoading || !isReady,
    isAuthenticated: !!user,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}
