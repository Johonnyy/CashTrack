<script lang="ts">
	import { page } from '$app/stores';
	import github from '$lib/images/github.svg';
	import '../../routes/styles.css';
	import '../../app.css';

	import { slide } from 'svelte/transition';
	import { goto } from '$app/navigation';

	let showMenu = false;

	const navigate = async (url: string) => {
		await goto(url);
		showMenu = false;
	};
</script>

<div class="app bg-stone-900">
	<header class="bg-gradient-to-b from-stone-800 to-stone-900 h-20">
		<a
			href="/account"
			class="hidden md:flex text-white h-full items-center font-bold text-base no-underline ml-4"
			>Account</a
		>

		<nav class="hidden md:flex justify-center">
			<ul class="text-white relative flex justify-center items-center">
				<li aria-current={$page.url.pathname === '/tracker' ? 'page' : undefined}>
					<a
						href="/tracker"
						class="flex h-full items-center font-bold text-base uppercase no-underline mr-4"
						>Calendar</a
					>
				</li>
				<li aria-current={$page.url.pathname === '/tracker/estimate' ? 'page' : undefined}>
					<a
						href="/tracker/estimate"
						class="flex h-full items-center font-bold text-base uppercase no-underline mx-4"
						>Estimate</a
					>
				</li>
				<li aria-current={$page.url.pathname === '/tracker/money' ? 'page' : undefined}>
					<a
						href="/tracker/money"
						class="flex h-full items-center font-bold text-base uppercase no-underline ml-4"
						>Money</a
					>
				</li>
			</ul>
		</nav>

		<button
			on:click={() => (showMenu = !showMenu)}
			class="md:hidden flex focus:outline-none items-center justify-center ml-8"
		>
			<div class="flex flex-col space-y-1">
				<div class="w-6 h-0.5 bg-white" />
				<div class="w-6 h-0.5 bg-white" />
				<div class="w-6 h-0.5 bg-white" />
			</div>
		</button>

		{#if showMenu}
			<!-- Mobile dropdown menu -->
			<nav id="mobileMenu" class="fixed inset-0 z-50 bg-stone-900" transition:slide={{ axis: 'y' }}>
				<div class="flex flex-row justify-between">
					<button
						on:click={() => (showMenu = !showMenu)}
						class="font-bold text-4xl font-mono no-underline ml-5 mt-3 p-3 text-white">x</button
					>
					<button
						on:click={() => navigate('/account')}
						class="font-bold text-2xl text-white mr-5 mt-3 p-3">Account</button
					>
				</div>

				<div class="text-white flex flex-col items-center space-y-2 mt-10 w-full">
					<div class="py-6 border-b-2 w-4/5">
						<button
							on:click={() => navigate('/tracker')}
							class="font-bold text-base uppercase w-full">Calendar</button
						>
					</div>
					<div class="py-6 border-b-2 w-4/5">
						<button
							on:click={() => navigate('/tracker/estimate')}
							class="font-bold text-base uppercase no-underline w-full">Estimate</button
						>
					</div>
					<div class="py-6 w-4/5">
						<button
							on:click={() => navigate('/tracker/money')}
							class="font-bold text-base uppercase no-underline w-full">Money</button
						>
					</div>
				</div>
			</nav>
		{/if}

		<div class="w-8 mr-8">
			<a href="https://github.com/Johonnyy/Money-Tracker">
				<img src={github} alt="GitHub" class="h-full" />
			</a>
		</div>
	</header>
</div>

<style>
	header {
		display: flex;
		justify-content: space-between;
	}
</style>
