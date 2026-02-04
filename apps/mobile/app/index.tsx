import { View, Text, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useAppTheme } from "../src/ui/useAppTheme";

export default function Home() {
  const { t } = useAppTheme();

  return (
    <View style={[styles.page, { backgroundColor: t.bg }]}>
      <View style={styles.container}>
        <Text style={[styles.h1, { color: t.text }]}>Crossclip</Text>
        <View style={styles.actions}>
          <Pressable
            onPress={() => router.push("/sign-in")}
            style={[
              styles.btn,
              {
                backgroundColor: t.accent,
                borderColor: t.accent,
              },
            ]}
          >
            <Text style={[styles.btnText, { color: "white" }]}>
              Sign in with Google
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/clipboard")}
            style={[
              styles.btnGhost,
              {
                backgroundColor: t.surface2,
                borderColor: t.borderStrong,
              },
            ]}
          >
            <Text style={[styles.btnText, { color: t.text }]}>
              Open clipboard
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 28,
  },
  h1: {
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -1.1,
  },
  sub: {
    marginTop: 12,
    lineHeight: 22,
    fontSize: 14.5,
  },
  cards: {
    marginTop: 26,
    gap: 18,
  },
  actions: {
    marginTop: 26,
    gap: 12,
  },
  btn: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    opacity: 0.96,
  },
  btnGhost: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    opacity: 0.95,
  },
  btnText: {
    fontWeight: "700",
    letterSpacing: -0.2,
  },
});
