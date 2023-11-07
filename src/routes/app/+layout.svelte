<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import '../styles.css';
	import '../../app.css';

	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { onAuthStateChange } from '$lib/auth';
	import { getUserData, showMenu } from '$lib/storage/stores';
	import { slide } from 'svelte/transition';

	const navigate = async (url: string) => {
		await goto(url);
		showMenu.set(false);
	};

	let showMobileMenu = false;

	onMount(() => {
		const unsubscribe = onAuthStateChange(async (user: any) => {
			if (!user) {
				goto('/auth/login'); // If user doesn't exist, redirect them to sign in
			} else {
				const userData = await getUserData();
				if (!userData) goto('/auth/register'); // If user exists, but they don't have any data on them, take them to register
			}
		});

		showMenu.subscribe((value) => {
			showMobileMenu = value;
		});

		return unsubscribe; // Clean up listener on component destroy
	});
</script>

<div class="app bg-stone-900">
	{#if !showMobileMenu}
		<div>
			<Header />

			<main>
				<slot />
			</main>

			<footer>
				<p class="text-stone-700 text-center drop-shadow-lg">
					Created by Johnny Patino. View source code <a
						href="https://github.com/Johonnyy/Money-Tracker">here.</a
					>
				</p>
			</footer>
		</div>
	{:else}
		<!-- Mobile dropdown menu -->
		<nav
			id="mobileMenu"
			class="fixed flex flex-col h-screen w-full inset-0 z-50 bg-stone-900"
			in:slide={{ duration: 300 }}
			out:slide={{ duration: 300 }}
		>
			<div class="flex flex-row justify-between">
				<button
					on:click={() => showMenu.set(!showMobileMenu)}
					class="font-bold text-4xl font-mono no-underline ml-5 mt-3 p-3 text-white">x</button
				>
				<button
					on:click={() => navigate('/app/settings')}
					class="font-bold text-2xl text-white mr-5 mt-3 p-3">Settings</button
				>
			</div>
			<div class="text-white flex flex-col items-center space-y-2 mt-10 w-full">
				<div class="py-6 border-b-2 w-4/5">
					<button
						on:click={() => navigate('/app/tracker')}
						class="font-bold text-base uppercase w-full">Calendar</button
					>
				</div>
				<div class="py-6 border-b-2 w-4/5">
					<button
						on:click={() => navigate('/app/tracker/estimate')}
						class="font-bold text-base uppercase no-underline w-full">Estimate</button
					>
				</div>
				<div class="py-6 w-4/5">
					<button
						on:click={() => navigate('/app/tracker/money')}
						class="font-bold text-base uppercase no-underline w-full">Money</button
					>
				</div>
			</div>
		</nav>
	{/if}
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
