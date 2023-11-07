<script lang="ts">
	import { goto } from '$app/navigation';
	import { db, auth } from '$lib/firebase/firebase.client';
	import { setUserData } from '$lib/storage/stores';
	import { doc, setDoc } from 'firebase/firestore';

	let errorMessage = '';
	let firstName = '';
	let lastName = '';
	let workplace = '';

	const handleRegister = async function () {
		if (!auth.currentUser) return;

		const uid = auth.currentUser.uid;
		const phoneNumber = auth.currentUser.phoneNumber;

		await setUserData({
			uid: uid,
			phone: phoneNumber,
			name: {
				first: firstName,
				last: lastName
			},
			workplace: workplace,
			balance: 0
		});

		goto('/app/tracker');
	};
</script>

<div
	class="flex items-center justify-center bg-stone-800 drop-shadow-xl rounded-3xl py-12 px-4 sm:px-6 lg:px-8"
>
	<div class="max-w-md w-full space-y-8">
		<div>
			<h2 class="text-center text-3xl font-extrabold text-gray-100">Welcome</h2>
		</div>
		{#if errorMessage != ''}
			<div>
				<h2 class="mt-6 text-center font-normal text-red-500">
					{errorMessage}
				</h2>
			</div>
		{/if}
		<div class="mt-8 space-y-6" id="sign-in-container">
			<input type="hidden" name="remember" value="true" />
			<div class="rounded-md shadow-sm -space-y-px">
				<form class="space-y-2" on:submit|preventDefault={handleRegister}>
					<label for="first-name" class="sr-only">First Name</label>
					<input
						id="first-name"
						name="first-name"
						type="text"
						required
						class="rounded-lg relative block w-full px-3 py-2 bg-gray-500 border border-gray-800 placeholder-gray-200 text-gray-50 rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
						placeholder="First Name"
						bind:value={firstName}
					/>
					<label for="last-name" class="sr-only">First Name</label>
					<input
						id="last-name"
						name="last-name"
						type="text"
						required
						class="rounded-lg relative block w-full px-3 py-2 bg-gray-500 border border-gray-800 placeholder-gray-200 text-gray-50 rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
						placeholder="Last Name"
						bind:value={lastName}
					/>
					<label for="workplace" class="sr-only">Workplace</label>
					<select
						id="workplace"
						name="workplace"
						required
						class="rounded-lg relative block w-full px-3 py-2 bg-gray-500 border border-gray-800 text-gray-50 rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
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

					<p class="text-gray-500 mt-1 text-sm">These options can be changed at a later time.</p>

					<button
						type="submit"
						class="group relative w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-gradient-to-br from-violet-600 to-violet-800 hover:bg-gradient-to-br hover:from-violet-700 hover:to-violet-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 drop-shadow-lg"
					>
						Register
					</button>
				</form>
			</div>
		</div>
	</div>
</div>
