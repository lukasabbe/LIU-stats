import { db } from "$lib/server/db";
import { courses } from "$lib/server/db/schema";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    const availableCourses = await db.select({courseCode: courses.courseCode }).from(courses);

    return {
        availableCourses
    };
}