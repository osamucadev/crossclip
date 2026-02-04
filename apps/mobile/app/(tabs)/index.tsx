import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaView, ScrollView, Text, View, Pressable } from "react-native";

const tokensLight = {
  bg: "#f4f4f6",
  surface: "#ffffff",
  textPrimary: "#0b0b0f",
  textSecondary: "#4b5563",
  textMuted: "#6b7280",
  border: "rgba(17, 24, 39, 0.14)",
  accent: "#5b2eff",
};

function ContextCard(props: {
  title: string;
  company: string;
  description: string;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        {
          paddingLeft: pressed ? 22 : 18,
          paddingVertical: 16,
          position: "relative",
        },
      ]}
    >
      <View
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 2,
          backgroundColor: tokensLight.accent,
          opacity: 0.25,
        }}
      />

      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 1,
          backgroundColor: "rgba(91, 46, 255, 0.35)",
          opacity: 0.55,
        }}
      />
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 1,
          backgroundColor: "rgba(91, 46, 255, 0.25)",
          opacity: 0.5,
        }}
      />

      <Text
        style={{
          fontSize: 22,
          fontWeight: "700",
          letterSpacing: -0.6,
          color: tokensLight.textPrimary,
          maxWidth: 320,
          lineHeight: 28,
        }}
      >
        {props.title}
      </Text>

      <Text
        style={{
          marginTop: 8,
          fontSize: 12,
          fontWeight: "700",
          letterSpacing: 1,
          textTransform: "uppercase",
          color: tokensLight.textMuted,
        }}
      >
        {props.company}
      </Text>

      <Text
        style={{
          marginTop: 12,
          fontSize: 16,
          lineHeight: 28,
          color: tokensLight.textSecondary,
          maxWidth: 520,
        }}
      >
        {props.description}
      </Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tokensLight.bg }}>
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 18,
          paddingBottom: 28,
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "800",
            letterSpacing: -1.2,
            color: tokensLight.textPrimary,
            marginBottom: 10,
          }}
        >
          Contexts
        </Text>

        <Text
          style={{
            fontSize: 16,
            lineHeight: 28,
            color: tokensLight.textSecondary,
            marginBottom: 22,
            maxWidth: 560,
          }}
        >
          Editorial cards, quiet structure, and a single accent line. Light is
          the default.
        </Text>

        <View style={{ gap: 22 }}>
          <ContextCard
            title="Black Friday at real scale"
            company="Pandora, Lacta"
            description="Extreme traffic, aggressive campaigns, and zero tolerance for instability."
          />
          <ContextCard
            title="Rebuild on unknown terrain"
            company="Americanas"
            description="No docs, emerging tech, critical timing. Explore runtime, document the invisible, ship anyway."
          />
          <ContextCard
            title="Journalism under national pressure"
            company="CNN Brasil"
            description="Elections coverage, realtime updates, high exposure. Predictability mattered."
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
