import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';

export function AddGoalForm({ onAddGoal }) {
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const [priority, setPriority] = useState('2'); // Default to Medium

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !cost) return;

    onAddGoal({
      name: name.trim(),
      cost: Number(cost),
      priority: Number(priority)
    });

    // Reset
    setName('');
    setCost('');
    setPriority('2');
  };

  return (
    <div className="card">
      <h2 className="card-title">
        <PlusCircle className="text-primary" size={20} color="var(--color-primary)" />
        Dodaj novi cilj
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Što želite kupiti?</label>
          <input
            type="text"
            className="input-field"
            placeholder="npr. Pametni sat"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Koliko košta? (€)</label>
          <input
            type="number"
            min="1"
            className="input-field"
            placeholder="npr. 800"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Prioritet</label>
          <select 
            className="input-field"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="1">Visoki (Hitno)</option>
            <option value="2">Srednji</option>
            <option value="3">Niski (Nije hitno)</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Dodaj cilj
        </button>
      </form>
    </div>
  );
}
