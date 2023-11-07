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

	let user: any = null;
	let locations: any[] = [];

	let creating = false;

	let createLocationName: string;

	const createNewLocation = async function () {
		const docRef = await addDoc(collection(db, 'locations'), {
			uid: user.uid,
			name: createLocationName
		});

		creating = false;
	};

	const deleteLocation = async function (id: string) {
		await deleteDoc(doc(db, 'locations', id));
	};

	const setupRealtimeUpdates = () => {
		const queryCollection = collection(db, 'locations');
		const q = query(queryCollection, where('uid', '==', user.uid), orderBy('name'));

		return onSnapshot(q, (snapshot) => {
			let newLocations: any = [];
			snapshot.forEach((doc) => {
				const data = doc.data();
				data.id = doc.id;
				newLocations.push(data);
			});
			locations = newLocations;
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
	<div class="text-2xl font-bold uppercase text-center">Locations</div>
	<div class="flex flex-col gap-y-3">
		{#each locations as location}
			<div
				transition:slide={{ axis: 'x' }}
				class="flex flex-row justify-between bg-stone-700 p-5 rounded-lg items-center"
			>
				<div>{location.name}</div>
				<button
					on:click={() => {
						deleteLocation(location.id);
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
			creating ? createNewLocation() : (creating = true);
		}}
	>
		{#if creating}
			<div class="flex flex-col" transition:slide>
				<label for="locationName">Location Name</label>
				<input
					type="text"
					id="locationName"
					name="locationName"
					required
					bind:value={createLocationName}
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
