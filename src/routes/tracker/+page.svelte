<script>
	import Calendar from './Calendar.svelte';
</script>

<svelte:head>
	<title>Calendar View</title>
	<meta name="description" content="Calendar Viewer" />
</svelte:head>

<section class="text-white">
	<h1 class="font-bold text-2xl">Calendar View</h1>
	<Calendar />
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
