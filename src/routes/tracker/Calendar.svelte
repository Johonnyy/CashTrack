<script lang="ts">
	import { db, auth } from '$lib/firebase/firebase.client';
	import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import { onAuthStateChange } from '$lib/auth';
	import { tConvert } from '$lib/functions';
	import { getUserData } from '$lib/user';

	const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

	const today = new Date();

	let shifts: any[] = [];

	let user: any;

	let finishingShift = '';
	let finishingTips: number;
	let finishingExclude = false;

	let finishedShifts: string[] = [];

	let weekIndex = 0; // Today
	let dateToUse = new Date(today.getFullYear(), today.getMonth(), today.getDate() + weekIndex * 7);
	let sunday = new Date(
		dateToUse.getFullYear(),
		dateToUse.getMonth(),
		dateToUse.getDate() - dateToUse.getDay()
	);
	let weekDays = Array.from({ length: 7 }, (v, i) => {
		const day = new Date(sunday);
		day.setDate(day.getDate() + i);
		return day;
	});

	const moveBack = function () {
		weekIndex--;
		refreshDateToUse();
	};

	const moveForward = function () {
		weekIndex++;
		refreshDateToUse();
	};

	const refreshDateToUse = function () {
		dateToUse = new Date(today.getFullYear(), today.getMonth(), today.getDate() + weekIndex * 7);
		sunday = new Date(
			dateToUse.getFullYear(),
			dateToUse.getMonth(),
			dateToUse.getDate() - dateToUse.getDay()
		);
		weekDays = Array.from({ length: 7 }, (v, i) => {
			const day = new Date(sunday);
			day.setDate(day.getDate() + i);
			return day;
		});
	};

	const findShifts = function (date: any) {
		return shifts.filter((shift) => shift.date.toDateString() === date.toDateString());
	};

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

				newShifts.push(data);
			});

			shifts = newShifts;
		}
	};

	const startClosingShift = function (shiftId: string) {
		finishingShift = shiftId;
	};

	const finishClosing = async function () {
		//finishingShift finishingTips finishingExclude

		const newFinishedShifts = finishedShifts;

		await updateDoc(doc(db, 'shifts', finishingShift), {
			made: finishingTips,
			exclude: finishingExclude
		});

		if (user) {
			const userData = await getUserData();
			if (userData) {
				await updateDoc(doc(db, 'users', user.uid), {
					balance: userData.balance + finishingTips
				});
			}
		}

		newFinishedShifts.push(finishingShift);
		finishedShifts = newFinishedShifts;

		finishingShift = '';
	};

	onMount(() => {
		const unsubscribe = onAuthStateChange(async (newUser: any) => {
			if (newUser) {
				user = newUser;
				await reloadShifts();
				refreshDateToUse();
			}
		});

		return unsubscribe; // Clean up listener on component destroy
	});
</script>

<div
	class="flex flex-col items-center justify-center bg-stone-800 drop-shadow-xl rounded-3xl py-12 px-4 sm:px-6 lg:px-8 w-4/5 gap-y-5"
>
	<div class="flex items-center">
		<div class="text-lg font-extrabold uppercase flex">
			Week of {sunday.getMonth()}-{sunday.getDate()}-{sunday.getFullYear()}
		</div>
	</div>
	<div class="flex flex-row">
		<a
			href="/tracker/newshift"
			rel="prefetch"
			class="text-white bg-gradient-to-br from-indigo-600 to-indigo-800 hover:bg-gradient-to-br hover:from-indigo-700 hover:to-indigo-900 h-10 ml-1 my-1 rounded"
			><p class="px-5 py-2">New Shift</p></a
		>
		<button
			on:click={moveBack}
			class="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:bg-gradient-to-br hover:from-indigo-700 hover:to-indigo-800 h-10 ml-1 my-1 rounded rounded-r-none px-2"
			>&lt;</button
		>
		<button
			on:click={moveForward}
			class="bg-gradient-to-r from-indigo-700 to-indigo-800 hover:bg-gradient-to-br hover:from-indigo-800 hover:to-indigo-900 h-10 my-1 rounded rounded-l-none px-2"
			>&gt;</button
		>
	</div>
	<div class="flex flex-col w-full items-center gap-y-1">
		{#each weekDays as day, index}
			<div
				class="rounded border {day.toDateString() == today.toDateString()
					? 'border-stone-300 border-2'
					: 'border-stone-600'} bg-stone-700 text-center p-4 w-5/6 drop-shadow-md"
			>
				<div class="text-lg font-bold">
					{daysOfWeek[day.getDay()]} ({weekDays[index].getMonth()}-{weekDays[index].getDate()})
				</div>
				{#if findShifts(weekDays[index]).length > 0}
					{#each findShifts(weekDays[index]) as shift}
						<div
							class="flex flex-col items-center bg-stone-800 drop-shadow-xl rounded-md py-5 mt-5"
						>
							<div>
								{shift.time.name} ({tConvert(shift.time.startTime)} - {tConvert(
									shift.time.endTime
								)})
							</div>
							<br />
							<div>
								{shift.location}
							</div>
							<br />
							<div>Estimated Earnings: No Data</div>
							<br />
							{#if shift.made > 0 || finishedShifts.includes(shift.id)}
								<a
									href="/tracker/shift/{shift.id}"
									class="group relative w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-gradient-to-br from-blue-600 to-blue-800 hover:bg-gradient-to-br hover:from-blue-700 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 drop-shadow-lg mt-3"
								>
									Manage Shift
								</a>
							{:else if shift.id === finishingShift}
								<form class="flex flex-col" on:submit|preventDefault={finishClosing}>
									<input
										type="number"
										placeholder="Enter Tips"
										class="bg-stone-600 rounded px-3 py-1"
										required
										bind:value={finishingTips}
									/>
									<label for="exclude">Exclude from training?</label>
									<input
										type="checkbox"
										id="exclude"
										name="exclude"
										placeholder="Exclude from training?"
										class="bg-stone-600 rounded px-3 py-1"
										bind:value={finishingExclude}
									/>
									<button
										type="submit"
										class="group relative w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-gradient-to-br from-green-600 to-green-800 hover:bg-gradient-to-br hover:from-green-700 hover:to-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 drop-shadow-lg mt-3"
										>Submit</button
									>
								</form>
							{:else if shift.made === 0}
								<div class="flex flex-row center gap-x-3">
									<button
										on:click={() => startClosingShift(shift.id)}
										class="group relative w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-gradient-to-br from-green-600 to-green-800 hover:bg-gradient-to-br hover:from-green-700 hover:to-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 drop-shadow-lg mt-3"
									>
										Close Shift
									</button>
									<a
										href="/tracker/shift/{shift.id}"
										class="group relative w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-gradient-to-br from-blue-600 to-blue-800 hover:bg-gradient-to-br hover:from-blue-700 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 drop-shadow-lg mt-3"
									>
										Manage Shift
									</a>
								</div>
							{/if}
						</div>
					{/each}
				{:else}
					<div class="text-gray-500">No shifts planned</div>
				{/if}
			</div>
		{/each}
	</div>
</div>
