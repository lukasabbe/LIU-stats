<script lang="ts">
    import type { PageData } from "./$types";
    let { data }: { data: PageData } = $props();
    import * as Command from "$lib/components/ui/command/index.js";
    import * as Popover from "$lib/components/ui/popover/index.js";
	import Button from "$lib/components/ui/button/button.svelte";
	import { tick } from "svelte";
	import { goto } from "$app/navigation";

    let selectedCourse = $state<string>();
    let open = $state(false);
    let triggerRef = $state<HTMLButtonElement>(null!);
    let searchQuery = $state("");
    let isLoading = $state(false);
    
    async function closeAndFocusTrigger() {
        open = false;
        isLoading = true;
        
        tick().then(() => {
            triggerRef.focus();
        });

        await goto(`/course/${selectedCourse}`);
        isLoading = false;
    }

    let optimizedCourses = $derived(
        data.availableCourses
            .filter(course => 
                course.courseCode.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .slice(0, 50)
    );

    $effect(() => {
        if (selectedCourse) {
            console.log("Selected course:", selectedCourse);
        }
    })
</script>

<main class="min-h-screen bg-background text-foreground flex flex-col items-center pt-20 gap-8 px-4">
    <div class="flex flex-col">
        <h3 class="text-5xl font-serif font-bold text-center">Welcome to Liu Stats</h3>
        <h4 class="text-lg text-center text-muted-foreground">Select a course to get statistics for that course </h4>
    </div>
    <div>
        <Popover.Root bind:open>
            <Popover.Trigger bind:ref={triggerRef}>
                {#snippet child({ props })}
                    <Button 
                        {...props}
                        variant="outline"
                        class="w-100 h-10 text-1xl justify-between"
                        role="combobox"
                        aria-expanded={open}
                        disabled={isLoading}
                    >
                        {#if isLoading}
                            <svg class="mr-3 size-5 animate-spin ..." viewBox="0 0 24 24">
                                <circle 
                                    class="opacity-25" 
                                    cx="12" 
                                    cy="12" 
                                    r="10" 
                                    stroke="currentColor" 
                                    stroke-width="4"
                                />
                                <path 
                                    class="opacity-75" 
                                    fill="currentColor" 
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                        {:else}
                        {selectedCourse || "Select Course"}
                            {/if}
                    </Button>
                {/snippet}
            </Popover.Trigger>
            <Popover.Content class="w-100">
                <Command.Root shouldFilter={false}>
                    <Command.Input 
                        placeholder="Type course name..."
                        bind:value={searchQuery}
                    />
                    <Command.List>
                        <Command.Empty>No courses found.</Command.Empty>
                        <Command.Group>
                            {#each optimizedCourses as course (course.courseCode)}
                                <Command.Item
                                    value={course.courseCode}
                                    onSelect={() => {
                                        selectedCourse = course.courseCode;
                                        open = false;
                                        closeAndFocusTrigger();
                                    }}
                                >
                                    {course.courseCode}
                                </Command.Item>
                            {/each}
                        </Command.Group>
                    </Command.List>
                </Command.Root>
            </Popover.Content>
        </Popover.Root>
    </div>
</main>