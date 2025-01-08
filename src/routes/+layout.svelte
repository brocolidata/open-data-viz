<script lang="ts">
	import '../app.css';
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import AppSidebar from "$lib/components/app-sidebar.svelte";
	import SiteHeader from "$lib/components/header.svelte";
	import { ModeWatcher } from "mode-watcher";

	let { children } = $props();
  </script>
<ModeWatcher />
<SiteHeader />
<Sidebar.Provider>
	<AppSidebar />
	<main>
		<Sidebar.Trigger />
	  	{@render children?.()}
	</main>
</Sidebar.Provider>


