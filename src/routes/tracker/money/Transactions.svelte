<script lang="ts">
	import { onMount } from 'svelte';
	import { onAuthStateChange } from '$lib/auth';
	import { getUserData, userData } from '$lib/storage/stores';
	import { query, orderBy, limit, collection, where, onSnapshot } from 'firebase/firestore';
	import { db } from '$lib/firebase/firebase.client';

	let user: any = null;

	let transactions: any = null;

	const formatTime = function (date: Date) {
		let hours = date.getHours();
		let minutes: number | string = date.getMinutes();
		const ampm = hours >= 12 ? 'PM' : 'AM';

		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		minutes = minutes < 10 ? '0' + minutes : minutes;

		return `${hours}:${minutes} ${ampm}`;
	};

	const formatDate = function (date: Date) {
		const months = [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec'
		];
		const month = months[date.getMonth()];
		const day = date.getDate();
		return `${month} ${day}`;
	};

	const setupRealtimeUpdates = () => {
		const queryCollection = collection(db, 'transactions');
		const q = query(
			queryCollection,
			where('uid', '==', user.uid),
			orderBy('time', 'desc'),
			limit(3)
		);

		return onSnapshot(q, (snapshot) => {
			let newTransactions: any = [];
			snapshot.forEach((doc) => {
				const data = doc.data();
				data.id = doc.id;
				newTransactions.push(data);
			});
			transactions = newTransactions;
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
	<div class="text-2xl font-bold uppercase">Transactions</div>
	{#if transactions}
		<div class="grid grid-cols-3 gap-1 auto-rows-auto">
			<div class="bg-stone-600 px-2 py-1 rounded">Amount</div>
			<div class="bg-stone-600 px-2 py-1 rounded">New Balance</div>
			<div class="bg-stone-600 px-2 py-1 rounded">Time</div>
			{#each transactions as transaction}
				<div
					class="bg-stone-600 {transaction.amount < 0
						? 'text-red-500'
						: 'text-green-500'} px-2 py-1 rounded"
				>
					${transaction.amount}
				</div>
				<div
					class="bg-stone-600 {transaction.newBalance < 0
						? 'text-red-500'
						: 'text-green-500'} px-2 py-1 rounded"
				>
					${transaction.newBalance}
				</div>
				<div class="bg-stone-600 px-2 py-1 rounded text-sm">
					{formatDate(transaction.time.toDate())}
					{formatTime(transaction.time.toDate())}
				</div>
			{/each}
		</div>
		<a
			href="/tracker/money/transactions"
			class="group relative flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-gradient-to-br from-violet-600 to-violet-800 hover:bg-gradient-to-br hover:from-violet-700 hover:to-violet-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 drop-shadow-lg mt-3"
		>
			View All
		</a>
	{:else}
		<div class="grid grid-cols-3 gap-1 w-full items-center">
			<div class="bg-gray-400 rounded-lg shadow-md px-4 py-3 animate-pulse">
				<div class="w-full bg-gray-500 rounded mb-2" />
			</div>
			<div class="bg-gray-400 rounded-lg shadow-md px-4 py-3 animate-pulse">
				<div class="w-full bg-gray-500 rounded mb-2" />
			</div>
			<div class="bg-gray-400 rounded-lg shadow-md px-4 py-3 animate-pulse">
				<div class="w-full bg-gray-500 rounded mb-2" />
			</div>
			<div class="bg-gray-400 rounded-lg shadow-md px-4 py-3 animate-pulse">
				<div class="w-full bg-gray-500 rounded mb-2" />
			</div>
			<div class="bg-gray-400 rounded-lg shadow-md px-4 py-3 animate-pulse">
				<div class="w-full bg-gray-500 rounded mb-2" />
			</div>
			<div class="bg-gray-400 rounded-lg shadow-md px-4 py-3 animate-pulse">
				<div class="w-full bg-gray-500 rounded mb-2" />
			</div>
			<div class="bg-gray-400 rounded-lg shadow-md px-4 py-3 animate-pulse">
				<div class="w-full bg-gray-500 rounded mb-2" />
			</div>
			<div class="bg-gray-400 rounded-lg shadow-md px-4 py-3 animate-pulse">
				<div class="w-full bg-gray-500 rounded mb-2" />
			</div>
			<div class="bg-gray-400 rounded-lg shadow-md px-4 py-3 animate-pulse">
				<div class="w-full bg-gray-500 rounded mb-2" />
			</div>
			<div class="bg-gray-400 rounded-lg shadow-md px-4 py-3 animate-pulse">
				<div class="w-full bg-gray-500 rounded mb-2" />
			</div>
			<div class="bg-gray-400 rounded-lg shadow-md px-4 py-3 animate-pulse">
				<div class="w-full bg-gray-500 rounded mb-2" />
			</div>
			<div class="bg-gray-400 rounded-lg shadow-md px-4 py-3 animate-pulse">
				<div class="w-full bg-gray-500 rounded mb-2" />
			</div>
		</div>
		<div class="bg-gray-400 rounded-lg shadow-md px-4 py-1 animate-pulse">
			<div class="bg-gray-400 rounded mb-2 text-transparent text-sm">View All</div>
		</div>
	{/if}
</div>
