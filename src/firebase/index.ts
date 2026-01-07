'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// This interface defines the shape of the object returned by getSdks.
interface FirebaseServices {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

// This function initializes Firebase and returns the SDKs.
// It ensures that initialization only happens once.
export function initializeFirebase(): FirebaseServices {
  // If no apps are initialized, initialize a new one with the static config.
  if (!getApps().length) {
    const firebaseApp = initializeApp(firebaseConfig);
    return getSdks(firebaseApp);
  }
  // If an app is already initialized, get it and return its SDKs.
  return getSdks(getApp());
}

// This helper function gets the Auth and Firestore SDKs from a FirebaseApp instance.
function getSdks(firebaseApp: FirebaseApp): FirebaseServices {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp),
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
