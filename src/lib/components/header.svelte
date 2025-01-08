<script lang="ts">
	import { page } from "$app/state";
	import { Button } from "$lib/components/ui/button/index.js";
    import Sun from "lucide-svelte/icons/sun";
	import Moon from "lucide-svelte/icons/moon";

	import { toggleMode } from "mode-watcher";
</script>

<header
	class="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur"
>
	<div class="container flex h-14 max-w-screen-2xl items-center justify-between">
		<!-- Left-aligned elements -->
		<div class="mr-4 hidden md:flex">
			<a href="/" class="mr-6 flex items-center space-x-2">
				<!-- <Icon.Logo class="size-6" /> -->
				<span class="hidden font-bold xl:inline-block">
					<!-- {siteConfig.name} -->
					Open Data Viz
				</span>
			</a>
			<nav class="flex items-center gap-6 text-sm">
				<a
					href="/dashboards"
					class="hover:text-foreground/80 transition-colors"
				>
					Dashboards
				</a>
				<a
					href="/data_sources"
					class="hover:text-foreground/80 transition-colors"
				>
					Data Sources
				</a>
			</nav>
		</div>

		<!-- Right-aligned ModeWatcher -->
		<div>
			<Button onclick={toggleMode} variant="outline" size="icon">
                <Sun
                  class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
                />
                <Moon
                  class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
                />
                <span class="sr-only">Toggle theme</span>
            </Button>
		</div>
	</div>
</header>