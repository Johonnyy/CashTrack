<script>
	import Balance from './Balance.svelte';
	import Transactions from './Transactions.svelte';
	import Goals from './Goals.svelte';
</script>

<svelte:head>
	<title>CashTrack Money</title>
	<meta name="description" content="Manage Money" />
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<section class="text-white">
	<div class="hidden md:flex flex-col gap-y-12 w-full">
		<div class="flex flex-row gap-x-12 w-full"><Balance /><Transactions /></div>
		<Goals />
	</div>
	<div class="flex md:hidden flex-col gap-y-12">
		<Balance /><Transactions /><Goals />
	</div>
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
