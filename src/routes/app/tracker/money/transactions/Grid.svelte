<script lang="ts">
	import { onMount } from 'svelte';
	import { onAuthStateChange } from '$lib/auth';
	import { getUserData, userData } from '$lib/storage/stores';
	import { query, orderBy, limit, collection, where, onSnapshot } from 'firebase/firestore';
	import { db } from '$lib/firebase/firebase.client';
	import { tConvert } from '$lib/functions';
	import { goto } from '$app/navigation';

	let user: any = null;

	let data: any[] = [];

	let sortBy: any = null;
	let sortAsc = true;

	let search = '';
	$: filteredData = data.filter((d) => d.reason.toLowerCase().includes(search.toLowerCase()));

	const sortData = function (field: any) {
		sortAsc = sortBy === field ? !sortAsc : true;
		sortBy = field;
		filteredData.sort((a, b) => {
			if (a[field] < b[field]) return sortAsc ? -1 : 1;
			if (a[field] > b[field]) return sortAsc ? 1 : -1;
			return 0;
		});
	};

	const setupRealtimeUpdates = () => {
		const queryCollection = collection(db, 'transactions');
		const q = query(queryCollection, where('uid', '==', user.uid), orderBy('time', 'desc'));

		return onSnapshot(q, (snapshot) => {
			let newTransactions: any = [];
			snapshot.forEach((doc) => {
				const data = doc.data();
				data.id = doc.id;
				newTransactions.push(data);
			});
			data = newTransactions;
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

<div
	class="flex flex-col items-center justify-center bg-stone-800 drop-shadow-sm rounded-3xl py-12 px-4 sm:px-6 lg:px-8 w-full gap-y-5"
>
	<div class="flex flex-row justify-between w-full">
		<button
			on:click={() => {
				goto('/app/tracker/money');
			}}
		>
			<svg width="32" height="32">
				<image xlink:href="/left-arrow.svg" width="32" height="32" />
			</svg>
		</button>
		<input
			type="text"
			bind:value={search}
			placeholder="Search"
			class="rounded-lg px-3 py-2 bg-gray-500 border border-gray-800 placeholder-gray-200 text-gray-50 rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
		/>
	</div>

	<div class="w-full grid grid-cols-4 gap-x-5">
		<div class="bg-stone-800"><button on:click={() => sortData('amount')}>Amount</button></div>
		<div class="bg-stone-800">
			<button on:click={() => sortData('newBalance')}>New Balance</button>
		</div>
		<div class="bg-stone-800"><button on:click={() => sortData('time')}>Time</button></div>
		<div class="bg-stone-800"><button on:click={() => sortData('reason')}>Reason</button></div>
	</div>
	<div class="w-full grid grid-cols-4 gap-5">
		{#each filteredData as row}
			<div>
				<div
					class="{row.amount >= 0
						? 'text-green-600 bg-green-200'
						: 'text-red-600 bg-red-200'} px-1 inline-block rounded"
				>
					{row.amount >= 0 ? '+' : '-'}${row.amount.toString().replace('-', '')}
				</div>
			</div>
			<div>
				<div
					class="{row.newBalance >= 0
						? 'text-green-600 bg-green-200'
						: 'text-red-600 bg-red-200'} px-1 inline-block rounded"
				>
					${row.newBalance}
				</div>
			</div>
			<div>
				<div>
					{row.time.toDate().toDateString()}
					{tConvert(
						row.time.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
					)}
				</div>
			</div>
			<div><div>{row.reason}</div></div>
		{/each}
	</div>
</div>
