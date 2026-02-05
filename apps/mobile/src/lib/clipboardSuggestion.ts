import { AppState, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "./firebase";
import { addClip } from "./firestore";

const KEY_LAST_PROMPTED = "crossclip:last_prompted_clipboard";

async function getClipboardText() {
  const text = await Clipboard.getStringAsync();
  return (text ?? "").trim();
}

export async function maybeSuggestSaveClipboard(opts?: {
  onSaved?: () => void;
}) {
  const user = auth.currentUser;
  if (!user) return;

  const text = await getClipboardText();
  if (!text) return;

  const lastPrompted = await AsyncStorage.getItem(KEY_LAST_PROMPTED);
  if (lastPrompted === text) return;

  await AsyncStorage.setItem(KEY_LAST_PROMPTED, text);

  Alert.alert(
    "Salvar no Crossclip?",
    text.length > 140 ? `${text.slice(0, 140)}...` : text,
    [
      { text: "Não", style: "cancel" },
      {
        text: "Sim",
        onPress: async () => {
          await addClip(text);
          opts?.onSaved?.();
        },
      },
    ],
  );
}

export function registerClipboardSuggestionListener(opts?: {
  onSaved?: () => void;
}) {
  maybeSuggestSaveClipboard(opts);

  const sub = AppState.addEventListener("change", (state) => {
    if (state === "active") {
      maybeSuggestSaveClipboard(opts);
    }
  });

  return () => sub.remove();
}
