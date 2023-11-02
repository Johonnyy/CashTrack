<script>
	import Grid from './Grid.svelte';
</script>

<svelte:head>
	<title>CashTrack Transactions</title>
	<meta name="description" content="Manage Money" />
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<section class="text-white">
	<Grid />
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
