<script lang="ts">
	import Account from './Account.svelte';
	import Locations from './Locations.svelte';
	import ShiftTimes from './ShiftTimes.svelte';

	import { fly, slide } from 'svelte/transition';
	import { writable } from 'svelte/store';
	import { afterUpdate } from 'svelte';

	let active = 'account';
	const prevActive = writable(active);

	function setTab(tab: string) {
		prevActive.set(active);
		active = tab;
	}

	function getDirection(newTab: string, oldTab: string) {
		const tabs = ['account', 'shift_times', 'locations'];
		return tabs.indexOf(newTab) > tabs.indexOf(oldTab) ? 1 : -1;
	}

	afterUpdate(() => {
		prevActive.set(active);
	});
</script>

<svelte:head>
	<title>Settings</title>
</svelte:head>

<section>
	<div class="flex flex-col overflow-hidden">
		<div
			class="flex flex-row justify-between gap-x-3 sm:text-xs md:text-lg font-medium text-center border-gray-700 text-gray-400"
		>
			<div>
				<button
					on:click={() => {
						active = 'account';
					}}
					class="inline-block py-4 md:py-4 px-4 md:px-20 rounded-t-lg transition duration-300 ease-in-out {active ==
					'account'
						? 'bg-stone-800 text-gray-300'
						: 'hover:bg-stone-800 hover:text-gray-300'}"
				>
					Account
				</button>
			</div>
			<div>
				<button
					on:click={() => {
						active = 'shift_times';
					}}
					class="inline-block py-4 md:py-4 px-4 md:px-20 rounded-t-lg transition duration-300 ease-in-out {active ==
					'shift_times'
						? 'bg-stone-800 text-gray-300'
						: 'hover:bg-stone-800 hover:text-gray-300'}"
				>
					Shift Times
				</button>
			</div>
			<div>
				<button
					on:click={() => {
						active = 'locations';
					}}
					class="inline-block py-4 md:py-4 px-4 md:px-20 rounded-t-lg transition duration-300 ease-in-out {active ==
					'locations'
						? 'bg-stone-800 text-gray-300'
						: 'hover:bg-stone-800 hover:text-gray-300'}"
				>
					Locations
				</button>
			</div>
		</div>
		<div class="overflow-hidden">
			{#if active == 'account'}
				<div
					class="bg-stone-800 px-5 py-8 rounded-b-lg shadow-lg"
					in:fly={{ x: 1000 * getDirection(active, $prevActive), delay: 300 }}
					out:fly={{ x: 1000 * getDirection($prevActive, active), duration: 300 }}
				>
					<Account />
				</div>
			{:else if active == 'shift_times'}
				<div
					class="bg-stone-800 px-5 py-8 rounded-b-lg shadow-lg"
					in:fly={{ x: 1000 * getDirection(active, $prevActive), delay: 300 }}
					out:fly={{ x: 1000 * getDirection($prevActive, active), duration: 300 }}
				>
					<ShiftTimes />
				</div>
			{:else if active == 'locations'}
				<div
					class="bg-stone-800 px-5 py-8 rounded-b-lg shadow-lg"
					in:fly={{ x: 1000 * getDirection(active, $prevActive), delay: 300 }}
					out:fly={{ x: 1000 * getDirection($prevActive, active), duration: 300 }}
				>
					<Locations />
				</div>
			{/if}
		</div>
	</div>
</section>

<style>
	section {
		overflow: hidden;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		flex: 0.6;
	}
</style>
