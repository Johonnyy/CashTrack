<script lang="ts">
	import { auth } from '$lib/firebase/firebase.client';
	import {
		getAuth,
		RecaptchaVerifier,
		signInWithPhoneNumber,
		type ConfirmationResult
	} from 'firebase/auth';
	import { onMount } from 'svelte';

	let phoneNumber = '';
	let confirmationResult: ConfirmationResult; // to store the confirmation result

	let recaptchaVerifier: RecaptchaVerifier;

	onMount(() => {
		recaptchaVerifier = new RecaptchaVerifier(auth, 'sign-in-button', {
			size: 'invisible',
			callback: () => {
				// reCAPTCHA solved - initiate signInWithPhoneNumber
				onSignInSubmit();
			}
		});
	});

	async function onSignInSubmit() {
		if (!phoneNumber.startsWith('+')) {
			phoneNumber = '+1 ' + phoneNumber;
		}

		try {
			confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
			console.log(confirmationResult);
			// SMS sent. Prompt user to type the code from the message.
		} catch (error) {
			console.error(error);
			// Handle error.
		}
	}

	async function onVerifyCodeSubmit(verificationCode: string) {
		try {
			const result = await confirmationResult.confirm(verificationCode);
			// User signed in successfully.
			console.log(result.user);
		} catch (error) {
			console.error(error);
			// Handle error.
		}
	}
</script>

<div
	class="flex items-center justify-center bg-stone-800 drop-shadow-xl rounded-3xl py-12 px-4 sm:px-6 lg:px-8"
>
	<div class="max-w-md w-full space-y-8">
		<div>
			<h2 class="mt-6 tesxt-center text-3xl font-extrabold text-gray-100">
				Sign in with your phone
			</h2>
		</div>
		<div class="mt-8 space-y-6" id="sign-in-container">
			<input type="hidden" name="remember" value="true" />
			<div class="rounded-md shadow-sm -space-y-px">
				<div>
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
					<p class="text-gray-500 mt-1 text-sm">
						You will recieve an SMS for verification. Standard data rates apply
					</p>
				</div>
			</div>

			<div>
				<button
					on:click={onSignInSubmit}
					type="submit"
					class="group relative w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-gradient-to-br from-indigo-600 to-indigo-800 hover:bg-gradient-to-br hover:from-indigo-700 hover:to-indigo-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 drop-shadow-lg"
				>
					Send Code
				</button>
			</div>
		</div>
	</div>
</div>

<div class="absolute bottom-3 right-0" id="sign-in-button" />
