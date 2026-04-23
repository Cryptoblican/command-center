import { useState, useEffect } from 'react';

export default function AutomationPage() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    trigger_type: 'email_from',
    trigger_condition: '',
    action_type: 'label',
    action_config: {},
  });

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const res = await fetch('/api/rules');
      const data = await res.json();
      setRules(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching rules:', error);
      setRules([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRule = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormData({ name: '', trigger_type: 'email_from', trigger_condition: '', action_type: 'label', action_config: {} });
        setShowForm(false);
        fetchRules();
      }
    } catch (error) {
      console.error('Error creating rule:', error);
    }
  };

  const toggleRule = async (ruleId) => {
    try {
      await fetch(`/api/rules/${ruleId}/toggle`, { method: 'POST' });
      fetchRules();
    } catch (error) {
      console.error('Error toggling rule:', error);
    }
  };

  const deleteRule = async (ruleId) => {
    if (confirm('Delete this rule?')) {
      try {
        await fetch(`/api/rules/${ruleId}`, { method: 'DELETE' });
        fetchRules();
      } catch (error) {
        console.error('Error deleting rule:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Email Automation Rules</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showForm ? 'Cancel' : 'Create Rule'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreateRule} className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
            <input
              type="text"
              placeholder="Rule name (e.g., 'Archive promotional emails')"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Trigger Type</label>
                <select
                  value={formData.trigger_type}
                  onChange={(e) => setFormData({ ...formData, trigger_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="email_from">From sender</option>
                  <option value="email_subject">Subject contains</option>
                  <option value="email_has_attachment">Has attachment</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Trigger Condition</label>
                <input
                  type="text"
                  placeholder="e.g., promotions@example.com"
                  value={formData.trigger_condition}
                  onChange={(e) => setFormData({ ...formData, trigger_condition: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Action Type</label>
              <select
                value={formData.action_type}
                onChange={(e) => setFormData({ ...formData, action_type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="label">Apply label</option>
                <option value="archive">Archive</option>
                <option value="delete">Delete</option>
                <option value="forward">Forward</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Create Rule
            </button>
          </form>
        )}

        {loading ? (
          <p className="text-gray-500">Loading rules...</p>
        ) : rules.length === 0 ? (
          <p className="text-gray-500">No automation rules yet. Create one to get started!</p>
        ) : (
          <div className="space-y-2">
            {rules.map((rule) => (
              <div key={rule.id} className="flex items-start gap-4 p-3 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{rule.name}</h3>
                  <p className="text-sm text-gray-600">
                    {rule.trigger_type}: {rule.trigger_condition}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Action: {rule.action_type}
                  </p>
                </div>
                <button
                  onClick={() => toggleRule(rule.id)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    rule.enabled
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {rule.enabled ? 'Enabled' : 'Disabled'}
                </button>
                <button
                  onClick={() => deleteRule(rule.id)}
                  className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200 transition-colors"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
