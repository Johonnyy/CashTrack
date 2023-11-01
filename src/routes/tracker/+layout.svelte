<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import '../styles.css';
	import '../../app.css';

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

<div class="app bg-stone-900">
	<Header />

	<main>
		<slot />
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
