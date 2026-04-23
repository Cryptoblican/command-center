import { useState, useEffect } from 'react';

export default function EmailPage() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      const res = await fetch('/api/email/list?limit=50');
      const data = await res.json();
      setEmails(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching emails:', error);
      setEmails([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/email/search/${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setEmails(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error searching emails:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await fetch(`/api/email/${id}/read`, { method: 'POST' });
      fetchEmails();
    } catch (error) {
      console.error('Error marking email as read:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Email</h2>
        
        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {loading ? (
          <p className="text-gray-500">Loading emails...</p>
        ) : emails.length === 0 ? (
          <p className="text-gray-500">No emails found</p>
        ) : (
          <div className="space-y-2">
            {emails.map((email, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{email.subject || '(no subject)'}</p>
                  <p className="text-sm text-gray-600">{email.sender || 'Unknown sender'}</p>
                  <p className="text-xs text-gray-500 mt-1">{email.date || 'Unknown date'}</p>
                </div>
                <button
                  onClick={() => markAsRead(email.id || i)}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200 transition-colors"
                >
                  Read
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
