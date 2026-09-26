// ═══════════════════════════════════════════════════════════
// UNIFY — Firebase Service
// Handles: Google Auth, FCM Push Notifications,
//          Firestore real-time SOS + alerts
// Falls back gracefully if no credentials are set.
// ═══════════════════════════════════════════════════════════
import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth, GoogleAuthProvider, signInWithPopup, signOut as fbSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore, collection, addDoc, onSnapshot,
  query, orderBy, limit, serverTimestamp, doc, updateDoc
} from 'firebase/firestore';
import {
  getMessaging, getToken, onMessage, isSupported
} from 'firebase/messaging';

// ── Config from env vars ──────────────────────────────────
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            || '',
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        || '',
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         || '',
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID|| '',
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             || '',
};

const IS_LIVE = firebaseConfig.apiKey.startsWith('AIza') && firebaseConfig.projectId.length > 3;

let app, auth, db, messaging;

if (IS_LIVE) {
  try {
    app       = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth      = getAuth(app);
    db        = getFirestore(app);
    console.log('[UNIFY] 🔥 Firebase connected → Project:', firebaseConfig.projectId);
  } catch (e) {
    console.error('[Firebase init]', e.message);
  }
} else {
  console.log('[UNIFY] 📴  Firebase not configured — running in DEMO mode');
}

// ─────────────────────────────────────────────────────────────
// GOOGLE AUTH
// ─────────────────────────────────────────────────────────────
export const googleSignIn = async () => {
  if (!IS_LIVE || !auth) {
    console.log('[Firebase] Demo mode — skipping real Google Auth');
    return { user: { displayName: 'Demo User', email: 'demo@unify.edu', photoURL: null }, demo: true };
  }
  try {
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    const result = await signInWithPopup(auth, provider);
    return { user: result.user };
  } catch (e) {
    console.error('[Firebase Auth]', e.message);
    return null;
  }
};

export const googleSignOut = async () => {
  if (!IS_LIVE || !auth) return;
  try { await fbSignOut(auth); } catch (e) { console.error(e); }
};

export const onAuthChange = (callback) => {
  if (!IS_LIVE || !auth) return () => {};
  return onAuthStateChanged(auth, callback);
};

// ─────────────────────────────────────────────────────────────
// FIREBASE CLOUD MESSAGING (FCM PUSH)
// ─────────────────────────────────────────────────────────────
let fcmToken = null;

export const initFCM = async () => {
  if (!IS_LIVE) return null;
  try {
    const supported = await isSupported();
    if (!supported) { console.log('[FCM] Not supported in this browser'); return null; }

    messaging = getMessaging(app);
    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
    if (!vapidKey) { console.log('[FCM] VAPID key not set'); return null; }

    // Request notification permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') { console.log('[FCM] Notifications blocked by user'); return null; }

    fcmToken = await getToken(messaging, { vapidKey });
    console.log('[FCM] 📱 Token obtained:', fcmToken?.substring(0, 20) + '...');

    // Listen for foreground messages
    onMessage(messaging, (payload) => {
      console.log('[FCM] Message received:', payload);
      // Show browser notification if app is in foreground
      if (payload.notification) {
        new Notification(payload.notification.title, {
          body: payload.notification.body,
          icon: '/icons/icon-192.png',
        });
      }
    });

    return fcmToken;
  } catch (e) {
    console.error('[FCM]', e.message);
    return null;
  }
};

export const getFCMToken = () => fcmToken;

// ─────────────────────────────────────────────────────────────
// FIRESTORE — REAL-TIME COLLECTIONS
// ─────────────────────────────────────────────────────────────
export const firestoreDB = {

  /* ── SOS Alerts (Real-time) ────────────────────────────── */
  sos: {
    send: async (alertData) => {
      if (!IS_LIVE || !db) {
        console.log('[Firestore] Demo SOS logged locally:', alertData);
        return { id: 'demo-' + Date.now(), ...alertData };
      }
      try {
        const docRef = await addDoc(collection(db, 'sos_alerts'), {
          ...alertData,
          status: 'SENT',
          fcmToken,
          createdAt: serverTimestamp(),
        });
        console.log('[Firestore] SOS sent → ID:', docRef.id);
        return { id: docRef.id };
      } catch (e) {
        console.error('[Firestore SOS]', e.message);
        return null;
      }
    },

    subscribe: (callback) => {
      if (!IS_LIVE || !db) return () => {};
      const q = query(collection(db, 'sos_alerts'), orderBy('createdAt', 'desc'), limit(10));
      return onSnapshot(q, (snapshot) => {
        const alerts = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        callback(alerts);
      });
    },

    acknowledge: async (id) => {
      if (!IS_LIVE || !db) return;
      try { await updateDoc(doc(db, 'sos_alerts', id), { status: 'ACKNOWLEDGED' }); }
      catch (e) { console.error('[Firestore]', e.message); }
    }
  },

  /* ── Live Notifications (Real-time) ───────────────────── */
  notifications: {
    send: async (notification) => {
      if (!IS_LIVE || !db) return null;
      try {
        return await addDoc(collection(db, 'notifications'), {
          ...notification,
          createdAt: serverTimestamp(),
          readBy: [],
        });
      } catch (e) {
        console.error('[Firestore Notifications]', e.message);
        return null;
      }
    },

    subscribe: (userRegNo, callback) => {
      if (!IS_LIVE || !db) return () => {};
      const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'), limit(50));
      return onSnapshot(q, (snapshot) => {
        const notifs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        callback(notifs);
      });
    }
  },

  /* ── Complaint Status Updates (Real-time) ──────────────── */
  complaintUpdates: {
    subscribe: (complaintId, callback) => {
      if (!IS_LIVE || !db) return () => {};
      return onSnapshot(doc(db, 'complaints', complaintId), (snap) => {
        if (snap.exists()) callback({ id: snap.id, ...snap.data() });
      });
    }
  },

  /* ── Live Quiz Results (Real-time) ─────────────────────── */
  quizResults: {
    subscribe: (quizId, callback) => {
      if (!IS_LIVE || !db) return () => {};
      return onSnapshot(doc(db, 'quizzes', quizId), (snap) => {
        if (snap.exists()) callback({ id: snap.id, ...snap.data() });
      });
    },

    submitVote: async (quizId, optionIndex, voterRegNo) => {
      if (!IS_LIVE || !db) return;
      try {
        await addDoc(collection(db, 'quiz_responses'), {
          quizId, optionIndex, voterRegNo,
          createdAt: serverTimestamp()
        });
      } catch (e) {
        console.error('[Firestore Quiz]', e.message);
      }
    }
  },
};

export const isFirebaseLive = IS_LIVE;
export { auth, db as firestoreInstance };