<script lang="ts">
    import "./layout.css";
    import { ModeWatcher, toggleMode, mode } from 'mode-watcher';
    import type { Snippet } from 'svelte';
	import '@fontsource/libre-baskerville';

    let { children }: { children: Snippet } = $props();
	let isSpinning = $state(false);

	const handleClick = () => {
		toggleMode();
		isSpinning = true;
		setTimeout(() => isSpinning = false, 1000);
	};
</script>

<ModeWatcher />

<div class="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-200">
    
    <nav class="flex justify-between items-center p-6 w-full max-w-5xl mx-auto">
        
        <a 
            href="/" 
            class="font-bold font-serif text-4xl tracking-tight hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-md px-2 py-1 -ml-2"
        >
            Liu Stats
        </a>

		<button 
			onclick={handleClick}
			class="relative inline-flex items-center justify-center w-12 h-12 rounded-full hover:bg-muted transition-colors focus:outline-none {isSpinning ? 'motion-safe:animate-spin' : ''}"
			aria-label="Toggle Dark Mode"
		>
			<svg 
				class="absolute w-6 h-6 transition-all duration-500
				{mode.current === 'dark' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}" 
				xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
			>
				<circle cx="12" cy="12" r="4"></circle>
				<path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>
			</svg>

			<svg 
				class="absolute w-6 h-6 transition-all duration-500 
				{mode.current === 'light' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'}" 
				xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
			>
				<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
			</svg>
		</button>
    </nav>

    <main class="flex-grow w-full max-w-5xl mx-auto px-6">
        {@render children()}
    </main>

</div>

<style>
	:global(body) {
		transition: background-color 0.3s ease, color 0.3s ease;
	}
</style>