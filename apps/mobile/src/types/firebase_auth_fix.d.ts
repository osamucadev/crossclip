import { FirebaseApp } from "firebase/app";

declare module "firebase/auth" {
  export function getReactNativePersistence(storage: any): any;
  export function initializeAuth(options: any, name?: any);
  export const GoogleAuthProvider: { credential: (idToken: any) => void };
  export function signInWithCredential(firebaseAuth: any, credential: any);
  export function getAuth(firebaseApp: FirebaseApp);
}
