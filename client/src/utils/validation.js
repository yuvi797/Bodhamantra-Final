import { z } from "zod";

export const studentRegisterSchema = z.object({
  name: z.string()
    .min(3, "Name must be at least 3 characters")
    .max(40, "Name cannot exceed 40 characters"),

  email: z.string()
    .email("Enter a valid email like example@gmail.com"),

  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must include 1 uppercase letter")
    .regex(/[0-9]/, "Must include 1 number"),

  phone: z.string()
  .regex(/^(\+91[\s-]?)?[0-9]{10}$/, "Invalid phone number")

  course: z.string()
    .min(2, "Course is required"),

  branch: z.string()
    .min(2, "Branch is required"),

  year: z.string()
    .min(1, "Select any year")
    .optional(),
});
