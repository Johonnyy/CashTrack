/* eslint-disable no-unused-vars */
// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps, deleteApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { browser } from '$app/environment';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: import.meta.env.VITE_APIKEY,
	authDomain: import.meta.env.VITE_AUTHDOMAIN,
	projectId: import.meta.env.VITE_PROJECTID,
	storageBucket: import.meta.env.VITE_STORAGEBUCKET,
	messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
	appId: import.meta.env.VITE_APPID,
	measurementId: import.meta.env.VITE_MEASUREMENTID
};

// console.log(import.meta.env.VITE_APIKEY);
// console.log(import.meta.env.VITE_AUTHDOMAIN);
// console.log(import.meta.env.VITE_PROJECTID);
// console.log(import.meta.env.VITE_STORAGEBUCKET);
// console.log(import.meta.env.VITE_MESSAGINGSENDERID);
// console.log(import.meta.env.VITE_APPID);
// console.log(import.meta.env.VITE_MEASUREMENTID);

let firebaseApp;

if (!getApps().length) {
	firebaseApp = initializeApp(firebaseConfig);
} else {
	firebaseApp = getApp();
	deleteApp(firebaseApp);
	firebaseApp = initializeApp(firebaseConfig);
}

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

if (browser) {
	const analytics = getAnalytics(firebaseApp);
}
