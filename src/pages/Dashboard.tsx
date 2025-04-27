import React from 'react';
import { Calendar, Users, TrendingUp, DollarSign } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Dashboard = () => {
  const stats = [
    { title: 'Appuntamenti oggi', value: '12', icon: Calendar, color: 'bg-blue-50 text-blue-600' },
    { title: 'Clienti totali', value: '256', icon: Users, color: 'bg-green-50 text-green-600' },
    { title: 'Incasso mensile', value: '€4,320', icon: DollarSign, color: 'bg-yellow-50 text-yellow-600' },
    { title: 'Crescita mensile', value: '+15%', icon: TrendingUp, color: 'bg-purple-50 text-purple-600' },
  ];

  const upcomingAppointments = [
    { time: '09:00', client: 'Marco Rossi', service: 'Taglio e Piega', duration: '45 min' },
    { time: '10:30', client: 'Giulia Bianchi', service: 'Colore e Trattamento', duration: '90 min' },
    { time: '12:30', client: 'Luca Verdi', service: 'Barba e Taglio', duration: '60 min' },
    { time: '14:00', client: 'Sofia Russo', service: 'Manicure', duration: '45 min' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-black">Dashboard</h1>
        <p className="text-base text-gray-500">
          Benvenuto nel tuo pannello di controllo. Ecco un riepilogo della giornata.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="flex items-start">
            <div className={`mr-4 rounded-full p-3 ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
          </Card>
        ))}
      </div>

      {/* Agenda Section */}
      <div className="mb-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">Agenda di Oggi</h2>
          <Button variant="outline" size="sm">
            Visualizza Tutti
          </Button>
        </div>

        <Card>
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Orario
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Cliente
                  </th>
                  <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 md:table-cell">
                    Servizio
                  </th>
                  <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 md:table-cell">
                    Durata
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Azioni
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {upcomingAppointments.map((appointment, index) => (
                  <tr key={index} className="transition-colors hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900">
                      {appointment.time}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">{appointment.client}</td>
                    <td className="hidden px-4 py-4 text-sm text-gray-500 md:table-cell">
                      {appointment.service}
                    </td>
                    <td className="hidden px-4 py-4 text-sm text-gray-500 md:table-cell">
                      {appointment.duration}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-right text-sm">
                      <Button variant="ghost" size="sm">
                        Dettagli
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Actions Section */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-lg font-semibold">Azioni Rapide</h3>
          <div className="space-y-4">
            <Button className="w-full justify-start">Nuovo Appuntamento</Button>
            <Button variant="outline" className="w-full justify-start">
              Nuovo Cliente
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Registra Vendita
            </Button>
          </div>
        </Card>
        
        <Card>
          <h3 className="mb-4 text-lg font-semibold">Attività Recenti</h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-green-500 mt-2"></div>
              <div>
                <p className="text-sm font-medium">Pagamento ricevuto</p>
                <p className="text-xs text-gray-500">€45 - Marco Rossi - 20 min fa</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500 mt-2"></div>
              <div>
                <p className="text-sm font-medium">Nuovo appuntamento</p>
                <p className="text-xs text-gray-500">Giulia Bianchi - 45 min fa</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-yellow-500 mt-2"></div>
              <div>
                <p className="text-sm font-medium">Prodotto venduto</p>
                <p className="text-xs text-gray-500">Shampoo Professionale - 1 ora fa</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;