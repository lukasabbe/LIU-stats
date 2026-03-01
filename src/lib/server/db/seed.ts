import { count } from "drizzle-orm"
import { db } from "./index"
import { courses } from "./schema"
import dotenv from 'dotenv';
dotenv.config();


export const seedInitialCourses = async () => {
    const [{ value }] = await db.select({ value: count() }).from(courses)

    if (value === 0) {
        console.log("Seeding initial courses...");

        const parms = {
            method: "GET",
            headers: {
                'LiU-Operation-Id': 'exam-statistics',
                'Cache-Control': 'no-cache',
                'LiU-Api-Version': 'v1',
                'Accept': 'application/json',
                'content-type': 'application/json',
                'Ocp-Apim-Subscription-Key': process.env.LIU_API_KEY || ''
            }
        }

        const courseRawData = await fetch("https://api.liu.se/education/ExamStatistics/coursecodes", parms);

        if(!courseRawData.ok) {
            console.error("Failed to fetch course data:", courseRawData.statusText);
            return;
        }

        const courseData = await courseRawData.json() as string[];

        console.log(`Fetched ${courseData.length} courses from API.`);

        const formatedData = courseData.map(code => ({ courseCode: code }));

        await db.insert(courses).values(formatedData);
        console.log("Initial courses seeded successfully.");
    }else {
        console.log(`Database ready. Found ${value} courses.`);
    }
}

seedInitialCourses().then(() => {
    console.log("Seeding script finished.");
    process.exit(0);
}).catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
});