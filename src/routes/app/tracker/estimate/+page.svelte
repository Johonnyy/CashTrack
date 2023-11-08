<script>
	import Averages from './Averages.svelte';
	import Estimate from './Estimate.svelte';
</script>

<svelte:head>
	<title>Estimate</title>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<section class="text-white gap-y-12">
	<Averages /><Estimate />
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
