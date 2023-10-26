<script lang="ts">
	import { auth } from '$lib/firebase/firebase.client';
	import {
		RecaptchaVerifier,
		signInWithPhoneNumber,
		type ConfirmationResult,
		setPersistence,
		browserLocalPersistence
	} from 'firebase/auth';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let errorMessage = '';
	let phoneNumber = '';
	let verificationCode = '';
	let confirmationResult: ConfirmationResult;
	let recaptchaVerifier: RecaptchaVerifier;

	onMount(async () => {
		await setPersistence(auth, browserLocalPersistence)
			.then(() => {
				console.log('Persistence set successfully');
			})
			.catch((error) => {
				console.error('Failed to set persistence:', error);
			});

		recaptchaVerifier = new RecaptchaVerifier(auth, 'sign-in-button', {
			size: 'invisible',
			callback: () => {}
		});
	});

	async function onSignInSubmit() {
		// called after user puts in their phone number and submits
		if (!phoneNumber.startsWith('+')) {
			phoneNumber = '+1 ' + phoneNumber;
		}

		try {
			confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
		} catch (error: any) {
			console.error(error);
			if (error.code === 'auth/invalid-phone-number') {
				errorMessage = 'The phone number is invalid. Please enter a valid phone number.';
			} else if (error.code === 'auth/quota-exceeded') {
				errorMessage = 'There has been an error sending your code. Please try again later.';
			} else {
				// Handle other types of errors
				alert(error.message);
			}
			// Handle error.
		}
	}

	async function onVerifyCodeSubmit() {
		// called after user hits button to submit code
		try {
			const result = await confirmationResult.confirm(verificationCode);

			goto('/tracker');
		} catch (error: any) {
			console.error(error);
			if (error.code === 'auth/invalid-verification-code') {
				errorMessage =
					'The verification code is invalid. Please enter the correct verification code.';
			} else if (error.code === 'auth/code-expired') {
				errorMessage = 'The verification code has expired. Please request a new verification code.';
			} else {
				// Handle other types of errors
				alert(error.message);
			}
			// Handle error.
		}
	}
</script>

<div
	class="flex items-center justify-center bg-stone-800 drop-shadow-xl rounded-3xl py-12 px-4 sm:px-6 lg:px-8"
>
	<div class="max-w-md w-full space-y-8">
		<div>
			<h2 class="text-center text-3xl font-extrabold text-gray-100">Sign in with your phone</h2>
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
				<div class="space-y-2">
					<label for="phone-number" class="sr-only">Phone Number</label>
					<input
						id="phone-number"
						name="phone-number"
						type="tel"
						pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
						required
						class="rounded-lg relative block w-full px-3 py-2 bg-gray-500 border border-gray-800 placeholder-gray-200 text-gray-50 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
						placeholder="Phone Number"
						bind:value={phoneNumber}
					/>
					{#if !confirmationResult}
						<p class="text-gray-500 mt-1 text-sm">
							You will recieve an SMS for verification. Standard data rates apply
						</p>
					{:else}
						<label for="verification-code" class="sr-only mt-3">Verification Code</label>
						<input
							id="verification-code"
							name="verification-code"
							type="number"
							required
							class="rounded-lg relative block w-full px-3 py-2 bg-gray-500 border border-gray-800 placeholder-gray-200 text-gray-50 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
							placeholder="Verification Code"
							bind:value={verificationCode}
						/>
					{/if}
				</div>
			</div>

			<div>
				{#if !confirmationResult}
					<button
						on:click={onSignInSubmit}
						type="submit"
						class="group relative w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-gradient-to-br from-indigo-600 to-indigo-800 hover:bg-gradient-to-br hover:from-indigo-700 hover:to-indigo-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 drop-shadow-lg"
					>
						Send Code
					</button>
				{:else}
					<button
						on:click={onVerifyCodeSubmit}
						type="submit"
						class="group relative w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-gradient-to-br from-indigo-600 to-indigo-800 hover:bg-gradient-to-br hover:from-indigo-700 hover:to-indigo-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 drop-shadow-lg"
					>
						Verify
					</button>
				{/if}
			</div>
		</div>
	</div>
</div>

<div class="absolute bottom-3 right-0" id="sign-in-button" />
