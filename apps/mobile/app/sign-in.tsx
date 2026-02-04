import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { signInWithGoogle } from "../src/lib/googleSignIn";
import { useAppTheme } from "../src/ui/useAppTheme";

export default function SignIn() {
  const { t } = useAppTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn() {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle();
      router.replace("/clipboard");
    } catch (err: any) {
      setError(err.message ?? "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={[styles.page, { backgroundColor: t.bg }]}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: t.text }]}>Sign in</Text>

        <Text style={[styles.sub, { color: t.textMuted }]}>
          Your clipboard, synced across devices. Text only.
        </Text>

        <Pressable
          onPress={handleSignIn}
          disabled={loading}
          style={[
            styles.button,
            {
              backgroundColor: t.accent,
              opacity: loading ? 0.6 : 1,
            },
          ]}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Continue with Google</Text>
          )}
        </Pressable>

        {error && (
          <Text style={[styles.error, { color: t.textSoft }]}>{error}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -1,
  },
  sub: {
    marginTop: 12,
    fontSize: 14.5,
    lineHeight: 22,
  },
  button: {
    marginTop: 28,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  error: {
    marginTop: 16,
    fontSize: 13,
  },
});
