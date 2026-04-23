import { useState, useEffect } from 'react';

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/calendar/week');
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Calendar - Next 7 Days</h2>
        
        {loading ? (
          <p className="text-gray-500">Loading events...</p>
        ) : events.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No events scheduled for the next 7 days</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Create Event
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-4 border-l-4 border-blue-500 bg-gray-50 rounded-r-lg"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{event.title || event.summary || '(no title)'}</h3>
                  <p className="text-sm text-gray-600">
                    {event.start_time ? new Date(event.start_time).toLocaleString() : 'TBD'}
                    {event.end_time ? ` - ${new Date(event.end_time).toLocaleTimeString()}` : ''}
                  </p>
                  {event.description && (
                    <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
