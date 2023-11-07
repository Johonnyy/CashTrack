<script lang="ts">
	import { onMount } from 'svelte';
	import { getUserData, updateUserData } from '$lib/storage/stores';
	import { onAuthStateChange } from '$lib/auth';

	let user: any = null;
	let firstName: string = '';
	let lastName: string = '';
	let workplace: string = '';

	const saveAccountOptions = async function () {
		await updateUserData({ name: { first: firstName, last: lastName }, workplace: workplace });
	};

	onMount(() => {
		const unsubscribe = onAuthStateChange(async (newUser: any) => {
			user = await getUserData();
			if (user) {
				firstName = user.name.first;
				lastName = user.name.last;
				workplace = user.workplace;
			}
		});

		return unsubscribe; // Clean up listener on component destroy
	});
</script>

<div class="text-white flex flex-col justify-center items-center w-full gap-y-5">
	<div class="text-2xl font-bold uppercase text-center">Account</div>
	{#if user}
		<div class="flex flex-col justify-center w-3/5 gap-y-6">
			<div class="flex flex-row justify-center gap-x-5 w-full">
				<input
					type="text"
					bind:value={firstName}
					class="drop-shadow bg-transparent outline-none appearance-none border-b-white border-l-gray-600 border-b-2 p-3 w-full"
					placeholder="First Name"
				/>
				<input
					type="text"
					bind:value={lastName}
					class="drop-shadow bg-transparent outline-none appearance-none border-b-white border-l-gray-600 border-b-2 p-3 w-full"
					placeholder="Last Name"
				/>
			</div>
			<div class="flex flex-row justify-center w-full gap-y-6">
				<label for="workplace" class="sr-only">Workplace</label>
				<select
					id="workplace"
					name="workplace"
					required
					class="w-full px-3 py-2 bg-stone-800 border-b-2 rounded-t-md focus:outline-none focus:z-10 sm:text-sm"
					bind:value={workplace}
				>
					<option value="" disabled selected>Select your workplace</option>
					<option value="restaurant">Restaurant</option>
					<option value="bar">Bar</option>
					<option value="cafe">Cafe</option>
					<option value="hair_salon">Hair Salon</option>
					<option value="spa">Spa</option>
					<option value="nail_salon">Nail Salon</option>
					<option value="hotel">Hotel</option>
					<option value="casino">Casino</option>
					<option value="taxi_service">Taxi Service</option>
					<option value="ride_share">Ride Share (e.g., Uber, Lyft)</option>
					<option value="tour_guide">Tour Guide</option>
					<option value="valet_parking">Valet Parking</option>
					<option value="golf_caddy">Golf Caddy</option>
					<option value="catering">Catering</option>
					<option value="delivery_driver">Delivery Driver</option>
					<option value="personal_trainer">Personal Trainer</option>
					<option value="massage_therapist">Massage Therapist</option>
					<option value="pet_grooming">Pet Grooming</option>
					<option value="housekeeping">Housekeeping</option>
					<option value="concierge">Concierge</option>
					<option value="moving_service">Moving Service</option>
					<option value="other">Other</option>
				</select>
			</div>
			<button
				on:click={saveAccountOptions}
				class="group relative flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-gradient-to-br from-violet-600 to-violet-800 hover:bg-gradient-to-br hover:from-violet-700 hover:to-violet-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 drop-shadow-lg mt-3"
			>
				Save Options
			</button>
		</div>
	{/if}
</div>
