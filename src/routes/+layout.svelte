<script lang="ts">
	import '../app.css';
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import AppSidebar from "$lib/components/app-sidebar.svelte";
	import SiteHeader from "$lib/components/header.svelte";
	import { ModeWatcher } from "mode-watcher";
	import { onMount } from 'svelte';
	import { loadData } from "$lib/utils/duckdb";
	import { DoubleBounce } from 'svelte-loading-spinners';
	import * as Card from "$lib/components/ui/card/index.js";
	import { initializeAppStores } from '$lib/utils/stores';
	import { loadConfig } from '$lib/utils/odv_config';

	let { children } = $props();

	let appReadyPromise = (async () => {
		await loadConfig();
		await loadData();
		initializeAppStores();
	})();
</script>

{#await appReadyPromise}
	<!-- loading UI -->
	<div class="flex items-center justify-center h-screen w-screen">
		<Card.Root>
			<Card.Header>
				<Card.Title>App is Loading..</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="flex items-center justify-center">
					<DoubleBounce size="60" color="#FF3E00" />
				</div>
			</Card.Content>
		</Card.Root>
	</div>
{:then}
	<Sidebar.Provider open={false}>
		<ModeWatcher />
		<AppSidebar />
		<div>
			<SiteHeader />
			<main>
				<div class="w-screen h-screen shadow-md" id="page">
					{@render children?.()}
				</div>
			</main>
		</div>
	</Sidebar.Provider>
{:catch error}
	<!-- fallback if any step fails -->
	<div class="p-4 text-red-600 font-semibold">
		Something went wrong: {error.message}
	</div>
{/await}
