import { ScrollView, Switch, Text, View } from "react-native";
import { useEffect, useState } from "react";
import {
  getAtelierOrders,
  getClientProfile,
  saveClientProfile,
  type AtelierOrder,
  type ClientProfile
} from "@/services/accountService";
import { createAtelierRequest, getAtelierRequests, type AtelierRequest } from "@/services/atelierService";
import { getCurrentClientIdentity, signOutClient } from "@/services/authService";
import { trackEvent } from "@/services/analytics";
import { PrimaryCTA } from "@/components/PrimaryCTA";
import { sharedStyles } from "@/theme/styles";
import { colors, spacing, typography } from "@/theme/tokens";

export default function AccountScreen() {
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [orders, setOrders] = useState<AtelierOrder[]>([]);
  const [requests, setRequests] = useState<AtelierRequest[]>([]);

  useEffect(() => {
    getClientProfile().then(setProfile);
    getAtelierOrders().then(setOrders);
    getAtelierRequests().then(setRequests);
  }, []);

  async function updateNotifications(enabled: boolean) {
    if (!profile) return;
    const next = await saveClientProfile({ ...profile, notificationsEnabled: enabled });
    setProfile(next);
  }

  async function requestConsultation() {
    const identity = await getCurrentClientIdentity();
    const request = await createAtelierRequest(identity.id, {
      subject: "Wardrobe Consultation",
      notes: "Client requested a private wardrobe consultation from the account dossier.",
      preferredContact: "email"
    });
    await trackEvent({ name: "atelier_request_created", requestId: request.id });
    setRequests([request, ...requests]);
  }

  async function signOut() {
    await signOutClient();
    const nextProfile = await getClientProfile();
    setProfile(nextProfile);
  }

  return (
    <ScrollView style={sharedStyles.screen} contentContainerStyle={sharedStyles.scrollContent}>
      <View style={[sharedStyles.constrained, { gap: spacing.xl }]}>
        <View style={{ gap: spacing.sm }}>
          <Text style={sharedStyles.label}>Client Profile</Text>
          <Text style={sharedStyles.title}>{profile?.name ?? "Client"}</Text>
          <Text style={sharedStyles.body}>{profile?.city ?? "Location pending"}</Text>
        </View>

        <View style={{ gap: spacing.sm }}>
          <Text style={sharedStyles.label}>Collection Archive</Text>
          <Text style={sharedStyles.body}>Acquired and saved collection pieces will be shown here.</Text>
        </View>

        <View style={{ gap: spacing.sm }}>
          <Text style={sharedStyles.label}>Atelier Orders</Text>
          {orders.length === 0 ? (
            <Text style={sharedStyles.body}>No atelier orders are recorded.</Text>
          ) : (
            orders.map((order) => (
              <Text key={order.id} style={[typography.body, { color: colors.espresso }]}>
                {order.id} / ${order.totalUsd.toLocaleString("en-US")}
              </Text>
            ))
          )}
        </View>

        <View style={{ gap: spacing.sm }}>
          <Text style={sharedStyles.label}>Notification Preferences</Text>
          <Switch
            accessibilityLabel="Enable private client notifications"
            value={profile?.notificationsEnabled ?? false}
            onValueChange={updateNotifications}
            trackColor={{ false: colors.line, true: colors.olive }}
            thumbColor={colors.paper}
          />
        </View>

        <View style={{ gap: spacing.sm }}>
          <Text style={sharedStyles.label}>Atelier Services</Text>
          <Text style={sharedStyles.body}>Private consultation requests are prepared for the service layer without adding another tab.</Text>
          <PrimaryCTA label="Request Consultation" onPress={requestConsultation} />
          {requests.length > 0 ? (
            <Text style={[typography.body, { color: colors.espresso }]}>
              {requests.length} atelier {requests.length === 1 ? "request" : "requests"} recorded.
            </Text>
          ) : null}
        </View>

        <View style={{ gap: spacing.sm }}>
          <Text style={sharedStyles.label}>Session</Text>
          <PrimaryCTA label="Sign Out" onPress={signOut} />
        </View>
      </View>
    </ScrollView>
  );
}
