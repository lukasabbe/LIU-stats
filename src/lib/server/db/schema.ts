import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const courses = sqliteTable("courses", {
	courseCode: text("course_code").primaryKey(),
	titleEn: text("title_en"),
	titleSv: text("title_sv")
});

export const modules = sqliteTable("modules", {
	id: integer("id").primaryKey({ autoIncrement: true}),
	courseCode: text("course_code").references(() => courses.courseCode).notNull(),
	moduleCode: text("module_code"),
	examTitleEn: text("exam_title_en"),
	examTitleSv: text("exam_title_sv"),
	examinationDate: text("examination_date")
});

export const grades = sqliteTable("grades", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	moduleId: integer("module_id").references(() => modules.id).notNull(),
	grade: text("grade"),
	gradeOrder: integer("grade_order"),
	quantity: integer("quantity")
});


export const coursesRelations = relations(courses, ({ many }) => ({
	modules: many(modules)
}));

export const modulesRelations = relations(modules, ({ one, many }) => ({
	course: one(courses, {
		fields: [modules.courseCode],
		references: [courses.courseCode]
	}),
	grades: many(grades)
}));

export const gradesRelations = relations(grades, ({ one }) => ({
	module: one(modules, {
		fields: [grades.moduleId],
		references: [modules.id]
	})
}));