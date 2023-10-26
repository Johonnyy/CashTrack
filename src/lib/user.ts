import { auth, db } from './firebase/firebase.client';
import { doc, getDoc } from 'firebase/firestore';

export const getUserData = async function () {
	const user = auth.currentUser;

	if (user) {
		const docRef = doc(db, 'users', user.uid);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			return docSnap.data();
		} else {
			return null;
		}
	} else {
		return null;
	}
};
