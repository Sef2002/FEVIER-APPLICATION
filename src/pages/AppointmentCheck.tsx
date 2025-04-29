import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase'; // Assicurati che il path sia corretto

function AppointmentCheck() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const { data, error } = await supabase.from('appointments').select('*');
        if (error) {
          console.error('Fetch appointments error:', error);
          setError(error.message);
        } else {
          console.log('Appointments fetched:', data);
          setAppointments(data || []);
        }
      } catch (err: any) {
        console.error('Unexpected fetch error:', err.message);
        setError(err.message);
      }
    }

    fetchAppointments();
  }, []);

  if (error) {
    return <div>Errore: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Lista Appuntamenti</h1>
      {appointments.length === 0 ? (
        <p>Nessun appuntamento trovato.</p>
      ) : (
        <ul>
          {appointments.map((appointment) => (
            <li key={appointment.id} className="mb-2">
              {JSON.stringify(appointment)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AppointmentCheck;