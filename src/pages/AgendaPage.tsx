import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, isSameMonth, isSameDay, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

interface Appointment {
  id: string;
  customer_name: string;
  customer_phone: string;
  appointment_date: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  service_id: string;
}

const AgendaPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);

        // 🛠️ FIX: use selectedDate directly, no UTC conversion
        const { data, error: supabaseError } = await supabase
          .from('appointments')
          .select('*')
          .eq('appointment_date', format(selectedDate, 'yyyy-MM-dd'))
          .not('appointment_time', 'is', null)
          .order('appointment_time', { ascending: true });

        if (supabaseError) {
          console.error('Supabase error:', supabaseError);
          throw supabaseError;
        }

        if (isMounted) {
          setAppointments(data || []);
        }
      } catch (err) {
        console.error('Fetch appointments error:', err);
        if (isMounted) {
          setError('Failed to load appointments');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAppointments();

    const subscription = supabase
      .channel('appointments_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, fetchAppointments)
      .subscribe();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [selectedDate]);

  const generateCalendarDays = (month: Date) => {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    const days: Date[] = [];

    // Fill empty days before the start of the month
    const startWeekDay = (start.getDay() + 6) % 7; // Monday=0
    for (let i = 0; i < startWeekDay; i++) {
      days.push(new Date(start.getTime() - (startWeekDay - i) * 86400000));
    }

    // Add all days of the month
    for (let d = start; d <= end; d = new Date(d.getTime() + 86400000)) {
      days.push(new Date(d));
    }

    return days;
  };

  const daysInMonth = generateCalendarDays(currentMonth);

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const formatAppointmentTime = (time: string) => {
    return format(parseISO(`2000-01-01T${time}`), 'HH:mm');
  };

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-50 text-green-700';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700';
      case 'completed':
        return 'bg-blue-50 text-blue-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-black">Agenda</h1>
        <p className="text-base text-gray-500">
          Gestisci i tuoi appuntamenti e visualizza il calendario
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr,380px]">
        {/* Calendar */}
        <Card>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {format(currentMonth, 'MMMM yyyy', { locale: it })}
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={prevMonth} aria-label="Mese precedente">
                  <ChevronLeft size={20} />
                </Button>
                <Button variant="outline" size="sm" onClick={nextMonth} aria-label="Mese successivo">
                  <ChevronRight size={20} />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg bg-gray-200 text-sm">
              {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map((day) => (
                <div key={day} className="bg-gray-50 p-3 text-center font-medium text-gray-500">
                  {day}
                </div>
              ))}
              {daysInMonth.map((date, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedDate(date)}
                  className={`bg-white p-3 text-center transition-colors hover:bg-gray-50 ${
                    !isSameMonth(date, currentMonth)
                      ? 'text-gray-300'
                      : isSameDay(date, selectedDate)
                      ? 'bg-black text-white hover:bg-gray-800'
                      : 'text-gray-900'
                  }`}
                >
                  {format(date, 'd')}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Appointments List */}
        <Card>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              Appuntamenti del {format(selectedDate, 'd MMMM yyyy', { locale: it })}
            </h2>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : error ? (
              <div className="rounded-lg bg-red-50 p-4 text-red-600">{error}</div>
            ) : appointments.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                Nessun appuntamento per questa data
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-sm"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium">
                        {formatAppointmentTime(appointment.appointment_time)}
                      </span>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {appointment.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-900">{appointment.customer_name}</p>
                    <p className="text-sm text-gray-500">{appointment.customer_phone}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AgendaPage;