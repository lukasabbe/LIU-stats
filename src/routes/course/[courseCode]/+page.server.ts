import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";
import { courses, grades, modules } from "$lib/server/db/schema";
import { error } from "console";

type FetchCourseData = {
    courseCode: string;
    moduleCode: string;
    courseTitle:{
        en: string;
        sv: string;
    },
    examtitle: {
        en: string;
        sv: string;
    },
    examinationDate: string;
    grades: {
        grade: string;
        gradeOrder: number;
        quantity: number;
    }[]
}

export const load: PageServerLoad = async ({ params }) => {
    const { courseCode } = params;
    if (!courseCode) {
        error("Course code is missing in URL parameters.");
    }
    let courseData = await db.query.courses.findFirst({
        where: eq(courses.courseCode, courseCode.toUpperCase()),
        with: {
            modules: {
                with: {
                    grades: true
                }
            }
        }
    });

    if (!courseData) {
        error("Course not found: " + courseCode);
    }
    if(!courseData?.titleEn) {
        const parms = {
            method: 'GET',
            headers: {
                'LiU-Operation-Id': 'exam-statistics',
                'Cache-Control': 'no-cache',
                'LiU-Api-Version': 'v1',
                Accept: 'application/json',
                'content-type': 'application/json',
                'Ocp-Apim-Subscription-Key': process.env.LIU_API_KEY || ''
            }
        }
        const res = await fetch(`https://api.liu.se/education/ExamStatistics/${courseCode}?limit=1000`, parms)

        if(!res.ok) {
            error("Failed to fetch course data: " + res.statusText);
        }

        const apiCourseData = await res.json() as FetchCourseData[];
        const formatedData = {
            titleEn: apiCourseData[0].courseTitle.en,
            titleSv: apiCourseData[0].courseTitle.sv,
            modules: apiCourseData.map(module => ({
                moduleCode: module.moduleCode,
                examTitleEn: module.examtitle.en,
                examTitleSv: module.examtitle.sv,
                examinationDate: module.examinationDate,
                grades: module.grades.map(grade => ({
                    grade: grade.grade,
                    gradeOrder: grade.gradeOrder,
                    quantity: grade.quantity
                }))
            }))
        }
        await db.update(courses).set({
            titleEn: formatedData.titleEn,
            titleSv: formatedData.titleSv
        }).where(eq(courses.courseCode, courseCode.toUpperCase()));

        for (const module of formatedData.modules) {
            const [dbModule] = await db.insert(modules).values({
                courseCode: courseCode.toUpperCase(),
                moduleCode: module.moduleCode,
                examTitleEn: module.examTitleEn,
                examTitleSv: module.examTitleSv,
                examinationDate: module.examinationDate
            }).returning({ id: modules.id });

            const gradesToInsert = module.grades.map(g => ({
                moduleId: dbModule.id,
                grade: g.grade,
                gradeOrder: g.gradeOrder,
                quantity: g.quantity
             }));

            await db.insert(grades).values(gradesToInsert);
        }

        courseData = await db.query.courses.findFirst({
            where: eq(courses.courseCode, courseCode.toUpperCase()),
            with: {
                modules: {
                    with: {
                        grades: true
                    }
                }
            }
        });
    }

    if (!courseData) {
        error("Course data is still missing after API fetch: " + courseCode);
    }

    type PopulatedCourseData = {
        courseCode: string;
        titleEn: string;
        titleSv: string;
        modules: {
            moduleCode: string;
            examTitleEn: string;
            examTitleSv: string;
            examinationDate: string;
            grades: {
                grade: string;
                gradeOrder: number;
                quantity: number;
            }[];
        }[];
    }

    return {
        course: courseData as PopulatedCourseData
    };
}