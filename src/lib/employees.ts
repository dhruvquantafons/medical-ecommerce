import "server-only";
import { cache } from "react";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { employees } from "@/db/schema";

export type Employee = typeof employees.$inferSelect;

/** Active employees ordered by sortOrder, cached per request. */
export const getEmployees = cache(async (): Promise<Employee[]> => {
  return db.select().from(employees).where(eq(employees.active, true)).orderBy(asc(employees.sortOrder));
});

/** All employees (active and inactive) for the admin list. */
export const getAllEmployees = cache(async (): Promise<Employee[]> => {
  return db.select().from(employees).orderBy(asc(employees.sortOrder));
});
