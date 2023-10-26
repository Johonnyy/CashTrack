<script lang="ts">
	import { page } from '$app/stores';
	import { user } from '$lib/storage/stores';
	import { getUserData } from '$lib/user';
	import { onMount, onDestroy } from 'svelte';
	import github from '$lib/images/github.svg';
	import '../../routes/styles.css';
	import '../../app.css';
</script>

<div class="app bg-stone-900">
	<header class="bg-gradient-to-b from-stone-800 to-stone-900 h-20">
		<a
			href="/account"
			class="text-white flex h-full items-center font-bold text-base no-underline ml-4">Account</a
		>

		<nav class="flex justify-center">
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
