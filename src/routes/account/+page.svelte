<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import '../styles.css';
	import '../../app.css';

	import { logout } from '$lib/auth';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { onAuthStateChange } from '$lib/auth';
	import { getUserData } from '$lib/storage/stores';

	onMount(() => {
		const unsubscribe = onAuthStateChange(async (user: any) => {
			if (!user) {
				goto('/account/login'); // If user doesn't exist, redirect them to sign in
			} else {
				const userData = await getUserData();
				if (!userData) goto('/account/register'); // If user exists, but they don't have any data on them, take them to register
			}
		});

		return unsubscribe; // Clean up listener on component destroy
	});
</script>

<svelte:head>
	<title>Account</title>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<div class="app bg-stone-900">
	<Header />

	<main>
		<section>
			<button
				on:click={logout}
				class="text-white bg-gradient-to-br from-violet-600 to-violet-800 hover:bg-gradient-to-br hover:from-violet-700 hover:to-violet-900 h-10 ml-1 my-1 rounded"
				><p class="px-5 py-2">Log out</p></button
			>
		</section>
	</main>

	<footer>
		<p class="text-stone-700 text-center drop-shadow-lg">
			Created by Johnny Patino. View source code <a href="https://github.com/Johonnyy/Money-Tracker"
				>here.</a
			>
		</p>
	</footer>
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

	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
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
