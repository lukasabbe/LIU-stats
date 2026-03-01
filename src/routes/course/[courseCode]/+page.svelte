<script lang="ts">
    import type { PageData } from './$types';

    // Svelte 5: Receive the data from the server
    let { data }: { data: PageData } = $props();
    
    // Create a handy shortcut variable
    let course = $derived(data.course);
</script>