<script>
	import github from '$lib/images/github.svg';
	import './styles.css';
	import '../app.css';
</script>

<head>
	<title>CashTrack</title>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>

<div class="app bg-stone-900">
	<header class="bg-gradient-to-b from-stone-800 to-stone-900 h-20">
		<a
			href="/account/login"
			rel="prefetch"
			class="text-white bg-gradient-to-br from-indigo-600 to-indigo-800 hover:bg-gradient-to-br hover:from-indigo-700 hover:to-indigo-900 h-10 ml-1 my-1 rounded"
			><p class="px-5 py-2">Sign in</p></a
		>

		<nav class="flex justify-center">
			<div
				class="text-white uppercase font-bold text-3xl relative p-0 m-0 h-12 flex justify-center items-center drop-shadow-xl"
			>
				Cash Track
			</div>
		</nav>

		<div class="corner w-8 mr-8">
			<a href="https://github.com/Johonnyy/CashTrack">
				<img src={github} alt="GitHub" class="h-full" />
			</a>
		</div>
	</header>

	<main>
		<section>
			<div
				class="text-center drop-shadow-md text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-indigo-800"
			>
				Predict Your Earnings
			</div>
			<div class="text-white text-md text-center">
				Track your goals and earnings. Tailored for a tipping workplace.
			</div>
			<a
				href="/account/login"
				rel="prefetch"
				class="bg-gradient-to-br from-indigo-600 to-indigo-800 hover:bg-gradient-to-br hover:from-indigo-700 hover:to-indigo-900 rounded px-4 py-2 mt-6 text-white drop-shadow-md font-medium"
			>
				Start Now
			</a>
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

	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	header {
		display: flex;
		justify-content: space-between;
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
