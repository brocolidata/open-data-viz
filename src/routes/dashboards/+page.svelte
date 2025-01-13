<script lang="ts">
	import * as Card from "$lib/components/ui/card/index.js";
	import { getDashboards } from "$lib/odv_config";

	const dashboards = getDashboards();
</script>

<div class="p-6 space-y-12">
	<h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100">
		Dashboards
	</h1>
	<section>
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
</div>