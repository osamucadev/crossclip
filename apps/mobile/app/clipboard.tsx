import {
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  ToastAndroid,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { useEffect, useState } from "react";
import { addClip, deleteClip, subscribeToClips } from "../src/lib/firestore";
import { useAppTheme } from "../src/ui/useAppTheme";

type Clip = {
  id: string;
  content: string;
};

export default function ClipboardScreen() {
  const { t } = useAppTheme();
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(false);

  async function handlePushClipboard() {
    setLoading(true);
    try {
      const text = await Clipboard.getStringAsync();
      if (!text.trim()) return;

      await addClip(text);
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy(text: string) {
    await Clipboard.setStringAsync(text);
    ToastAndroid.show("Copiado", ToastAndroid.SHORT);
  }

  async function handleDelete(id: string) {
    setLoading(true);
    try {
      await deleteClip(id);
      setClips((prev) => prev.filter((c) => c.id !== id));
      ToastAndroid.show("Excluído", ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const unsubscribe = subscribeToClips(setClips);

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <View style={[styles.page, { backgroundColor: t.bg }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: t.text }]}>Clipboard</Text>

        <Pressable
          onPress={handlePushClipboard}
          style={[
            styles.btn,
            { backgroundColor: t.accent, opacity: loading ? 0.6 : 1 },
          ]}
        >
          <Text style={styles.btnText}>Push clipboard</Text>
        </Pressable>
      </View>

      <FlatList
        data={clips}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              {
                backgroundColor: t.surface,
                borderColor: t.border,
              },
            ]}
          >
            <Text
              style={[styles.clipText, { color: t.textMuted }]}
              numberOfLines={6}
            >
              {item.content}
            </Text>

            <View style={styles.actions}>
              <Pressable
                onPress={() => handleDelete(item.id)}
                style={[
                  styles.actionBtn,
                  styles.deleteBtn,
                  { borderColor: t.border },
                ]}
                android_ripple={{ borderless: false }}
              >
                <Text style={[styles.actionText, { color: t.text }]}>
                  Excluir
                </Text>
              </Pressable>

              <Pressable
                onPress={() => handleCopy(item.content)}
                style={[styles.actionBtn, { backgroundColor: t.accent }]}
                android_ripple={{ borderless: false }}
              >
                <Text style={styles.actionTextPrimary}>Copiar</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -1,
  },
  btn: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  btnText: {
    color: "white",
    fontWeight: "700",
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  clipText: {
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 12,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  deleteBtn: {
    backgroundColor: "transparent",
    borderWidth: 1,
  },
  actionText: {
    fontWeight: "700",
  },
  actionTextPrimary: {
    color: "white",
    fontWeight: "800",
  },
});
