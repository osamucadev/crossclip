import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "./firebase";

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  offlineAccess: false,
  forceCodeForRefreshToken: true,
  scopes: ["profile", "email"],
});

export async function signInWithGoogle() {
  try {
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });

    const userInfo = await GoogleSignin.signIn();
    const idToken = userInfo.data?.idToken;

    if (!idToken) {
      throw new Error("No Google ID token returned");
    }

    const credential = GoogleAuthProvider.credential(idToken);
    return await signInWithCredential(auth, credential);
  } catch (error) {
    console.error("Google Sign-In error:", error);
    throw error;
  }
}

export async function signOutGoogle() {
  try {
    await GoogleSignin.signOut();
    await auth.signOut();
  } catch (error) {
    console.error("Google Sign-Out error:", error);
    throw error;
  }
}
