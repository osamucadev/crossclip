import { YStack, XStack, Text, Button, Spinner } from "tamagui";
import { router } from "expo-router";
import { useState } from "react";
import { signInWithGoogle } from "../src/lib/googleSignIn";
import { ThemeToggle } from "../src/components/ThemeToggle";

export default function SignIn() {
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
    <YStack flex={1} backgroundColor="$background">
      <YStack paddingTop="$16" paddingHorizontal="$5" paddingBottom="$4">
        {/* Header com ThemeToggle centralizado */}
        <XStack justifyContent="center" marginBottom="$6">
          <ThemeToggle />
        </XStack>

        <Text
          fontSize={32}
          fontWeight="700"
          color="$color"
          fontFamily="DMSans_700Bold"
          letterSpacing={-0.8}
          marginBottom="$3"
        >
          Olá 🤗
        </Text>

        <Text
          fontSize={15}
          lineHeight={24}
          color="$muted"
          fontFamily="DMSans_400Regular"
          marginBottom="$8"
        >
          Seus textos, sincronizados entre dispositivos.{"\n"}
          Simples e rápido.
        </Text>

        <Button
          size="$5"
          backgroundColor="$primary"
          borderRadius="$4"
          onPress={handleSignIn}
          disabled={loading}
          opacity={loading ? 0.6 : 1}
          pressStyle={{ scale: 0.98 }}
          marginBottom="$4"
        >
          {loading ? (
            <Spinner color="white" />
          ) : (
            <Text color="white" fontWeight="600" fontFamily="DMSans_500Medium">
              Continuar com Google
            </Text>
          )}
        </Button>

        {error && (
          <Text
            fontSize={14}
            color="$muted"
            fontFamily="DMSans_400Regular"
            textAlign="center"
          >
            {error}
          </Text>
        )}
      </YStack>
    </YStack>
  );
}
