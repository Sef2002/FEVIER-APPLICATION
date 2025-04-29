import { format, parseISO } from 'date-fns';
import { PostgrestError, RealtimeChannel } from '@supabase/supabase-js';
import { AppointmentSchema, type Appointment } from './appointment-schema';
import { supabase } from './supabase';

export class AppointmentError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
    public readonly data?: unknown
  ) {
    super(message);
    this.name = 'AppointmentError';
  }
}

export function validateAppointmentData(data: unknown): Appointment[] {
  try {
    return AppointmentSchema.array().parse(data);
  } catch (error) {
    console.error('Validation error:', error);
    throw new AppointmentError('Invalid appointment data', error, data);
  }
}

export function formatDateForQuery(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function formatAppointmentTime(time: string | null): string {
  if (!time) return '--:--';
  try {
    return format(parseISO(`2000-01-01T${time}`), 'HH:mm');
  } catch (error) {
    console.error('Time formatting error:', error);
    return '--:--';
  }
}

export function handleSupabaseError(error: PostgrestError): never {
  console.error('Supabase error:', {
    message: error.message,
    details: error.details,
    hint: error.hint,
    code: error.code,
  });
  throw new AppointmentError(error.message, error);
}

export function getStatusColor(status: Appointment['status']): string {
  const colors = {
    confirmed: 'bg-green-50 text-green-700',
    pending: 'bg-yellow-50 text-yellow-700',
    completed: 'bg-blue-50 text-blue-700',
    cancelled: 'bg-red-50 text-red-700',
  };
  return colors[status] ?? 'bg-gray-50 text-gray-700';
}

export async function fetchAppointments(date: Date): Promise<Appointment[]> {
  try {
    console.log('Fetching appointments for date:', formatDateForQuery(date));
    
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('appointment_date', formatDateForQuery(date))
      .eq('status', 'confirmed') // ✅ Fetch ONLY confirmed
      .not('appointment_date', 'is', null)
      .not('appointment_time', 'is', null)
      .order('appointment_time', { ascending: true });

    if (error) {
      console.error('Supabase query error:', error);
      handleSupabaseError(error);
    }

    if (!data) {
      console.log('No appointments found');
      return [];
    }

    console.log('Raw appointments data:', data);
    const validatedData = validateAppointmentData(data);
    console.log('Validated appointments:', validatedData);
    return validatedData;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw new AppointmentError('Failed to fetch appointments', error);
  }
}

export function subscribeToAppointments(
  date: Date,
  onUpdate: (appointments: Appointment[]) => void,
  onError: (error: Error) => void
): RealtimeChannel {
  const formattedDate = formatDateForQuery(date);
  console.log('Setting up subscription for date:', formattedDate);

  const channel = supabase
    .channel(`appointments_${formattedDate}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'appointments',
        filter: `appointment_date=eq.${formattedDate}`,
      },
      async (payload) => {
        console.log('Received real-time update:', payload);
        try {
          const appointments = await fetchAppointments(date);
          onUpdate(appointments);
        } catch (error) {
          console.error('Error handling real-time update:', error);
          onError(error instanceof Error ? error : new Error('Unknown error'));
        }
      }
    )
    .subscribe((status) => {
      console.log('Subscription status:', status);
      if (status === 'SUBSCRIPTION_ERROR') {
        console.error('Subscription error occurred');
        onError(new Error('Failed to establish real-time connection'));
      }
    });

  return channel;
}