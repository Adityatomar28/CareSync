import { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import api from '../services/api';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function CalendarView() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [medRes, apptRes] = await Promise.all([
          api.get('/medications'),
          api.get('/appointments')
        ]);

        const medications = medRes.data.data || [];
        const appointments = apptRes.data.data || [];

        const medEvents = medications.map((med: any) => ({
          title: `💊 Med: ${med.name}`,
          start: new Date(med.startDate),
          end: new Date(med.startDate),
          allDay: true,
          resource: 'medication'
        }));

        const apptEvents = appointments.map((appt: any) => {
          const startDate = new Date(appt.date);
          const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Add 1 hour
          return {
            title: `📅 Dr. ${appt.doctorName}`,
            start: startDate,
            end: endDate,
            allDay: false,
            resource: 'appointment'
          };
        });

        setEvents([...medEvents, ...apptEvents]);
      } catch (err) {
        console.error('Failed to fetch calendar data', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Custom event styles
  const eventStyleGetter = (event: any) => {
    let backgroundColor = 'var(--primary)';
    if (event.resource === 'medication') {
      backgroundColor = 'var(--secondary)';
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '8px',
        opacity: 0.9,
        color: 'white',
        border: 'none',
        display: 'block'
      }
    };
  };

  return (
    <div className="animate-fade-in" style={{ height: 'calc(100vh - 4rem)' }}>
      <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Calendar</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Manage your appointments & medications easily</p>

      {/* Calendar Dark Theme Overrides */}
      <style>{`
        .rbc-calendar {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 16px;
          padding: 1.5rem;
          color: var(--text-main);
          font-family: inherit;
        }
        .rbc-header {
          border-bottom: 1px solid var(--glass-border);
          padding: 0.5rem;
          font-weight: 600;
        }
        .rbc-month-view, .rbc-time-view, .rbc-agenda-view {
          border: 1px solid var(--glass-border);
          border-radius: 8px;
          overflow: hidden;
        }
        .rbc-day-bg + .rbc-day-bg {
          border-left: 1px solid var(--glass-border);
        }
        .rbc-month-row + .rbc-month-row {
          border-top: 1px solid var(--glass-border);
        }
        .rbc-off-range-bg {
          background: rgba(255, 255, 255, 0.02);
        }
        .rbc-today {
          background: rgba(79, 70, 229, 0.1);
        }
        .rbc-btn-group button {
          color: var(--text-main);
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
        }
        .rbc-btn-group button:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-main);
        }
        .rbc-btn-group button.rbc-active {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
          box-shadow: none;
        }
        .rbc-toolbar button:active, .rbc-toolbar button.rbc-active:hover, .rbc-toolbar button.rbc-active:focus {
          background: var(--primary);
          color: white;
        }
        .rbc-event {
          padding: 2px 8px;
        }
        .rbc-time-content, .rbc-time-header {
          border-color: var(--glass-border);
        }
        .rbc-time-gutter .rbc-timeslot-group {
          border-color: var(--glass-border);
        }
        .rbc-timeslot-group {
          border-color: var(--glass-border);
        }
        .rbc-day-slot .rbc-time-slot {
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
      `}</style>

      {loading ? (
        <div className="skeleton" style={{ height: '70vh', width: '100%' }} />
      ) : (
        <div style={{ height: '70vh' }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            eventPropGetter={eventStyleGetter}
            views={['month', 'week', 'day', 'agenda']}
          />
        </div>
      )}
    </div>
  );
}
