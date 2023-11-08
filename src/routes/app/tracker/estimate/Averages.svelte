<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { onAuthStateChange } from '$lib/auth';
	import { query, collection, where, getDocs } from 'firebase/firestore';
	import { auth, db } from '$lib/firebase/firebase.client';
	import { fly } from 'svelte/transition';

	let user: any = null;
	let shifts: any[] = [];

	const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	let averages: any[] = [null, null, null, null, null, null, null];
	let dayCount = [0, 0, 0, 0, 0, 0, 0];

	let totalAmountMade = 0;
	let totalShifts = 0;
	let averagePerShift = 0;

	const reloadShifts = async function () {
		const user = auth.currentUser;
		if (user) {
			const newShifts: any[] = [];
			const q = query(collection(db, 'shifts'), where('uid', '==', user.uid));
			const snapshot = await getDocs(q);
			shifts.length = 0;
			snapshot.forEach((doc) => {
				let data = doc.data();
				data.id = doc.id;
				data.date = data.date.toDate();

				if (data.exclude === false) {
					averages[data.date.getDay()] = (averages[data.date.getDay()] || 0) + data.made;
					dayCount[data.date.getDay()] = dayCount[data.date.getDay()] + 1;

					if (data.made != 0) {
						totalAmountMade = totalAmountMade + data.made;
						totalShifts = totalShifts + 1;
					}
				}

				newShifts.push(data);
			});

			shifts = newShifts;
		}
	};

	const calculateAverages = async () => {
		for (let index = 0; index < dayCount.length; index++) {
			const divideBy = dayCount[index];
			if (averages[index] != null) {
				averages[index] = Math.round(averages[index] / divideBy);
			}
		}

		averagePerShift = totalAmountMade / totalShifts;
	};

	// MOBILE

	let currentDay = 0;
	let slideInFromLeft = false;
	const increaseCurrentDay = async () => {
		slideInFromLeft = false;
		await tick();
		currentDay = currentDay == 6 ? 0 : currentDay + 1;
	};

	const decreaseCurrentDay = async () => {
		slideInFromLeft = true;
		await tick();
		currentDay = currentDay == 0 ? 6 : currentDay - 1;
	};

	// ONMOUNT

	onMount(() => {
		const unsubscribe = onAuthStateChange(async (newUser: any) => {
			if (newUser) {
				user = newUser;

				await reloadShifts();
				await calculateAverages();
			}
		});

		return unsubscribe; // Clean up listener on component destroy
	});
</script>

<div
	class="flex flex-col items-center justify-center bg-stone-800 drop-shadow-sm rounded-3xl py-12 px-4 sm:px-6 lg:px-8 w-full gap-y-5"
>
	<div class="text-2xl font-bold uppercase">Averages</div>
	{#if user}
		<div class="hidden md:grid grid-cols-7 gap-x-3">
			{#each daysOfWeek as day}
				<div class="w-full text-lg font-semibold bg-stone-700 p-3 text-center rounded-t-md">
					{day}
				</div>
			{/each}
			{#each averages as avg}
				<div
					class="w-full text-md font-light bg-stone-700 p-3 text-center rounded-b-md {Math.max(
						...averages
					) == avg
						? 'text-green-500'
						: ''}"
				>
					{#if !avg}
						No Data :(
					{:else}
						${avg}
					{/if}
				</div>
			{/each}
		</div>
		<div class="flex md:hidden flex-col w-3/5 h-36 relative gap-y-3">
			{#each [currentDay] as day (day)}
				<div class="h-24 w-full absolute">
					<div
						class="w-full text-lg font-semibold bg-stone-700 p-3 text-center rounded-t-md"
						in:fly={{ delay: 300, x: slideInFromLeft ? -200 : 200 }}
						out:fly={{ duration: 300, x: slideInFromLeft ? 200 : -200 }}
					>
						{daysOfWeek[day]}
					</div>
					<div
						class="w-full text-md font-light bg-stone-700 p-3 text-center rounded-b-md {Math.max(
							...averages
						) == averages[day]
							? 'text-green-500'
							: ''}"
						in:fly={{ delay: 300, x: slideInFromLeft ? -200 : 200 }}
						out:fly={{ duration: 300, x: slideInFromLeft ? 200 : -200 }}
					>
						{#if averages[day] === null}
							No Data :(
						{:else}
							${averages[day]}
						{/if}
					</div>
				</div>
			{/each}
			<div class="absolute flex flex-row w-full justify-center gap-x-3 bottom-0">
				<button class="text-2xl" on:click={() => decreaseCurrentDay()}>&lt;</button>
				<button class="text-2xl" on:click={() => increaseCurrentDay()}>&gt;</button>
			</div>
		</div>
		<div class="flex flex-row gap-x-5 text-lg font-light">
			<div>Per Shift</div>
			<div>-</div>
			<div>${averagePerShift}</div>
		</div>
	{/if}
</div>
