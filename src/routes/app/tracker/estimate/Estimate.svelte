<script lang="ts">
	import { onMount } from 'svelte';
	import { onAuthStateChange } from '$lib/auth';
	import { query, collection, where, getDocs, connectFirestoreEmulator } from 'firebase/firestore';
	import { auth, db } from '$lib/firebase/firebase.client';
	import { tConvert } from '$lib/functions';

	const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

	let user: any = null;
	let loaded = false;

	let estimatedAmount = 0;

	let shiftTimes: any[] = [];
	let shiftTimesArray: any[] = [];

	let locations: any[] = [];
	let locationsArray: any[] = [];

	let dayOfWeek: string = 'SELECT';
	let shiftTime: string = 'SELECT';
	let location: string = 'SELECT';

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

	const updateAverage = async () => {
		if (!loaded) return;

		let total: number = 0;
		let divideBy: number = 0;

		let q = query(collection(db, 'shifts'), where('uid', '==', user.uid));

		if (shiftTime !== 'SELECT' && shiftTime !== 'NONE') {
			q = query(q, where('timeId', '==', shiftTime));
		}

		if (location !== 'SELECT' && location !== 'NONE') {
			q = query(q, where('locationId', '==', location));
		}

		const querySnapshot = await getDocs(q);
		querySnapshot.forEach((doc) => {
			const data = doc.data();

			const date = data.date.toDate();
			const day = date.getDay();

			if (data.exclude) return;
			if (data.made === null) return;

			if (dayOfWeek === ('SELECT' || 'NONE')) {
				total += data.made;
				divideBy += 1;
			}

			if (dayOfWeek === daysOfWeek[day]) {
				total += data.made;
				divideBy += 1;
			}
		});

		divideBy === 0 ? (divideBy += 1) : (divideBy = divideBy);

		estimatedAmount = Math.round(total / divideBy);
	};

	onMount(() => {
		const unsubscribe = onAuthStateChange(async (newUser: any) => {
			if (newUser) {
				loaded = true;
				user = newUser;

				await loadShiftTimes();
				await loadLocations();
			}
		});

		return unsubscribe; // Clean up listener on component destroy
	});

	$: if (dayOfWeek !== null) {
		updateAverage();
	}
	$: if (shiftTime !== null) {
		updateAverage();
	}
	$: if (location !== null) {
		updateAverage();
	}
</script>

<div
	class="flex flex-col items-center justify-center bg-stone-800 drop-shadow-sm rounded-3xl py-12 px-4 sm:px-6 lg:px-8 w-full gap-y-5"
>
	<div class="text-2xl font-bold uppercase">Estimate</div>
	{#if user}
		<div class="flex flex-row text-left align-left gap-y-3">
			<div class="flex flex-col">
				<label for="shiftTime">Day of Week</label>
				<select
					id="dayOfWeek"
					name="dayOfWeek"
					class="rounded-lg relative block w-full px-3 py-2 bg-stone-600 border border-gray-800 text-gray-50 rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
					bind:value={dayOfWeek}
				>
					<option value="SELECT" selected hidden>Select day of week</option>
					<option value="NONE">None</option>

					{#each daysOfWeek as d}
						<option value={d}>{d}</option>
					{/each}
				</select>
				<label for="shiftTime">Shift Time</label>
				<select
					id="shiftTime"
					name="shiftTime"
					class="rounded-lg relative block w-full px-3 py-2 bg-stone-600 border border-gray-800 text-gray-50 rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
					placeholder="Select"
					bind:value={shiftTime}
				>
					<option value="SELECT" selected hidden>Select shift time</option>
					<option value="NONE">None</option>

					{#each shiftTimesArray as st}
						<option value={st.id}
							>{st.name} ({tConvert(st.startTime)}-{tConvert(st.endTime)})</option
						>
					{/each}
				</select>
				<label for="location">Location</label>
				<select
					id="location"
					name="location"
					class="rounded-lg relative block w-full px-3 py-2 bg-stone-600 border border-gray-800 text-gray-50 rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
					bind:value={location}
				>
					<option value="SELECT" selected hidden>Select location</option>
					<option value="NONE">None</option>

					{#each locationsArray as lc}
						<option value={lc.id}>{lc.name}</option>
					{/each}
				</select>
			</div>
			<div class="flex flex-col items-center justify-center text-center p-4 text-2xl font-light">
				Estimated Earnings:<br /> ${estimatedAmount}
			</div>
		</div>
	{/if}
</div>
