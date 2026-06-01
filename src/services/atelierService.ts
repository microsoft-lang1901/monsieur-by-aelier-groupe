import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCurrentClientIdentity } from "./authService";
import { supabase } from "./supabaseClient";

export type AtelierRequestPayload = {
  subject: string;
  notes: string;
  preferredContact: "email" | "phone";
};

export type AtelierRequest = AtelierRequestPayload & {
  id: string;
  userId: string;
  status: "received";
  createdAt: string;
};

const atelierRequestsKey = "monsieur.atelierRequests";

export async function createAtelierRequest(userId: string, payload: AtelierRequestPayload) {
  if (supabase && userId !== "local-client") {
    const { data, error } = await supabase
      .from("atelier_requests")
      .insert({
        user_id: userId,
        subject: payload.subject,
        notes: payload.notes,
        preferred_contact: payload.preferredContact,
        status: "received"
      })
      .select("id, user_id, subject, notes, preferred_contact, status, created_at")
      .single();

    if (!error && data) return mapAtelierRequest(data);
  }

  const request: AtelierRequest = {
    id: `${userId}-${Date.now()}`,
    userId,
    ...payload,
    status: "received",
    createdAt: new Date().toISOString()
  };
  const current = await getAtelierRequests();
  await AsyncStorage.setItem(atelierRequestsKey, JSON.stringify([request, ...current]));
  return request;
}

export async function getAtelierRequests(): Promise<AtelierRequest[]> {
  const identity = await getCurrentClientIdentity();
  if (supabase && identity.isAuthenticated) {
    const { data, error } = await supabase
      .from("atelier_requests")
      .select("id, user_id, subject, notes, preferred_contact, status, created_at")
      .eq("user_id", identity.id)
      .order("created_at", { ascending: false });

    if (!error && data) return data.map(mapAtelierRequest);
  }

  const raw = await AsyncStorage.getItem(atelierRequestsKey);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isAtelierRequest) : [];
  } catch {
    return [];
  }
}

function isAtelierRequest(value: unknown): value is AtelierRequest {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<AtelierRequest>;
  return typeof candidate.id === "string" && typeof candidate.userId === "string" && candidate.status === "received";
}

function mapAtelierRequest(value: {
  id: string;
  user_id: string;
  subject: string;
  notes: string;
  preferred_contact: "email" | "phone";
  status: "received";
  created_at: string;
}): AtelierRequest {
  return {
    id: value.id,
    userId: value.user_id,
    subject: value.subject,
    notes: value.notes,
    preferredContact: value.preferred_contact,
    status: value.status,
    createdAt: value.created_at
  };
}
