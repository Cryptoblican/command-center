import { useState } from 'react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailRefreshInterval: 5,
    calendarDays: 7,
    enableNotifications: true,
    darkMode: false,
  });

  const handleSave = () => {
    localStorage.setItem('dashboardSettings', JSON.stringify(settings));
    alert('Settings saved!');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>

        <div className="space-y-6">
          {/* Email Settings */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Email</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Refresh Interval (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={settings.emailRefreshInterval}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      emailRefreshInterval: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Calendar Settings */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Calendar</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Show upcoming events (days)
                </label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={settings.calendarDays}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      calendarDays: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Notifications</h3>
            <div className="space-y-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableNotifications}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      enableNotifications: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Enable desktop notifications</span>
              </label>
            </div>
          </div>

          {/* Appearance Settings */}
          <div className="pb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Appearance</h3>
            <div className="space-y-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.darkMode}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      darkMode: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Dark mode (coming soon)</span>
              </label>
            </div>
          </div>

          {/* About */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">About</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Version:</strong> 0.1.0</p>
              <p><strong>Built with:</strong> Node.js + Express + React + Vite + SQLite</p>
              <p><strong>Database:</strong> SQLite (local)</p>
              <p><strong>API:</strong> http://localhost:3000/api</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}
