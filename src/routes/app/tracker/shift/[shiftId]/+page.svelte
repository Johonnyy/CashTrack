<script lang="ts">
	import {
		collection,
		query,
		where,
		getDocs,
		deleteDoc,
		doc,
		addDoc,
		Timestamp,
		updateDoc
	} from 'firebase/firestore';
	import { db, auth } from '$lib/firebase/firebase.client';
	import { onAuthStateChange } from '$lib/auth';
	import { onMount } from 'svelte';
	import { tConvert } from '$lib/functions';
	import { goto } from '$app/navigation';
	import { getUserData, updateUserData } from '$lib/storage/stores';
	import { newTransaction } from '$lib/user.js';

	let currentUser: any;

	export let data;
	let shift: any;

	let deleting = false;
	let editing = false;

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

	let oldMade = 0;
	let made = 0;

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

	const formatDate = function (date: any) {
		var d = new Date(date),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear();

		if (month.length < 2) month = '0' + month;
		if (day.length < 2) day = '0' + day;

		return [year, month, day].join('-');
	};

	const editShift = async function () {
		if (!auth.currentUser) return;

		const dateToUse = Timestamp.fromDate(adjustDateToLocalTimezone(date));
		const timeObject = shiftTimesArray[shiftTimesArray.findIndex((i) => i.id == shiftTime)];
		const locationObject = locationsArray[locationsArray.findIndex((i) => i.id == location)];

		console.log(data.shiftId);

		const docRef = await updateDoc(doc(db, 'shifts', data.shiftId), {
			date: dateToUse,
			time: {
				startTime: timeObject.startTime,
				endTime: timeObject.endTime,
				name: timeObject.name,
				id: shiftTime
			},
			location: locationObject.name,
			locationId: location,
			made: made
		});

		let changeToBalance = made - oldMade;
		let userData = await getUserData();

		if (changeToBalance !== 0) {
			await newTransaction(changeToBalance, userData.balance + changeToBalance, 'Updated Shift');
		}

		await updateUserData({ balance: userData.balance + changeToBalance });

		goto('/app/tracker');
	};

	const startDeleteShift = async function () {
		deleting = true;
	};

	const deleteShift = async function () {
		const userData = await getUserData();
		if (userData) {
			if (shift.made !== 0) {
				await newTransaction(-shift.made, userData.balance - shift.made, 'Deleted Shift');
			}

			await updateUserData({
				balance: userData.balance - shift.made
			});
		}
		await deleteDoc(doc(db, 'shifts', data.shiftId));
		await goto('/app/tracker');
	};

	onMount(() => {
		const unsubscribe = onAuthStateChange(async (user: any) => {
			if (user) {
				const userQueries = query(collection(db, 'shifts'), where('uid', '==', user.uid));
				const querySnapshot = await getDocs(userQueries);
				querySnapshot.forEach((doc) => {
					if (doc.id === data.shiftId) {
						shift = doc.data();
						location = shift.locationId;
						shiftTime = shift.time.id;
						made = shift.made;
						oldMade = shift.made;
						date = formatDate(shift.date.toDate());
					}
					//console.log(doc.id, ' => ', doc.data());
				});

				currentUser = user;

				await loadShiftTimes();
				await loadLocations();
			}
		});

		return unsubscribe; // Clean up listener on component destroy
	});
</script>

<svelte:head>
	<title>Manage Shift</title>
	<meta name="description" content="Calendar Viewer" />
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<section class="text-white">
	<div
		class="flex flex-col items-center justify-center bg-stone-800 drop-shadow-sm rounded-3xl py-12 px-4 sm:px-6 lg:px-8 w-full gap-y-5"
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
		<div class="text-2xl font-bold uppercase">Manage Shift</div>

		{#if shift}
			{#if !editing}
				<div class="text-lg">
					{shift.time.name} ({tConvert(shift.time.startTime)} - {tConvert(shift.time.endTime)})
				</div>
				<div class="text-lg">
					{shift.location}
				</div>
				{#if shift.made > 0}
					<div class="font-medium">
						You made <span class="text-green-500 inline">${shift.made}</span>
					</div>
				{/if}
				<div class="flex flex-row gap-x-3">
					<button
						on:click={() => (editing = true)}
						class="bg-gradient-to-br from-violet-600 to-violet-800 hover:bg-gradient-to-br hover:from-violet-700 hover:to-violet-900 rounded px-4 py-2 mt-6 text-white drop-shadow-md font-medium"
						>Edit Shift</button
					>
					{#if !deleting}
						<button
							on:click={startDeleteShift}
							class="bg-gradient-to-br from-red-600 to-red-800 hover:bg-gradient-to-br hover:from-red-700 hover:to-red-900 rounded px-4 py-2 mt-6 text-white drop-shadow-md font-medium"
							>Delete</button
						>
					{:else}
						<button
							on:click={deleteShift}
							class="bg-gradient-to-br from-red-600 to-red-800 hover:bg-gradient-to-br hover:from-red-700 hover:to-red-900 rounded px-4 py-2 mt-6 text-white drop-shadow-md font-medium"
							>Are You Sure?</button
						>
					{/if}
				</div>
			{:else}
				<form class="flex flex-col gap-y-1" on:submit|preventDefault={editShift}>
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
							<option value={st.id}
								>{st.name} ({tConvert(st.startTime)}-{tConvert(st.endTime)})</option
							>
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
							<label for="moneyMade">Money Made</label>
							<input
								type="number"
								id="moneyMade"
								name="moneyMade"
								required
								bind:value={made}
								class="bg-stone-600 px-3 py-1 rounded"
							/>
							<button
								type="submit"
								class="group relative w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-gradient-to-br from-green-600 to-green-800 hover:bg-gradient-to-br hover:from-green-700 hover:to-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 drop-shadow-lg mt-3"
							>
								Save
							</button>
						{/if}
					{/if}
				</form>

				<div class="flex flex-row gap-x-3">
					<button
						on:click={() => (editing = false)}
						class="bg-gradient-to-br from-violet-600 to-violet-800 hover:bg-gradient-to-br hover:from-violet-700 hover:to-violet-900 rounded px-4 py-2 mt-6 text-white drop-shadow-md font-medium"
						>Cancel</button
					>
					{#if !deleting}
						<button
							on:click={startDeleteShift}
							class="bg-gradient-to-br from-red-600 to-red-800 hover:bg-gradient-to-br hover:from-red-700 hover:to-red-900 rounded px-4 py-2 mt-6 text-white drop-shadow-md font-medium"
							>Delete</button
						>
					{:else}
						<button
							on:click={deleteShift}
							class="bg-gradient-to-br from-red-600 to-red-800 hover:bg-gradient-to-br hover:from-red-700 hover:to-red-900 rounded px-4 py-2 mt-6 text-white drop-shadow-md font-medium"
							>Are You Sure?</button
						>
					{/if}
				</div>{/if}
		{/if}
	</div>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}
</style>
