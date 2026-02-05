import AsyncStorage from "@react-native-async-storage/async-storage";
import * as StoreReview from "expo-store-review";

const STORAGE_KEY = "interaction_count";
const REVIEW_ASKED_KEY = "review_asked";
const INTERACTIONS_THRESHOLD = 10; // Ask for review after 10 interactions

export async function trackInteraction() {
  // Skip in development
  if (__DEV__) return;

  const reviewAsked = await hasAskedForReview();
  if (reviewAsked) return;

  const count = await getInteractionCount();
  const newCount = count + 1;
  await AsyncStorage.setItem(STORAGE_KEY, newCount.toString());

  if (newCount >= INTERACTIONS_THRESHOLD) {
    await promptForReview();
  }
}

async function getInteractionCount(): Promise<number> {
  const count = await AsyncStorage.getItem(STORAGE_KEY);
  return count ? parseInt(count, 10) : 0;
}

async function hasAskedForReview(): Promise<boolean> {
  const asked = await AsyncStorage.getItem(REVIEW_ASKED_KEY);
  return asked === "true";
}

async function promptForReview() {
  const available = await StoreReview.isAvailableAsync();

  if (available) {
    await StoreReview.requestReview();
    await AsyncStorage.setItem(REVIEW_ASKED_KEY, "true");
  }
}
