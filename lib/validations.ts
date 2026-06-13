import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const passwordSchema = z
  .string()
  .min(8, "Mínimo 8 caracteres")
  .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
  .regex(/[0-9]/, "Debe contener al menos un número");

export const registerSchema = z
  .object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    password: passwordSchema,
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: "Debes aceptar los términos",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type RegisterValues = z.infer<typeof registerSchema>;

// Schema del endpoint POST /api/users (sin confirmPassword ni terms)
export const createUserSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: passwordSchema,
});

export const createOrderSchema = z.object({
  quantity: z.number().int().min(1).max(10),
});

// ---- Dashboard / settings ----

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres").max(100).optional(),
  phone: z.string().max(20).optional().or(z.literal("")),
  bio: z.string().max(500, "Máximo 500 caracteres").optional().or(z.literal("")),
  address: z
    .object({
      street: z.string().max(120).optional().or(z.literal("")),
      city: z.string().max(80).optional().or(z.literal("")),
      postalCode: z.string().max(12).optional().or(z.literal("")),
      country: z.string().max(60).optional().or(z.literal("")),
    })
    .optional(),
});

export type UpdateProfileValues = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "La contraseña actual es requerida"),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

// Schema del endpoint (sin confirmPassword, que es solo de UI)
export const changePasswordApiSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: passwordSchema,
});

export const notificationPrefsSchema = z.object({
  notifyOrders: z.boolean().optional(),
  notifyPromos: z.boolean().optional(),
  notifyNewsletter: z.boolean().optional(),
});

export const deleteAccountSchema = z.object({
  confirmEmail: z.string().email(),
});
