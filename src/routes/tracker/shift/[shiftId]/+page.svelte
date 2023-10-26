<script lang="ts">
	import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
	import { db, auth } from '$lib/firebase/firebase.client';
	import { onAuthStateChange } from '$lib/auth';
	import { onMount } from 'svelte';
	import { tConvert } from '$lib/functions';
	import { goto } from '$app/navigation';
	import { getUserData } from '$lib/user.js';

	let currentUser: any;

	export let data;
	let shift: any;

	let deleting = false;

	const startDeleteShift = async function () {
		deleting = true;
	};

	const deleteShift = async function () {
		const userData = await getUserData();
		if (userData) {
			await updateDoc(doc(db, 'users', currentUser.uid), {
				balance: userData.balance - shift.made
			});
		}
		await deleteDoc(doc(db, 'shifts', data.shiftId));
		await goto('/tracker');
	};

	onMount(() => {
		const unsubscribe = onAuthStateChange(async (user: any) => {
			if (user) {
				const userQueries = query(collection(db, 'shifts'), where('uid', '==', user.uid));
				const querySnapshot = await getDocs(userQueries);
				querySnapshot.forEach((doc) => {
					if (doc.id === data.shiftId) {
						shift = doc.data();
					}
					//console.log(doc.id, ' => ', doc.data());
				});

				currentUser = user;
			}
		});

		return unsubscribe; // Clean up listener on component destroy
	});
</script>

<svelte:head>
	<title>Manage Shift</title>
	<meta name="description" content="Calendar Viewer" />
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<section class="text-white">
	{#if shift}
		<div>
			{shift.time.name} ({tConvert(shift.time.startTime)} - {tConvert(shift.time.endTime)})
		</div>
		<br />
		<div>
			{shift.location}
		</div>
		<br />
		{#if shift.made > 0}
			<div class="font-medium">
				You made <span class="text-green-500 inline">${shift.made}</span>
			</div>
		{/if}
	{/if}
	{#if !deleting}
		<button
			on:click={startDeleteShift}
			class="bg-gradient-to-br from-red-600 to-red-800 hover:bg-gradient-to-br hover:from-red-700 hover:to-red-900 rounded px-4 py-2 mt-6 text-white drop-shadow-md font-medium"
			>Delete</button
		>
	{:else}
		<button
			on:click={deleteShift}
			class="bg-gradient-to-br from-red-600 to-red-800 hover:bg-gradient-to-br hover:from-red-700 hover:to-red-900 rounded px-4 py-2 mt-6 text-white drop-shadow-md font-medium"
			>Are You Sure?</button
		>
	{/if}
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}
</style>
