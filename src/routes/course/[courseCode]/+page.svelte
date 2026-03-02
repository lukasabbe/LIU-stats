<script lang="ts">
    import type { PageData } from './$types';
    let { data }: { data: PageData } = $props();
        let course = $derived(data.course);
</script>