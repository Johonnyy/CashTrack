<script lang="ts">
	import { page } from '$app/stores';
	import github from '$lib/images/github.svg';
	import '../../routes/styles.css';
	import '../../app.css';

	import { slide } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { onAuthStateChange } from '$lib/auth';
	import { getUserData, userData, showMenu } from '$lib/storage/stores';
	import { logout } from '$lib/auth';

	let user: any;

	let showMobileMenu = false;
	let showAccountMenu = false;

	const navigate = async (url: string) => {
		await goto(url);
		showMenu.set(false);
		showAccountMenu = false;
	};

	onMount(() => {
		const unsubscribe = onAuthStateChange(async (newUser: any) => {
			if (newUser) {
				user = await getUserData();
			}

			userData.subscribe((value) => {
				user = value;
			});

			showMenu.subscribe((value) => {
				showMobileMenu = value;
			});
		});

		return unsubscribe; // Clean up listener on component destroy
	});
</script>

<div class="app bg-stone-900">
	<header class="bg-gradient-to-b from-stone-800 to-stone-900 h-20">
		<button
			on:click={() => (showAccountMenu = !showAccountMenu)}
			class="hidden md:flex text-white h-full items-center font-bold text-base no-underline ml-4"
			>Welcome {user?.name?.first || ''}
			<div class="arrow" class:rotate={showAccountMenu} />
		</button>

		<nav class="hidden md:flex justify-center">
			<ul class="text-white relative flex justify-center items-center">
				<li aria-current={$page.url.pathname === '/app/tracker' ? 'page' : undefined}>
					<a
						href="/app/tracker"
						class="flex h-full items-center font-bold text-base uppercase no-underline mr-4"
						>Calendar</a
					>
				</li>
				<li aria-current={$page.url.pathname === '/app/tracker/estimate' ? 'page' : undefined}>
					<a
						href="/app/tracker/estimate"
						class="flex h-full items-center font-bold text-base uppercase no-underline mx-4"
						>Estimate</a
					>
				</li>
				<li aria-current={$page.url.pathname === '/app/tracker/money' ? 'page' : undefined}>
					<a
						href="/app/tracker/money"
						class="flex h-full items-center font-bold text-base uppercase no-underline ml-4"
						>Money</a
					>
				</li>
			</ul>
		</nav>

		<button
			on:click={() => showMenu.set(!showMobileMenu)}
			class="md:hidden flex focus:outline-none items-center justify-center ml-8 p-4 pl-0"
		>
			<div class="flex flex-col space-y-1">
				<div class="w-6 h-0.5 bg-white" />
				<div class="w-6 h-0.5 bg-white" />
				<div class="w-6 h-0.5 bg-white" />
			</div>
		</button>

		<div class="h-8 mr-8 text-right">
			<a class="w-full h-full" href="https://github.com/Johonnyy/Money-Tracker">
				<img src={github} alt="GitHub" class="h-full w-full" />
			</a>
		</div>
	</header>
	{#if showAccountMenu}
		<div
			class="absolute z-40 px-12 top-20 left-8 rounded-xl drop-shadow-lg bg-stone-800 text-white font-medium text-lg flex flex-col"
			transition:slide={{ axis: 'y' }}
		>
			<button on:click={() => navigate('/app/settings')} class="py-6">Settings</button>
			<hr />
			<button on:click={async () => logout()} class="py-6">Logout</button>
		</div>
	{/if}
</div>

<style>
	header {
		position: relative;

		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	nav {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
	}

	nav ul {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0;
	}

	.arrow {
		border: solid white;
		border-width: 0 2px 2px 0;
		display: inline-block;
		padding: 3px;
		margin-left: 10px;
		transform: rotate(45deg);
		transition: transform 0.3s ease-in-out;
		transform-origin: 50% 50%;
	}
	.rotate {
		transform: rotate(225deg);
	}
</style>
