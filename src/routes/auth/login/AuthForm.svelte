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
	import { fly } from 'svelte/transition';
	import Page from '../../+page.svelte';

	let loading = false;

	let errorMessage = '';
	let phoneValid = false;
	let phoneNumber = '';
	$: {
		phoneNumber = formatPhoneNumber(phoneNumber);
	}
	let verificationCodeInputs: any[] = [];
	let verificationCodeDigits = Array(6).fill('');
	let verificationCode = '';
	let confirmationResult: ConfirmationResult | null;
	let recaptchaVerifier: RecaptchaVerifier;

	// https://stackoverflow.com/questions/8358084/regular-expression-to-reformat-a-us-phone-number-in-javascript

	function formatPhoneNumber(phoneNumberString: string) {
		phoneNumberString = phoneNumberString.replace(/[^0-9]+/g, '');
		var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
		var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
		if (match) {
			var intlCode = match[1] ? '+1 ' : '';
			var final = [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
			phoneValid = true;
			errorMessage = '';
			return final;
		}

		if (phoneNumberString.length >= 11) {
			errorMessage = 'The phone number is invalid. Please enter a valid phone number.';
		} else {
			errorMessage = '';
		}

		phoneValid = false;
		return phoneNumberString;
	}

	const handleInput = async function (index: any, event: any) {
		const inputValue = event.target.value;
		if (inputValue.length === 6 && index === 0) {
			// Populate the 6 boxes and shift focus to the last one
			verificationCodeDigits = inputValue.split('');
			verificationCodeInputs[verificationCodeInputs.length - 1].focus();
			verificationCode = inputValue;
			await onVerifyCodeSubmit();
		} else {
			verificationCodeDigits[index] = inputValue.slice(-1); // Last character
			if (index < verificationCodeDigits.length - 1 && verificationCodeDigits[index] !== '') {
				verificationCodeInputs[index + 1].focus();
			}
		}

		if (verificationCodeDigits.every((digit) => digit !== '')) {
			verificationCode = verificationCodeDigits.join('');
			await onVerifyCodeSubmit();
		}
	};

	const handleKeyDown = function (index: any, event: any) {
		if (
			(event.key === 'Backspace' || event.key === 'Delete') &&
			verificationCodeDigits[index] === ''
		) {
			if (index > 0) {
				verificationCodeInputs[index - 1].focus();
			}
		}
	};

	let hiddenInput: any = null;

	const handleAutofill = async function (event: any) {
		const value = event.target.value;
		if (value.length >= 6) {
			// Assuming verificationCodeDigits is your array for individual digits
			verificationCodeDigits = value.split('').slice(0, 6);

			for (let i = 0; i < verificationCodeDigits.length; i++) {
				let digit = verificationCodeDigits[i];
			}

			// Run your function
			//await onVerifyCodeSubmit();
		}
	};

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
		loading = true;
		// called after user puts in their phone number and submits
		let newPhoneNumber = phoneNumber;
		if (!phoneNumber.startsWith('+')) {
			newPhoneNumber = '+1 ' + phoneNumber;
		}

		try {
			confirmationResult = await signInWithPhoneNumber(auth, newPhoneNumber, recaptchaVerifier);
		} catch (error: any) {
			console.error(error);
			if (error.code === 'auth/invalid-phone-number') {
				errorMessage = 'The phone number is invalid. Please enter a valid phone number.';
			} else {
				errorMessage = 'There has been an error sending your code. Please try again later.';
			}

			// Handle error.
		}
		console.log(confirmationResult);

		loading = false;
	}

	async function onVerifyCodeSubmit() {
		loading = true;
		// called after user hits button to submit code
		try {
			if (confirmationResult) {
				const result = await confirmationResult.confirm(verificationCode);

				goto('/app/tracker');
			}
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

		loading = false;
	}
</script>

<div
	class="flex items-center justify-center bg-stone-800 drop-shadow-xl rounded-3xl py-12 px-4 sm:px-6 lg:px-8"
>
	<div class="max-w-md w-full space-y-8">
		{#if !confirmationResult}
			<div in:fly={{ x: -300, duration: 300, delay: 300 }} out:fly={{ x: -300, duration: 300 }}>
				<div>
					<h2 class="text-center text-3xl font-extrabold text-gray-100">Sign in with your phone</h2>
					<p class="text-center text-gray-500 mt-1 text-sm">
						You will recieve an SMS for verification. Standard data rates apply
					</p>
				</div>
				{#if errorMessage != ''}
					<div>
						<h2 class="mt-6 text-center font-normal text-red-500">
							{errorMessage}
						</h2>
					</div>
				{/if}
				<div
					class="mt-8 space-y-6 bg-stone-700 drop-shadow-md rounded-3xl pb-12 pt-6 px-12 {errorMessage !=
					''
						? 'border-red-500 border-2'
						: ''}"
				>
					<input type="hidden" name="remember" value="true" />
					<div class=" border-b-4 border-b-white">
						<div class="flex flex-row space-y-2 pt-1 pb-3 px-3 sm:text-xl md:text-3xl">
							<label for="phone-number" class="sr-only">Phone Number</label>

							<span class="pr-3 border-none border-b-white" placeholder="Phone Number">+1</span>
							<input
								id="phone-number"
								name="phone-number"
								type="tel"
								pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
								required
								bind:value={phoneNumber}
								class="w-full bg-transparent outline-none appearance-none border-b-white"
								placeholder="Phone Number"
							/>
						</div>
					</div>

					<div>
						<button
							on:click={onSignInSubmit}
							disabled={!phoneValid && !loading}
							type="submit"
							class="group relative w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white {phoneValid ===
							false
								? 'bg-gray-600'
								: 'bg-gradient-to-br from-violet-600 to-violet-800 hover:bg-gradient-to-br hover:from-violet-700 hover:to-violet-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500'} drop-shadow-lg"
						>
							{#if !loading}
								Send Code
							{:else}
								<svg
									aria-hidden="true"
									role="status"
									class="inline w-4 h-4 mr-3 text-white animate-spin"
									viewBox="0 0 100 101"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
										fill="#616161"
									/>
									<path
										d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
										fill="currentColor"
									/>
								</svg>
							{/if}
						</button>
					</div>
				</div>
			</div>
		{:else}
			<button
				on:click={() => {
					confirmationResult = null;
				}}
				class="absolute"
			>
				<svg width="32" height="32">
					<image xlink:href="/left-arrow.svg" width="32" height="32" />
				</svg>
			</button>
			<div in:fly={{ x: 300, duration: 300, delay: 300 }} out:fly={{ x: 300, duration: 300 }}>
				<div>
					<h2 class="text-center text-3xl font-extrabold text-gray-100">
						Enter the code sent to<br /> <span class="font-light">{phoneNumber}</span>
					</h2>
				</div>
				{#if errorMessage != ''}
					<div>
						<h2 class="mt-6 text-center font-normal text-red-500">
							{errorMessage}
						</h2>
					</div>
				{/if}
				<div
					class="px-3 py-6 bg-stone-700 rounded-xl mt-6 {errorMessage != ''
						? 'border-red-500 border-2'
						: ''}"
					id="sign-in-container"
				>
					<input type="hidden" name="remember" value="true" />
					<div class="rounded-md -space-y-px">
						<div class="flex flex-row gap-x-3 justify-center">
							<input
								type="text"
								autocomplete="one-time-code"
								style="opacity: 0; position: absolute;"
								bind:this={hiddenInput}
								on:input={handleAutofill}
							/>
							{#each verificationCodeDigits as digit, index}
								<input
									bind:this={verificationCodeInputs[index]}
									type="text"
									pattern="[0-9]*"
									value={digit}
									disabled={loading}
									class="w-8 h-8 md:w-12 md:h-12 rounded-none bg-transparent border-b-2 border-b-white outline-none text-center focus:border-b-4"
									on:input={(event) => handleInput(index, event)}
									on:keydown={(event) => handleKeyDown(index, event)}
								/>
							{/each}
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<div class="absolute bottom-3 right-0" id="sign-in-button" />
