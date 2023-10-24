<script>
	let daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	let events = Array(7).fill([]);
</script>

<div class="grid grid-cols-7 p-4">
	{#each daysOfWeek as day}
		<div class="col-span-1 p-2 border border-b-0 border-gray-300 text-center font-bold">
			{day}
		</div>
	{/each}
	{#each events as dayEvents, index}
		<div class="col-span-1 p-2 border border-gray-300">
			<ul>
				{#each dayEvents as event}
					<li>{event}</li>
				{/each}
			</ul>
		</div>
	{/each}
</div>
