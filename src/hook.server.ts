import { seedInitialCourses } from "$lib/server/db/seed";
import type { Handle } from "@sveltejs/kit";

seedInitialCourses();

export const handle: Handle = async ({ event, resolve }) => {
    return await resolve(event);
};