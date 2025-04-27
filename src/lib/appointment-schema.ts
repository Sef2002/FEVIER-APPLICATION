import { z } from 'zod';

export const AppointmentStatusSchema = z.enum([
  'pending',
  'confirmed',
  'cancelled',
  'completed',
]);

export const AppointmentSchema = z.object({
  id: z.string().uuid(),
  customer_name: z.string(),
  customer_email: z.string().email(),
  customer_phone: z.string(),
  appointment_date: z.string().nullable(), // we can keep it string for simplicity if you format it later
  appointment_time: z.string().nullable(), // same
  status: AppointmentStatusSchema.default('pending'),
  payment_status: z.string().default('pending'),
  payment_confirmed: z.boolean().default(false),
  session_id: z.string().nullable(), // ⚡ fixed field name!
  created_at: z.string(), // assume ISO timestamp
});

export type AppointmentStatus = z.infer<typeof AppointmentStatusSchema>;
export type Appointment = z.infer<typeof AppointmentSchema>;