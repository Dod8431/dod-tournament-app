import { db } from './config'; 
import {
  doc, setDoc, getDoc, addDoc, collection, updateDoc, arrayUnion, onSnapshot, query, where, getDocs, serverTimestamp
} from 'firebase/firestore';
import { deleteDoc } from 'firebase/firestore';

export async function createTournament(data) {
  const tournamentRef = await addDoc(collection(db, 'tournaments'), {
    ...data,
    createdAt: serverTimestamp(),
    currentRound: 1,
    users: [],
    votes: [],
    isActive: true,
  });
  return tournamentRef.id;
}

export async function addUserToTournament(tid, user) {
  const tRef = doc(db, 'tournaments', tid);
  await updateDoc(tRef, { users: arrayUnion(user) });
}

export async function getTournament(tid) {
  const tRef = doc(db, 'tournaments', tid);
  const snap = await getDoc(tRef);
  return snap.data();
}

// Helper: get tournament w/ id included
export async function getTournamentWithId(tid) {
  const tRef = doc(db, 'tournaments', tid);
  const snap = await getDoc(tRef);
  return { id: tid, ...snap.data() };
}

export async function getAllActiveTournaments() {
  const q = query(collection(db, 'tournaments'), where('isActive', '==', true));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// -------- NEW: Get all archived tournaments --------
export async function getAllArchivedTournaments() {
  const q = query(collection(db, 'tournaments'), where('isActive', '==', false));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
// ---------------------------------------------------

export async function archiveTournament(tid) {
  const tRef = doc(db, "tournaments", tid);
  await updateDoc(tRef, { isActive: false });
}

export async function deleteTournament(tid) {
  const tRef = doc(db, "tournaments", tid);
  await deleteDoc(tRef);
}

// Get all tournaments by adminId
export async function getTournamentsByAdmin(adminId) {
  const q = query(collection(db, 'tournaments'), where('adminId', '==', adminId));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export function listenTournament(tid, cb) {
  return onSnapshot(doc(db, 'tournaments', tid), (doc) => {
    cb(doc.data());
  });
}

export async function submitVote(tid, userId, roundNum, matchId, votedFor) {
  const tRef = doc(db, 'tournaments', tid);
  await updateDoc(tRef, {
    votes: arrayUnion({ userId, roundNum, matchId, votedFor })
  });
}

export async function updateBracket(tid, bracket) {
  const tRef = doc(db, 'tournaments', tid);
  await updateDoc(tRef, { bracket });
}

export async function advanceRound(tid, newBracket, nextRound) {
  const tRef = doc(db, 'tournaments', tid);
  await updateDoc(tRef, {
    bracket: newBracket,
    currentRound: nextRound
  });
}

// -------- Winner Util --------
export async function crownWinner(tid, winner) {
  const tRef = doc(db, 'tournaments', tid);
  await updateDoc(tRef, { winner });
}
// ----------------------------

// Check admin pin for a tournament
export async function checkAdminPin(tid, pin) {
  const tRef = doc(db, 'tournaments', tid);
  const snap = await getDoc(tRef);
  const data = snap.data();
  return data?.adminPin === pin;
}

export async function saveUserProgress(userId, tournamentId, progress) {
  try {
    const ref = doc(db, "progress", `${userId}_${tournamentId}`);
    await setDoc(ref, { userId, tournamentId, ...progress }, { merge: true });
  } catch (err) {
    console.error("Erreur saveUserProgress:", err);
  }
}

export async function loadUserProgress(userId, tournamentId) {
  try {
    const ref = doc(db, "progress", `${userId}_${tournamentId}`);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    console.error("Erreur loadUserProgress:", err);
    return null;
  }
}
