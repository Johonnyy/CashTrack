<script lang="ts">
	import { onMount } from 'svelte';
	import { getUserData, updateUserData } from '$lib/storage/stores';
	import { onAuthStateChange } from '$lib/auth';
	import { db } from '$lib/firebase/firebase.client';
	import {
		collection,
		query,
		where,
		onSnapshot,
		deleteDoc,
		doc,
		addDoc,
		orderBy
	} from 'firebase/firestore';
	import { slide } from 'svelte/transition';
	import { tConvert } from '$lib/functions';

	let user: any = null;
	let shiftTimes: any[] = [];

	let creating = false;

	let createShiftTimeName: string;
	let createStartTime: string;
	let createEndTime: string;

	const createNewShiftTime = async function () {
		const docRef = await addDoc(collection(db, 'shiftTimes'), {
			uid: user.currentUser.uid,
			name: createShiftTimeName,
			startTime: createStartTime,
			endTime: createEndTime
		});
		creating = false;
	};

	const deleteShiftTime = async function (id: string) {
		await deleteDoc(doc(db, 'shiftTimes', id));
	};

	const setupRealtimeUpdates = () => {
		const queryCollection = collection(db, 'shiftTimes');
		const q = query(queryCollection, where('uid', '==', user.uid), orderBy('name'));

		return onSnapshot(q, (snapshot) => {
			let newShiftTimes: any = [];
			snapshot.forEach((doc) => {
				const data = doc.data();
				data.id = doc.id;
				newShiftTimes.push(data);
			});
			shiftTimes = newShiftTimes;
		});
	};

	onMount(() => {
		const unsubscribe = onAuthStateChange(async (newUser: any) => {
			if (newUser) {
				user = await getUserData();
				const unsubscribeSnapshot = setupRealtimeUpdates();

				// Unsubscribe from snapshot when component is destroyed
				return () => {
					unsubscribeSnapshot();
				};
			}
		});

		return unsubscribe; // Clean up listener on component destroy
	});
</script>

<div class="text-white flex flex-col justify-center w-full gap-x-3 gap-y-6">
	<div class="text-2xl font-bold uppercase text-center">Shift Times</div>
	<div class="flex flex-col gap-y-3">
		{#each shiftTimes as shiftTime}
			<div
				transition:slide={{ axis: 'x' }}
				class="flex flex-row justify-between bg-stone-700 p-5 rounded-lg items-center"
			>
				<div>{shiftTime.name}</div>
				<div>{tConvert(shiftTime.startTime)}-{tConvert(shiftTime.endTime)}</div>
				<button
					on:click={() => {
						deleteShiftTime(shiftTime.id);
					}}
					class="py-2 px-4 font-medium rounded-md text-white bg-gradient-to-br from-red-600 to-red-800 hover:bg-gradient-to-br hover:from-red-700 hover:to-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 drop-shadow-lg mt-3"
					>Delete</button
				>
			</div>
		{/each}
	</div>
	<form
		class="flex flex-col"
		on:submit|preventDefault={() => {
			creating ? createNewShiftTime() : (creating = true);
		}}
	>
		{#if creating}
			<div class="flex flex-col" transition:slide>
				<label for="startTime">Start Time</label>
				<input
					type="time"
					id="startTime"
					name="startTime"
					required
					bind:value={createStartTime}
					class="bg-stone-600 px-3 py-1 rounded"
				/>
				<label for="endTime">End Time</label>
				<input
					type="time"
					id="endTime"
					name="endTime"
					required
					bind:value={createEndTime}
					class="bg-stone-600 px-3 py-1 rounded"
				/>
				<label for="createShiftTimeName">Name</label>
				<input
					type="text"
					id="createShiftTimeName"
					name="createShiftTimeName"
					required
					bind:value={createShiftTimeName}
					class="bg-stone-600 px-3 py-1 rounded"
				/>
			</div>
			<button
				on:click={() => (creating = false)}
				class="group relative w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-gradient-to-br from-red-600 to-red-800 hover:bg-gradient-to-br hover:from-red-700 hover:to-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 drop-shadow-lg mt-3"
			>
				Cancel
			</button>
		{/if}
		<button
			type="submit"
			class="group relative w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-gradient-to-br from-violet-600 to-violet-800 hover:bg-gradient-to-br hover:from-violet-700 hover:to-violet-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 drop-shadow-lg mt-3"
		>
			{creating ? 'Save Time' : 'Create New Time'}
		</button>
	</form>
</div>
