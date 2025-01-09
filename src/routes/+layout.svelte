<script lang="ts">
	import '../app.css';
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import AppSidebar from "$lib/components/app-sidebar.svelte";
	import SiteHeader from "$lib/components/header.svelte";
	import { ModeWatcher } from "mode-watcher";
	import { onMount } from 'svelte'
	import { loadData } from "$lib/duckdb"
	import { DoubleBounce } from 'svelte-loading-spinners';
	import * as Card from "$lib/components/ui/card/index.js";

	let { children } = $props();

	let tableName = $state();
	let renderedData = $state(false);
	let appIsReady = $state();
	
	function clearTableTag() {
		renderedData = false;
	}

	function displayTable() {
		renderedData = true
    }
	
	onMount(() => {
		appIsReady = loadData();
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
	<ModeWatcher />
	<SiteHeader />
	<Sidebar.Provider>
		<AppSidebar />
		<main>
			<Sidebar.Trigger />
			<div class="bg-background relative flex min-h-screen flex-col" id="page" data-vaul-drawer-wrapper>
				{@render children?.()}
			</div>
			
			
		</main>
	</Sidebar.Provider>
	{:catch error}
	<!-- promise was rejected -->
	<p>Something went wrong: {error.message}</p>
{/await}
