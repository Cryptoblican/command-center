import { useState, useEffect } from 'react';

export default function PredictionsPage() {
  const [predictions, setRredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: 'crypto',
    prediction: '',
    prediction_date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      const res = await fetch('/api/predictions');
      const data = await res.json();
      setRredictions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching predictions:', error);
      setRredictions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePrediction = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormData({ category: 'crypto', prediction: '', prediction_date: new Date().toISOString().split('T')[0], notes: '' });
        setShowForm(false);
        fetchPredictions();
      }
    } catch (error) {
      console.error('Error creating prediction:', error);
    }
  };

  const resolvePrediction = async (id, result, accuracy) => {
    try {
      await fetch(`/api/predictions/${id}/resolve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ result, accuracy_score: accuracy }),
      });
      fetchPredictions();
    } catch (error) {
      console.error('Error resolving prediction:', error);
    }
  };

  const deletePrediction = async (id) => {
    if (confirm('Delete this prediction?')) {
      try {
        await fetch(`/api/predictions/${id}`, { method: 'DELETE' });
        fetchPredictions();
      } catch (error) {
        console.error('Error deleting prediction:', error);
      }
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'crypto':
        return 'bg-orange-100 text-orange-800';
      case 'sports':
        return 'bg-green-100 text-green-800';
      case 'politics':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Predictions</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showForm ? 'Cancel' : 'New Prediction'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreatePrediction} className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="crypto">Crypto</option>
                  <option value="sports">Sports</option>
                  <option value="politics">Politics</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={formData.prediction_date}
                  onChange={(e) => setFormData({ ...formData, prediction_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <textarea
              placeholder="Your prediction..."
              value={formData.prediction}
              onChange={(e) => setFormData({ ...formData, prediction: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              required
            />

            <textarea
              placeholder="Notes (optional)"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="2"
            />

            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Create Prediction
            </button>
          </form>
        )}

        {loading ? (
          <p className="text-gray-500">Loading predictions...</p>
        ) : predictions.length === 0 ? (
          <p className="text-gray-500">No predictions yet. Start tracking your predictions!</p>
        ) : (
          <div className="space-y-3">
            {predictions.map((pred) => (
              <div key={pred.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800">{pred.prediction}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getCategoryColor(pred.category)}`}>
                    {pred.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Predicted: {new Date(pred.prediction_date).toLocaleDateString()}
                </p>
                {pred.notes && (
                  <p className="text-sm text-gray-600 mb-3 italic">{pred.notes}</p>
                )}
                {!pred.result ? (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 font-semibold">Resolve prediction:</p>
                    <div className="flex gap-2 flex-wrap">
                      {['Correct', 'Incorrect', 'Partial'].map((result) => (
                        <button
                          key={result}
                          onClick={() => resolvePrediction(pred.id, result, result === 'Correct' ? 1 : result === 'Partial' ? 0.5 : 0)}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200 transition-colors"
                        >
                          {result}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Result: {pred.result}</p>
                      <p className="text-sm text-gray-600">Accuracy: {(pred.accuracy_score * 100).toFixed(0)}%</p>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => deletePrediction(pred.id)}
                  className="mt-2 px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200 transition-colors"
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
