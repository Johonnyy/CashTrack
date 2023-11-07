<script lang="ts">
	import { db, auth } from '$lib/firebase/firebase.client';
	import { onMount } from 'svelte';
	import { query, collection, where, getDocs, addDoc, Timestamp } from 'firebase/firestore';
	import { onAuthStateChange } from '$lib/auth';
	import { goto } from '$app/navigation';
	import { tConvert } from '$lib/functions';

	let shiftTimes: any[] = [];
	let shiftTimesArray: any[] = [];

	let locations: any[] = [];
	let locationsArray: any[] = [];

	let date: any;
	let shiftTime: string;
	let location: string;

	let createStartTime: string;
	let createEndTime: string;
	let createShiftTimeName: string;

	let createLocationName: string;

	const loadShiftTimes = async function () {
		if (!auth.currentUser) return;

		shiftTimes = [];

		const q = query(collection(db, 'shiftTimes'), where('uid', '==', auth.currentUser.uid));
		const snapshot = await getDocs(q);
		snapshot.forEach((doc) => {
			let data = doc.data();
			data.id = doc.id;
			shiftTimes.push(data);
		});

		shiftTimesArray = shiftTimes;
	};

	const createNewShiftTime = async function () {
		if (!auth.currentUser) return;

		const docRef = await addDoc(collection(db, 'shiftTimes'), {
			uid: auth.currentUser.uid,
			name: createShiftTimeName,
			startTime: createStartTime,
			endTime: createEndTime
		});

		await loadShiftTimes();

		shiftTime = docRef.id;
	};

	const loadLocations = async function () {
		if (!auth.currentUser) return;

		locations = [];

		const q = query(collection(db, 'locations'), where('uid', '==', auth.currentUser.uid));
		const snapshot = await getDocs(q);
		snapshot.forEach((doc) => {
			let data = doc.data();
			data.id = doc.id;
			locations.push(data);
		});

		locationsArray = locations;
	};

	const createNewLocation = async function () {
		if (!auth.currentUser) return;

		const docRef = await addDoc(collection(db, 'locations'), {
			uid: auth.currentUser.uid,
			name: createLocationName
		});

		await loadLocations();

		location = docRef.id;
	};

	const adjustDateToLocalTimezone = function (d: any) {
		const newDate = new Date(d);
		newDate.setMinutes(newDate.getMinutes() + newDate.getTimezoneOffset());
		return newDate;
	};

	const createNewShift = async function () {
		if (!auth.currentUser) return;

		const dateToUse = Timestamp.fromDate(adjustDateToLocalTimezone(date));
		const timeObject = shiftTimesArray[shiftTimesArray.findIndex((i) => i.id == shiftTime)];
		const locationObject = locationsArray[locationsArray.findIndex((i) => i.id == location)];

		const docRef = await addDoc(collection(db, 'shifts'), {
			uid: auth.currentUser.uid,
			date: dateToUse,
			time: {
				startTime: timeObject.startTime,
				endTime: timeObject.endTime,
				name: timeObject.name,
				id: shiftTime
			},
			location: locationObject.name,
			locationId: location,
			estimated: 0,
			made: 0
		});

		goto('/app/tracker');
	};

	onMount(() => {
		const unsubscribe = onAuthStateChange(async (user: any) => {
			if (user) {
				await loadShiftTimes();
				await loadLocations();
			}
		});

		return unsubscribe; // Clean up listener on component destroy
	});
</script>

<div
	class="flex flex-col items-center justify-center bg-stone-800 drop-shadow-xl rounded-3xl py-12 px-4 sm:px-6 lg:px-8 w-4/5 gap-y-5"
>
	<div class="absolute top-4 left-4 md:top-8 md:left-8">
		<button
			on:click={() => {
				goto('/app/tracker');
			}}
		>
			<svg width="32" height="32" fill="white">
				<image xlink:href="/left-arrow.svg" width="32" height="32" />
			</svg>
		</button>
	</div>
	<div class="flex items-center">
		<div class="text-xl font-extrabold uppercase flex">Create New Shift</div>
	</div>
	<form class="flex flex-col gap-y-1" on:submit|preventDefault={createNewShift}>
		<label for="date" class="">Shift Date</label>
		<input
			type="date"
			id="date"
			name="date"
			required
			bind:value={date}
			class="bg-stone-600 px-3 py-1 rounded"
		/>

		<label for="shiftTime">Shift Time</label>
		<select
			id="shiftTime"
			name="shiftTime"
			required
			class="rounded-lg relative block w-full px-3 py-2 bg-stone-600 border border-gray-800 text-gray-50 rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
			bind:value={shiftTime}
		>
			<option value="" disabled selected>Select shift time</option>

			{#each shiftTimesArray as st}
				<option value={st.id}>{st.name} ({tConvert(st.startTime)}-{tConvert(st.endTime)})</option>
			{/each}
			<option value="create">Create new shift time</option>
		</select>
		{#if shiftTime == 'create'}
			<form class="flex flex-col" on:submit|preventDefault={createNewShiftTime}>
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
				<button
					type="submit"
					class="group relative w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-gradient-to-br from-violet-600 to-violet-800 hover:bg-gradient-to-br hover:from-violet-700 hover:to-violet-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 drop-shadow-lg mt-3"
				>
					Save Time
				</button>
			</form>
		{:else}
			<label for="location">Location</label>
			<select
				id="location"
				name="location"
				required
				class="rounded-lg relative block w-full px-3 py-2 bg-stone-600 border border-gray-800 text-gray-50 rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
				bind:value={location}
			>
				<option value="" disabled selected>Select location</option>

				{#each locationsArray as lc}
					<option value={lc.id}>{lc.name}</option>
				{/each}
				<option value="create">Create new location</option>
			</select>
			{#if location == 'create'}
				<form class="flex flex-col" on:submit|preventDefault={createNewLocation}>
					<label for="locationName">Location Name</label>
					<input
						type="text"
						id="locationName"
						name="locationName"
						required
						bind:value={createLocationName}
						class="bg-stone-600 px-3 py-1 rounded"
					/>
					<button
						type="submit"
						class="group relative w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-gradient-to-br from-violet-600 to-violet-800 hover:bg-gradient-to-br hover:from-violet-700 hover:to-violet-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 drop-shadow-lg mt-3"
					>
						Save Location
					</button>
				</form>
			{:else}
				<button
					type="submit"
					class="group relative w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-gradient-to-br from-violet-600 to-violet-800 hover:bg-gradient-to-br hover:from-violet-700 hover:to-violet-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 drop-shadow-lg mt-3"
				>
					Save Shift
				</button>
			{/if}
		{/if}
	</form>
	<!-- <div class="flex items-center">
		<div class="flex flex-col">
			<div class="text-xl font-extrabold uppercase flex">Or Import From Sling</div>

			<a
				href="/app/tracker/sling"
				rel="prefetch"
				style="background-color: #0085ff"
				class="rounded px-4 py-2 mt-6 text-white drop-shadow-md font-medium"
			>
				Import &gt;
			</a>
		</div>
	</div> -->
</div>
