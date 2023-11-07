<script>
	import NewShift from './NewShift.svelte';
</script>

<svelte:head>
	<title>New Shift</title>
	<meta name="description" content="Create new shift" />
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<section class="text-white">
	<NewShift />
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
