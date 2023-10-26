import { auth } from './firebase/firebase.client';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { goto } from '$app/navigation';
import { getUserData } from '$lib/user';

export function checkAuth() {
	return auth.currentUser !== null;
}

export function onAuthStateChange(callback: any) {
	return onAuthStateChanged(auth, callback);
}

export async function logout() {
	try {
		await signOut(auth);
		goto('/account/login');
	} catch (error) {
		console.error('Error signing out:', error);
	}
}
