<script lang="ts">
    import type { PageData } from "./$types";
    let { data }: { data: PageData } = $props();
    import * as Command from "$lib/components/ui/command/index.js";
    import * as Popover from "$lib/components/ui/popover/index.js";
	import Button from "$lib/components/ui/button/button.svelte";
	import { tick } from "svelte";

    let selectedCourse = $state<string>();
    let open = $state(false);
    let triggerRef = $state<HTMLButtonElement>(null!);
    let searchQuery = $state("");
    
    function closeAndFocusTrigger() {
        open = false;
        tick().then(() => {
            triggerRef.focus();
        });
    }

    let optimizedCourses = $derived(
        data.availableCourses
            .filter(course => 
                course.courseCode.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .slice(0, 50) // Only render the top 50 matches
    );

    $effect(() => {
        if (selectedCourse) {
            console.log("Selected course:", selectedCourse);
        }
    })
</script>

<main class="min-h-screen bg-background text-foreground flex flex-col items-center pt-20 gap-8 px-4">
    <div class="flex flex-col">
        <h3 class="text-3xl font-serif font-bold text-center">Welcome to Liu Stats</h3>
        <h4 class="text-lg text-center text-muted-foreground">Select a course to get statistics for that course </h4>
    </div>
    <div>
        <Popover.Root bind:open>
            <Popover.Trigger bind:ref={triggerRef}>
                {#snippet child({ props })}
                    <Button 
                        {...props}
                        variant="outline"
                        class="w-100 justify-between"
                        role="combobox"
                        aria-expanded={open}
                    >
                        {selectedCourse || "Select Course"}
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
                                        // closeAndFocusTrigger();
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