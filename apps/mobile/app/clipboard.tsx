import { YStack, XStack, Text, Button,  Card } from "tamagui";
import * as Clipboard from "expo-clipboard";
import { useEffect, useState } from "react";
import { addClip, deleteClip, subscribeToClips } from "../src/lib/firestore";
import { signOut } from "firebase/auth";
import { auth } from "../src/lib/firebase";
import { router } from "expo-router";
import { trackInteraction } from "../src/lib/reviewPrompt";
import { ThemeToggle } from "../src/components/ThemeToggle";
import { LogOut } from "@tamagui/lucide-icons";
import { ToastAndroid, FlatList } from "react-native";

type Clip = {
  id: string;
  content: string;
};

export default function ClipboardScreen() {
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(false);

  async function handlePushClipboard() {
    setLoading(true);
    try {
      const text = await Clipboard.getStringAsync();
      if (!text.trim()) return;

      await addClip(text);
      await trackInteraction();
      ToastAndroid.show("Texto adicionado", ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy(text: string) {
    await Clipboard.setStringAsync(text);
    await trackInteraction();
    ToastAndroid.show("Copiado", ToastAndroid.SHORT);
  }

  async function handleDelete(id: string) {
    setLoading(true);
    try {
      await deleteClip(id);
      setClips((prev) => prev.filter((c) => c.id !== id));
      await trackInteraction();
      ToastAndroid.show("Excluído", ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await signOut(auth);
    router.replace("/sign-in");
  }

  useEffect(() => {
    const unsubscribe = subscribeToClips(setClips);
    return () => unsubscribe();
  }, []);

  return (
    <YStack flex={1} backgroundColor="$background">
      {/* Header */}
      <YStack paddingTop="$16" paddingHorizontal="$5" paddingBottom="$4">
        <XStack
          alignItems="center"
          justifyContent="space-between"
          marginBottom="$4"
        >
          <Text
            fontSize={28}
            fontWeight="700"
            color="$color"
            fontFamily="DMSans_700Bold"
            letterSpacing={-0.5}
          >
            Seus textos
          </Text>

          <XStack gap="$3" alignItems="center">
            <ThemeToggle />
            <Button
              size="$3"
              circular
              chromeless
              icon={LogOut}
              onPress={handleLogout}
              pressStyle={{ opacity: 0.7 }}
            />
          </XStack>
        </XStack>

        <Button
          size="$4"
          backgroundColor="$primary"
          borderRadius="$4"
          onPress={handlePushClipboard}
          disabled={loading}
          opacity={loading ? 0.6 : 1}
          pressStyle={{ scale: 0.98 }}
        >
          <Text color="white" fontWeight="600" fontFamily="DMSans_500Medium">
            Adicionar do clipboard
          </Text>
        </Button>
      </YStack>

      {/* Clips List */}
      <FlatList
        data={clips}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, paddingTop: 8 }}
        renderItem={({ item }) => (
          <Card
            backgroundColor="$surface"
            borderWidth={1}
            borderColor="$borderColor"
            borderRadius="$5"
            padding="$4"
            marginBottom="$3"
            pressStyle={{ scale: 0.98 }}
          >
            <Text
              fontSize={15}
              lineHeight={22}
              color="$color"
              fontFamily="DMSans_400Regular"
              numberOfLines={6}
            >
              {item.content}
            </Text>

            <XStack gap="$3" marginTop="$3">
              <Button
                flex={1}
                size="$3"
                borderWidth={1}
                borderColor="$borderColor"
                backgroundColor="transparent"
                borderRadius="$3"
                onPress={() => handleDelete(item.id)}
                pressStyle={{ backgroundColor: "$backgroundHover" }}
              >
                <Text
                  color="$color"
                  fontWeight="600"
                  fontFamily="DMSans_500Medium"
                >
                  Excluir
                </Text>
              </Button>

              <Button
                flex={1}
                size="$3"
                backgroundColor="$primary"
                borderRadius="$3"
                onPress={() => handleCopy(item.content)}
                pressStyle={{ backgroundColor: "$primaryHover" }}
              >
                <Text
                  color="white"
                  fontWeight="600"
                  fontFamily="DMSans_500Medium"
                >
                  Copiar
                </Text>
              </Button>
            </XStack>
          </Card>
        )}
        ListEmptyComponent={
          <YStack alignItems="center" paddingTop="$10">
            <Text
              fontSize={16}
              color="$muted"
              fontFamily="DMSans_400Regular"
              textAlign="center"
            >
              Nenhum texto salvo ainda.{"\n"}
              Adicione do seu clipboard!
            </Text>
          </YStack>
        }
      />
    </YStack>
  );
}
