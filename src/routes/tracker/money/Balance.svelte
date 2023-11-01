<script lang="ts">
	import { getUserData, updateUserData } from '$lib/storage/stores';
	import { onMount } from 'svelte';
	import { onAuthStateChange } from '$lib/auth';
	import { newTransaction } from '$lib/user';

	let user: any = null;
	let balance: number = 0;

	let amount: number | null = null;
	$: if (amount !== null && amount < 0) {
		amount = 0;
	}

	let reason: string = '';

	const subtractMoney = async function () {
		if (!amount) return;
		amount = amount;
		let userData = await getUserData();
		let currentBalance = userData.balance;
		let newBalance = currentBalance + -amount;
		balance = newBalance;
		await newTransaction(-amount, newBalance, reason);
		await updateUserData({ balance: newBalance });
		resetValues();
	};

	const addMoney = async function () {
		if (!amount) return;
		amount = amount;
		let userData = await getUserData();
		let currentBalance = userData.balance;
		let newBalance = currentBalance + amount;
		balance = newBalance;
		await newTransaction(amount, newBalance, reason);
		await updateUserData({ balance: newBalance });
		resetValues();
	};

	const resetValues = function () {
		amount = null;
		reason = '';
	};

	onMount(() => {
		const unsubscribe = onAuthStateChange(async (newUser: any) => {
			if (newUser) {
				user = await getUserData();
				balance = user.balance;
			}
		});

		return unsubscribe; // Clean up listener on component destroy
	});
</script>

<div
	class="flex flex-col items-center justify-center bg-stone-800 drop-shadow-sm rounded-3xl py-12 px-4 sm:px-6 lg:px-8 w-full gap-y-5"
>
	<div class="text-2xl font-bold uppercase">Balance</div>
	{#if user}
		<div class="text-md font-medium">
			You have <span
				class="{balance > 0 || balance == 0 ? 'text-green-500' : 'text-red-500'} inline"
				>${balance}</span
			>
		</div>
		<div class="flex flex-col gap-y-1">
			<input
				type="number"
				placeholder="Amount*"
				bind:value={amount}
				class="rounded-lg px-3 py-2 bg-gray-500 border border-gray-800 placeholder-gray-200 text-gray-50 rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
			/>
			<input
				type="text"
				placeholder="Reason"
				bind:value={reason}
				class="rounded-lg px-3 py-2 bg-gray-500 border border-gray-800 placeholder-gray-200 text-gray-50 rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
			/>
			<div>
				<button
					on:click={subtractMoney}
					class="py-2 px-4 text-sm font-medium rounded-md text-white bg-gradient-to-br from-red-600 to-red-800 hover:bg-gradient-to-br hover:from-red-700 hover:to-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 drop-shadow-lg"
				>
					Subtract Money
				</button>
				<button
					on:click={addMoney}
					class="py-2 px-4 text-sm font-medium rounded-md text-white bg-gradient-to-br from-green-600 to-green-800 hover:bg-gradient-to-br hover:from-green-700 hover:to-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 drop-shadow-lg"
				>
					Add Money
				</button>
			</div>
		</div>
	{:else}
		<div class="bg-gray-400 rounded-lg shadow-md px-4 py-1 w-3/5 animate-pulse">
			<div class="w-full bg-gray-500 rounded mb-2" />
		</div>
		<div class="flex flex-col gap-y-1 w-3/5">
			<div class="flex flex-col bg-gray-400 rounded-lg shadow-md px-4 py-2 animate-pulse">
				<div class="w-full bg-gray-500 rounded mb-2" />
			</div>
			<div class="flex flex-col bg-gray-400 rounded-lg shadow-md px-4 py-2 animate-pulse">
				<div class="w-full bg-gray-500 rounded mb-2" />
			</div>
			<div class="flex flex-row gap-x-2">
				<div class="flex flex-col w-full bg-gray-400 rounded-lg shadow-md px-4 py-3 animate-pulse">
					<div class="w-full bg-gray-500 rounded mb-2" />
				</div>
				<div class="flex flex-col w-full bg-gray-400 rounded-lg shadow-md px-4 py-3 animate-pulse">
					<div class="w-full bg-gray-500 rounded mb-2" />
				</div>
			</div>
		</div>{/if}
</div>
