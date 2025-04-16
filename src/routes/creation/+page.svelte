<script>
    import { dashboardsIndex } from "$lib/stores";
    import { onMount } from "svelte";
    import * as Card from "$lib/components/ui/card/index.js";

</script>


<div class="p-6 space-y-12">
	<h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100">
		Data Sources
	</h1>
	<section>
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each dashboardsIndex as dashboard}
				<a href="/creation/{dashboard.name}" class="card">
					<Card.Root >
						<Card.Header>
						<Card.Title>{dashboard.name}</Card.Title>
						</Card.Header>
						<!-- <Card.Content>
							<p>{source.path}</p>
						</Card.Content> -->
					</Card.Root>
				</a>
			{/each}
            <a href="/creation/new_dashboard" class="card">
                <Card.Root >
                    <Card.Header>
                        <Card.Title>Create a new Dashboard</Card.Title>
                    </Card.Header>
                    <Card.Content>
                        <!-- <p>Create a new Dashboard</p> -->
                    </Card.Content>
                </Card.Root>
            </a>
		</div>
	</section>
</div>