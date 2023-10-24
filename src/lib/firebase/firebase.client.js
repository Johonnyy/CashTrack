/* eslint-disable no-unused-vars */
// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps, deleteApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, setPersistence, inMemoryPersistence } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: import.meta.env.VITE_APIKEY,
	authDomain: import.meta.env.VITE_AUTHDOMAIN,
	projectId: import.meta.env.PROJECTID,
	storageBucket: import.meta.env.STORAGEBUCKET,
	messagingSenderId: import.meta.env.MESSAGINGSENDERID,
	appId: import.meta.env.APPID,
	measurementId: import.meta.env.MEASUREMENTID
};

let firebaseApp;

if (!getApps().length) {
	firebaseApp = initializeApp(firebaseConfig);
} else {
	firebaseApp = getApp();
	deleteApp(firebaseApp);
	firebaseApp = initializeApp(firebaseConfig);
}

export const auth = getAuth(firebaseApp);
