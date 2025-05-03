<script lang="ts">
	import { base } from '$app/paths';
	import * as Card from "$lib/components/ui/card/index.js";
	import { getDataSources } from "$lib/utils/odv_config";

	const dataSources = getDataSources();
</script>

<div class="p-6 space-y-12">
	<h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100">
		Data Sources
	</h1>
	<section>
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each dataSources as source}
				<a href="{base}/data_sources/{source.name}" class="card">
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