import { writable } from 'svelte/store';
import { auth, db } from '$lib/firebase/firebase.client';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export const showMenu = writable<boolean>(false);
export const userData = writable<null | any>(null);
let fetchingUserDataPromise: Promise<any> | null = null;

async function fetchAndUpdateUserData() {
	// Check if there is an ongoing fetch operation, if yes, return that Promise
	if (fetchingUserDataPromise) {
		console.log('Fetch already in progress. Skipping...');
		return fetchingUserDataPromise;
	}

	let cachedUserData: any | null = null;

	userData.subscribe((value) => (cachedUserData = value));

	// Check if user data is already cached, if yes, return that data
	if (cachedUserData) {
		return Promise.resolve(cachedUserData);
	}

	fetchingUserDataPromise = new Promise(async (resolve, reject) => {
		const user = auth.currentUser;
		if (user) {
			const docRef = doc(db, 'users', user.uid);
			try {
				const docSnap = await getDoc(docRef);

				if (docSnap.exists()) {
					const newData = docSnap.data();
					userData.set(newData); // Cache the fetched user data
					resolve(newData); // Resolve the Promise
				} else {
					userData.set(null);
					resolve(null);
				}
			} catch (error) {
				console.error('Error fetching user data:', error);
				reject(error); // Reject the Promise
			}
		} else {
			userData.set(null);
			resolve(null);
		}
	});

	const result = await fetchingUserDataPromise;
	fetchingUserDataPromise = null; // Reset the ongoing fetch Promise
	return result;
}

export const getUserData = async () => {
	// Try to return the cached user data if available
	let cachedUserData: any | null = null;

	userData.subscribe((value) => (cachedUserData = value));

	if (cachedUserData) {
		return Promise.resolve(cachedUserData);
	}

	// If not, fetch new user data
	return fetchAndUpdateUserData();
};

export const setUserData = async (data: object | null) => {
	if (!data) return;
	if (!auth.currentUser) return;

	await setDoc(doc(db, 'users', auth.currentUser.uid), data);
	userData.set(data);
};

export const updateUserData = async (newData: object) => {
	if (!newData) return;
	if (!auth.currentUser) return;

	await updateDoc(doc(db, 'users', auth.currentUser.uid), newData);
	userData.set(Object.assign(await getUserData(), newData));
};
