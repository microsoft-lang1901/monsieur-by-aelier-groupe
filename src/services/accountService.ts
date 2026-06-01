import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCurrentClientIdentity } from "./authService";
import { supabase } from "./supabaseClient";

export type ClientProfile = {
  id: string;
  name: string;
  city: string;
  notificationsEnabled: boolean;
};

export type AtelierOrder = {
  id: string;
  createdAt: string;
  status: "confirmed" | "inPreparation" | "complete";
  totalUsd: number;
};

const profileKey = "monsieur.clientProfile";
const ordersKey = "monsieur.atelierOrders";

const defaultProfile: ClientProfile = {
  id: "local-client",
  name: "Private Client",
  city: "Paris / Seoul",
  notificationsEnabled: false
};

export async function getClientProfile(): Promise<ClientProfile> {
  const identity = await getCurrentClientIdentity();
  if (supabase && identity.isAuthenticated) {
    const { data, error } = await supabase
      .from("client_profiles")
      .select("id, display_name, city, notifications_enabled")
      .eq("id", identity.id)
      .maybeSingle();

    if (!error && data) {
      return {
        id: data.id,
        name: data.display_name,
        city: data.city ?? "",
        notificationsEnabled: Boolean(data.notifications_enabled)
      };
    }
  }

  const raw = await AsyncStorage.getItem(profileKey);
  if (!raw) return defaultProfile;

  try {
    return { ...defaultProfile, ...JSON.parse(raw) };
  } catch {
    return defaultProfile;
  }
}

export async function saveClientProfile(profile: ClientProfile): Promise<ClientProfile> {
  if (supabase && profile.id !== "local-client") {
    const { error } = await supabase.from("client_profiles").upsert({
      id: profile.id,
      display_name: profile.name,
      city: profile.city,
      notifications_enabled: profile.notificationsEnabled
    });

    if (!error) return profile;
  }

  await AsyncStorage.setItem(profileKey, JSON.stringify(profile));
  return profile;
}

export async function getAtelierOrders(): Promise<AtelierOrder[]> {
  const identity = await getCurrentClientIdentity();
  if (supabase && identity.isAuthenticated) {
    const { data, error } = await supabase
      .from("atelier_orders")
      .select("id, created_at, status, total_usd")
      .eq("user_id", identity.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      return data.map((order) => ({
        id: order.id,
        createdAt: order.created_at,
        status: normalizeOrderStatus(order.status),
        totalUsd: order.total_usd
      }));
    }
  }

  const raw = await AsyncStorage.getItem(ordersKey);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isAtelierOrder) : [];
  } catch {
    return [];
  }
}

export async function recordAtelierOrder(order: AtelierOrder): Promise<AtelierOrder[]> {
  const identity = await getCurrentClientIdentity();
  if (supabase && identity.isAuthenticated) {
    const { error } = await supabase.from("atelier_orders").upsert({
      id: order.id,
      user_id: identity.id,
      status: order.status,
      total_usd: order.totalUsd,
      created_at: order.createdAt
    });

    if (!error) return getAtelierOrders();
  }

  const current = await getAtelierOrders();
  const next = [order, ...current.filter((item) => item.id !== order.id)];
  await AsyncStorage.setItem(ordersKey, JSON.stringify(next));
  return next;
}

function isAtelierOrder(value: unknown): value is AtelierOrder {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<AtelierOrder>;
  return typeof candidate.id === "string" && typeof candidate.createdAt === "string" && typeof candidate.totalUsd === "number";
}

function normalizeOrderStatus(status: string): AtelierOrder["status"] {
  if (status === "complete") return "complete";
  if (status === "preparing" || status === "inPreparation") return "inPreparation";
  return "confirmed";
}
