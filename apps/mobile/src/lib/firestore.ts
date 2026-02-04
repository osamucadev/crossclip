import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  deleteDoc,
  doc,
  onSnapshot,
  Unsubscribe,
  getDocs,
} from "firebase/firestore";
import { auth } from "./firebase";

export const db = getFirestore();

export function subscribeToClips(
  onChange: (clips: { id: string; content: string }[]) => void,
): Unsubscribe {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const q = query(
    collection(db, "clips"),
    where("userId", "==", user.uid),
    orderBy("createdAt", "desc"),
    limit(20),
  );

  return onSnapshot(q, (snapshot) => {
    const clips = snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as { content: string }),
    }));

    onChange(clips);
  });
}

export async function addClip(content: string) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  return addDoc(collection(db, "clips"), {
    userId: user.uid,
    content,
    createdAt: serverTimestamp(),
  });
}

export async function fetchClips() {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const q = query(
    collection(db, "clips"),
    where("userId", "==", user.uid),
    orderBy("createdAt", "desc"),
    limit(20),
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as { id: string; content: string }[];
}

export async function deleteClip(id: string) {
  await deleteDoc(doc(db, "clips", id));
}
