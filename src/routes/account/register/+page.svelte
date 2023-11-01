<script>
	import '../../styles.css';
	import '../../../app.css';

	import Register from './Register.svelte';
</script>

<svelte:head>
	<title>Register</title>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<div class="app bg-stone-900">
	<div />

	<main>
		<section class="text-white">
			<Register />
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
