import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Application from "expo-application";
import { Linking } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firestore";

const STORAGE_KEY = "app_open_count_outdated";
const MAX_OPENS = 7;

export async function checkAppVersion() {
  // Skip version check in development
//   if (__DEV__) {
//     return {
//       mustUpdate: false,
//       canStillUse: true,
//       opensLeft: MAX_OPENS,
//     };
//   }

  try {
    // Fetch minimum required version from Firestore
    const docRef = doc(db, "config", "app_version");
    const docSnap = await getDoc(docRef);
    const minimumVersion = docSnap.exists()
      ? docSnap.data().minimum_version
      : "1.0.0";

    const currentVersion = Application.nativeApplicationVersion;

    if (isVersionOutdated(currentVersion!, minimumVersion)) {
      const count = await getOpenCount();

      if (count >= MAX_OPENS) {
        return {
          mustUpdate: true,
          canStillUse: false,
          opensLeft: 0,
        };
      }

      await incrementOpenCount();
      return {
        mustUpdate: true,
        canStillUse: true,
        opensLeft: MAX_OPENS - count - 1,
      };
    }

    // Version is OK, reset counter
    await AsyncStorage.removeItem(STORAGE_KEY);
    return {
      mustUpdate: false,
      canStillUse: true,
      opensLeft: MAX_OPENS,
    };
  } catch (error) {
    console.error("Error checking app version:", error);
    // On error, allow app to continue
    return {
      mustUpdate: false,
      canStillUse: true,
      opensLeft: MAX_OPENS,
    };
  }
}

async function getOpenCount(): Promise<number> {
  const count = await AsyncStorage.getItem(STORAGE_KEY);
  return count ? parseInt(count, 10) : 0;
}

async function incrementOpenCount() {
  const count = await getOpenCount();
  await AsyncStorage.setItem(STORAGE_KEY, (count + 1).toString());
}

function isVersionOutdated(current: string, minimum: string): boolean {
  const currentParts = current.split(".").map(Number);
  const minimumParts = minimum.split(".").map(Number);

  for (let i = 0; i < 3; i++) {
    if (currentParts[i] > minimumParts[i]) return false;
    if (currentParts[i] < minimumParts[i]) return true;
  }

  return false;
}

export function openPlayStore() {
  const packageName = Application.applicationId;

  //TODO: change packageName
  Linking.openURL(`market://details?id=${packageName}`);
}
