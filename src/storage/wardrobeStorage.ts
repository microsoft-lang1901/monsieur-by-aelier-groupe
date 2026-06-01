import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCurrentClientIdentity } from "../services/authService";
import { supabase } from "../services/supabaseClient";

const savedPiecesKey = "monsieur.savedPieces";
const recentlyViewedKey = "monsieur.recentlyViewed";

export async function getSavedPieces(userId?: string): Promise<string[]> {
  const identity = userId ? { id: userId, isAuthenticated: true } : await getCurrentClientIdentity();
  if (supabase && identity.isAuthenticated) {
    const { data, error } = await supabase
      .from("wardrobe_items")
      .select("sku")
      .eq("user_id", identity.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      return data.map((item) => item.sku).filter((sku): sku is string => typeof sku === "string");
    }
  }

  return readList(savedPiecesKey);
}

export async function saveToWardrobe(userId: string, sku: string): Promise<string[]> {
  if (supabase && userId !== "local-client") {
    const { error } = await supabase.from("wardrobe_items").upsert({ user_id: userId, sku });
    if (!error) return getSavedPieces(userId);
  }

  const current = await readList(savedPiecesKey);
  const next = Array.from(new Set([sku, ...current]));
  await AsyncStorage.setItem(savedPiecesKey, JSON.stringify(next));
  return next;
}

export async function removeFromWardrobe(sku: string, userId?: string): Promise<string[]> {
  const identity = userId ? { id: userId, isAuthenticated: true } : await getCurrentClientIdentity();
  if (supabase && identity.isAuthenticated) {
    const { error } = await supabase.from("wardrobe_items").delete().eq("user_id", identity.id).eq("sku", sku);
    if (!error) return getSavedPieces(identity.id);
  }

  const current = await readList(savedPiecesKey);
  const next = current.filter((item) => item !== sku);
  await AsyncStorage.setItem(savedPiecesKey, JSON.stringify(next));
  return next;
}

export async function getRecentlyViewed(): Promise<string[]> {
  return readList(recentlyViewedKey);
}

export async function recordRecentlyViewed(sku: string): Promise<string[]> {
  const current = await readList(recentlyViewedKey);
  const next = Array.from(new Set([sku, ...current])).slice(0, 12);
  await AsyncStorage.setItem(recentlyViewedKey, JSON.stringify(next));
  return next;
}

async function readList(key: string): Promise<string[]> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}
