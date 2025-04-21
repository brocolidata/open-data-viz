<script lang="ts">
	import '../app.css';
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import AppSidebar from "$lib/components/app-sidebar.svelte";
	import SiteHeader from "$lib/components/header.svelte";
	import { ModeWatcher } from "mode-watcher";
	import { onMount } from 'svelte'
	import { loadData } from "$lib/utils/duckdb"
	import { DoubleBounce } from 'svelte-loading-spinners';
	import * as Card from "$lib/components/ui/card/index.js";
	import { initializeDashboards } from '$lib/utils/stores'

	let { children } = $props();

	let appIsReady = $state();
	
	onMount(() => {
		appIsReady = loadData();
		initializeDashboards();
	});
</script>
{#await appIsReady}
	<!-- promise is pending -->
	<div class="flex items-center justify-center h-screen w-screen">
		<Card.Root>
			<Card.Header>
			<Card.Title>App is Loading..</Card.Title>
			<!-- <Card.Description>Card Description</Card.Description> -->
			</Card.Header>
			<Card.Content>
				<div class="flex items-center justify-center">
					<DoubleBounce
						size="60"
						color="#FF3E00"
					/>
				</div>
			</Card.Content>
			<!-- <Card.Footer>
			<p>Card Footer</p>
			</Card.Footer> -->
		</Card.Root>
	</div>
{:then value}
	
	<Sidebar.Provider open={false}>
		<ModeWatcher />
	
		<AppSidebar />
		<div>
			<SiteHeader />

		
		
			<main>	
				<!-- <div class="h-screen w-screen shadow-md" id="page" data-vaul-drawer-wrapper> -->
				<div class="w-screen h-screen shadow-md" id="page">
					<!-- <Sidebar.Trigger />	 -->
					{@render children?.()}
				</div>
			</main>
		</div>
	</Sidebar.Provider>

	{:catch error}
	<!-- promise was rejected -->
	<p>Something went wrong: {error.message}</p>
{/await}
