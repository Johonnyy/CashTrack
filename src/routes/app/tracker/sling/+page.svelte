<script lang="ts">
	import { onMount } from 'svelte';

	//const googleRecaptchaSiteKey = '6LfLiQMpAAAAAHyp--eAEBE9mggw7i30-wdTXJ2z';
	const googleRecaptchaSiteKey = '6LfWw3soAAAAAHFXwfg7pycuARSxmIG28sHVTzd8';

	let email = '';
	let password = '';
	let captchaResponse: string;

	const reCaptchaCallback = () => {};

	const loginWithSling = async () => {
		captchaResponse = window.grecaptcha.getResponse();
		console.log(captchaResponse);

		if (!captchaResponse) return;

		const response = await fetch('https://api.getsling.com/v1/account/login', {
			method: 'POST',
			body: JSON.stringify({
				email: email,
				password: password,
				captchaResponse: captchaResponse
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		console.log(response);

		const data = await response.json();
		console.log(data);
	};

	onMount(() => {
		if (window.grecaptcha && window.grecaptcha.render) {
			window.grecaptcha.render('recaptcha-container', {
				sitekey: googleRecaptchaSiteKey,
				callback: reCaptchaCallback
			});
		} else {
			window.onRecaptchaLoad = () => {
				window.grecaptcha.render('recaptcha-container', {
					sitekey: googleRecaptchaSiteKey,
					callback: reCaptchaCallback
				});
			};
		}
	});
</script>

<svelte:head>
	<title>Login with Sling</title>
	<script src="https://www.google.com/recaptcha/api.js" async defer></script>
</svelte:head>

<section>
	<div
		class="flex flex-col items-center justify-center text-white bg-stone-800 drop-shadow-xl rounded-3xl py-12 px-4 sm:px-6 lg:px-8 w-4/5 gap-y-5"
	>
		<div class="text-3xl font-medium">Login with Sling</div>
		<form
			class="flex flex-col items-center justify-center gap-y-3"
			on:submit|preventDefault={loginWithSling}
		>
			<input
				type="email"
				placeholder="Email"
				class="bg-stone-600 px-3 py-1 rounded w-full"
				bind:value={email}
			/>
			<input
				type="password"
				placeholder="Password"
				class="bg-stone-600 px-3 py-1 rounded w-full"
				bind:value={password}
			/>
			<div id="recaptcha-container" />
			<!-- Other form elements -->
			<button
				type="submit"
				class="group relative w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-gradient-to-br from-violet-600 to-violet-800 hover:bg-gradient-to-br hover:from-violet-700 hover:to-violet-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 drop-shadow-lg mt-3"
				>Login</button
			>
		</form>
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
