import { supabase } from "./supabaseClient";

export type ClientIdentity = {
  id: string;
  isAuthenticated: boolean;
};

const localClientIdentity: ClientIdentity = {
  id: "local-client",
  isAuthenticated: false
};

export async function getCurrentClientIdentity(): Promise<ClientIdentity> {
  if (!supabase) return localClientIdentity;

  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user?.id) {
    return localClientIdentity;
  }

  return {
    id: data.user.id,
    isAuthenticated: true
  };
}

export async function signOutClient(): Promise<void> {
  if (!supabase) return;
  await supabase.auth.signOut();
}
