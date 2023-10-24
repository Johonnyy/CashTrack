<script>
	import { page } from '$app/stores';
	import github from '$lib/images/github.svg';
	import '../../routes/styles.css';
	import '../../app.css';
</script>

<div class="app bg-stone-900">
	<header class="bg-gradient-to-b from-stone-800 to-stone-900 h-20">
		<a href="/auth/login" class="text-white bg-indigo-600 h-10 ml-1 my-1 rounded"
			><p class="px-5 py-2">Sign in</p></a
		>

		<nav class="flex justify-center">
			<ul class="text-white relative p-0 m-0 h-12 flex justify-center items-center">
				<li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
					<a
						href="/"
						class="flex h-full items-center font-bold text-base uppercase no-underline mr-4"
						>Calendar</a
					>
				</li>
				<li aria-current={$page.url.pathname === '/estimate' ? 'page' : undefined}>
					<a
						href="/estimate"
						class="flex h-full items-center font-bold text-base uppercase no-underline ml-4"
						>Estimate</a
					>
				</li>
			</ul>
		</nav>

		<div class="corner w-8 mr-8">
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
