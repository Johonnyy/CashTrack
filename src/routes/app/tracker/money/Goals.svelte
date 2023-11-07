<script lang="ts">
	import { onMount } from 'svelte';
	import { onAuthStateChange } from '$lib/auth';
	import { getUserData, userData } from '$lib/storage/stores';
	import { collection, query, where, addDoc, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
	import { db } from '$lib/firebase/firebase.client';
	import { slide } from 'svelte/transition';

	let user: any = null;
	let goals: any[] = [];

	let newGoal = false;
	let newGoalName = '';
	let newGoalAmount = '';

	const handleNewGoal = async function () {
		newGoal = false;
		await addDoc(collection(db, 'goals'), {
			goal: newGoalAmount,
			name: newGoalName,
			uid: user.uid
		});

		newGoalName = '';
		newGoalAmount = '';
	};

	const deleteGoal = async function (id: string) {
		await deleteDoc(doc(db, 'goals', id));
	};

	const setupRealtimeUpdates = () => {
		const queryCollection = collection(db, 'goals');
		const q = query(queryCollection, where('uid', '==', user.uid));

		return onSnapshot(q, (snapshot) => {
			let newGoals: any = [];
			snapshot.forEach((doc) => {
				const data = doc.data();
				data.id = doc.id;
				newGoals.push(data);
			});
			goals = newGoals;
		});
	};

	onMount(() => {
		const unsubscribe = onAuthStateChange(async (newUser: any) => {
			if (newUser) {
				user = await getUserData();
				const unsubscribeSnapshot = setupRealtimeUpdates();

				userData.subscribe((object) => {
					user = object;
				});
				// Unsubscribe from snapshot when component is destroyed
				return () => {
					unsubscribeSnapshot();
				};
			}
		});

		return unsubscribe; // Clean up listener on component destroy
	});
</script>

<div
	class="flex flex-col items-center justify-center bg-stone-800 drop-shadow-sm rounded-3xl py-12 px-4 sm:px-6 lg:px-8 w-full gap-y-5"
>
	<div class="text-2xl font-bold uppercase">Goals</div>
	{#if user}
		<div class="flex flex-col w-full gap-y-6">
			{#each goals as goal}
				<div>
					<div class="mb-3 font-medium">{goal.name} (${user.balance}/${goal.goal})</div>
					<div
						class="flex flex-row w-full bg-stone-700 rounded-full drop-shadow-md justify-between"
					>
						<div
							class="bg-gradient-to-br from-violet-600 to-violet-800 text-sm font-medium text-blue-100 text-center p-3 leading-none rounded-l-full"
							style="width: {((user.balance >= goal.goal ? goal.goal : user.balance) / goal.goal) *
								100 <
							0
								? 0
								: ((user.balance >= goal.goal ? goal.goal : user.balance) / goal.goal) * 100}%"
							transition:slide={{ axis: 'x' }}
						>
							{Math.round((user.balance / goal.goal) * 100)}%
						</div>
						<button
							on:click={() => {
								deleteGoal(goal.id);
							}}
							class="py-2 px-4 text-sm font-medium rounded-r-full text-white bg-gradient-to-br from-red-600 to-red-800 hover:bg-gradient-to-br hover:from-red-700 hover:to-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 drop-shadow-lg"
						>
							Delete
						</button>
					</div>
				</div>
			{/each}
		</div>
		{#if !newGoal}
			<button
				on:click={() => (newGoal = true)}
				class="flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-gradient-to-br from-violet-600 to-violet-800 hover:bg-gradient-to-br hover:from-violet-700 hover:to-violet-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 drop-shadow-lg mt-3"
				>Create new goal</button
			>
		{:else}
			<form
				transition:slide={{}}
				class="flex flex-col bg-stone-700 w-full p-6 gap-y-5 rounded-xl justify-center items-center"
				on:submit|preventDefault={handleNewGoal}
			>
				<div class="text-2xl font-bold text-white text-center">New Goal</div>
				<input
					type="text"
					placeholder="Goal Name"
					required
					bind:value={newGoalName}
					class="rounded-lg px-3 py-2 w-3/5 bg-gray-500 border border-gray-800 placeholder-gray-200 text-gray-50 rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
				/>
				<input
					type="number"
					placeholder="Amount"
					required
					bind:value={newGoalAmount}
					class="rounded-lg px-3 py-2 w-3/5 bg-gray-500 border border-gray-800 placeholder-gray-200 text-gray-50 rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
				/>
				<div class="flex flex-row gap-x-3">
					<button
						on:click={() => {
							newGoal = false;
						}}
						class="py-2 px-4 text-sm font-medium rounded-md text-white bg-gradient-to-br from-red-600 to-red-800 hover:bg-gradient-to-br hover:from-red-700 hover:to-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 drop-shadow-lg"
						>Cancel</button
					>
					<button
						type="submit"
						class="py-2 px-4 text-sm font-medium rounded-md text-white bg-gradient-to-br from-green-600 to-green-800 hover:bg-gradient-to-br hover:from-green-700 hover:to-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 drop-shadow-lg"
						>Save</button
					>
				</div>
			</form>
		{/if}
	{:else}
		<div class="flex flex-col gap-y-3 w-full justify-center items-center">
			<div class="flex flex-col w-full bg-gray-400 rounded-full shadow-md px-4 py-4 animate-pulse">
				<div class="w-full bg-gray-500 rounded mb-2" />
			</div>
			<div class="flex flex-col w-full bg-gray-400 rounded-full shadow-md px-4 py-4 animate-pulse">
				<div class="w-full bg-gray-500 rounded mb-2" />
			</div>
			<div class="flex flex-col w-full bg-gray-400 rounded-full shadow-md px-4 py-4 animate-pulse">
				<div class="w-full bg-gray-500 rounded mb-2" />
			</div>
			<div
				class="mt-3 flex justify-center w-1/6 py-2 px-4 text-sm font-medium rounded-md bg-gray-400 shadow-md animate-pulse"
			>
				<div
					class="flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-gray-400 drop-shadow-lg mt-3 animate-pulse"
				/>
			</div>
		</div>{/if}
</div>
