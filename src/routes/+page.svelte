<script lang="ts">
	import * as Card from "$lib/components/ui/card/index.js";
	import { getDashboards, getDataSources } from "$lib/odv_config";

	let dashboards = getDashboards();
	let dataSources = getDataSources();

	
</script>

<div class="p-6 space-y-12">
	<!-- Dashboards Section -->
	<section>
	  <h2 class="text-2xl font-bold mb-4">Dashboards</h2>
	  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each dashboards as dashboard}
			<a href="/dashboards/{dashboard.name}" class="card">
				<Card.Root >
					<Card.Header>
					<Card.Title>{dashboard.label}</Card.Title>
					</Card.Header>
					<Card.Content>
						<p>{dashboard.description}</p>
					</Card.Content>
				</Card.Root>
			</a>
		{/each}
	  </div>
	</section>
  
	<!-- Data Sources Section -->
	<section>
	  <h2 class="text-2xl font-bold mb-4">Data Sources</h2>
	  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each dataSources as source}
		  <!-- <div class="card bg-white shadow-md rounded-lg p-4">
			<h3 class="text-lg font-semibold">{source.label}</h3>
			<p class="text-gray-600">{source.path}</p>
		  </div> -->
		  <a href="/data_sources/{source.name}" class="card">
			<Card.Root >
				<Card.Header>
				<Card.Title>{source.label}</Card.Title>
				</Card.Header>
				<Card.Content>
					<p>{source.path}</p>
				</Card.Content>
			</Card.Root>
		</a>
		{/each}
	  </div>
	</section>
  </div>
  
  <style>
	/* Example custom card styling */
	.card:hover {
	  @apply shadow-lg transform scale-105 transition duration-300;
	}
  </style>