import { auth, db } from './firebase/firebase.client';
import { doc, addDoc, collection, Timestamp } from 'firebase/firestore';

export const newTransaction = async function (
	amount: number,
	newBalance: number,
	reason: string = 'No Reason Provided'
) {
	if (!auth.currentUser) return;
	if (!newBalance && newBalance !== 0) return;

	await addDoc(collection(db, 'transactions'), {
		uid: auth.currentUser.uid,
		amount: amount,
		newBalance: newBalance,
		reason: reason,
		time: Timestamp.fromDate(new Date())
	});
};
