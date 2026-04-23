import { useState, useEffect } from 'react';

export default function HomePage() {
  const [stats, setStats] = useState({
    unreadEmails: 0,
    todayEvents: 0,
    activeRules: 0,
  });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchProjects();
  }, []);

  const fetchStats = async () => {
    try {
      const [emailRes, calendarRes, rulesRes] = await Promise.all([
        fetch('/api/email/unread-count'),
        fetch('/api/calendar/week'),
        fetch('/api/rules/active'),
      ]);
      const emailData = await emailRes.json();
      const calendarData = await calendarRes.json();
      const rulesData = await rulesRes.json();

      setStats({
        unreadEmails: emailData.unread || 0,
        todayEvents: calendarData.length || 0,
        activeRules: rulesData.length || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Unread Emails</h3>
          <p className="text-4xl font-bold text-blue-600">{stats.unreadEmails}</p>
          <p className="text-xs text-gray-500 mt-2">From your inbox</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">This Week Events</h3>
          <p className="text-4xl font-bold text-green-600">{stats.todayEvents}</p>
          <p className="text-xs text-gray-500 mt-2">Next 7 days</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Active Rules</h3>
          <p className="text-4xl font-bold text-purple-600">{stats.activeRules}</p>
          <p className="text-xs text-gray-500 mt-2">Email automation</p>
        </div>
      </div>

      {/* Projects Status */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Projects Status</h2>
        {loading ? (
          <p className="text-gray-500">Loading projects...</p>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.name} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-800">{project.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    project.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 w-12 text-right">{project.progress}%</span>
                </div>
                <div className="mt-2">
                  <p className="text-xs font-semibold text-gray-700 mb-1">Next Steps:</p>
                  <ul className="text-xs text-gray-600 list-disc pl-5">
                    {project.nextSteps.slice(0, 2).map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
