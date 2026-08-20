import React, { useState, useEffect } from 'react';
import { Wallet, TrendingUp } from 'lucide-react';
import { AddGoalForm } from './components/AddGoalForm';
import { Timeline } from './components/Timeline';
import { PurchasedHistory } from './components/PurchasedHistory';
import { Statistics } from './components/Statistics';
import { calculateTimeline } from './utils/calculations';
import './index.css';

function App() {
  const [currentSavings, setCurrentSavings] = useState(() => {
    const saved = localStorage.getItem('currentSavings');
    return saved !== null ? Number(saved) : 1500;
  });
  
  const [monthlySavings, setMonthlySavings] = useState(() => {
    const saved = localStorage.getItem('monthlySavings');
    return saved !== null ? Number(saved) : 200;
  });

  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('goals');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      { id: '1', name: 'Putovanje', cost: 2000, priority: 1, addedAt: Date.now() - 100000 },
      { id: '2', name: 'Mobitel', cost: 1800, priority: 1, addedAt: Date.now() - 50000 },
      { id: '3', name: 'Pametni sat', cost: 800, priority: 2, addedAt: Date.now() }
    ];
  });

  const [purchasedGoals, setPurchasedGoals] = useState(() => {
    const saved = localStorage.getItem('purchasedGoals');
    return saved ? JSON.parse(saved) : [];
  });

  const [activePurchaseGoal, setActivePurchaseGoal] = useState(null);
  const [fundingSource, setFundingSource] = useState('outside'); // 'outside' or 'savings'
  const [amountFromSavings, setAmountFromSavings] = useState('');

  useEffect(() => {
    localStorage.setItem('currentSavings', currentSavings);
  }, [currentSavings]);

  useEffect(() => {
    localStorage.setItem('monthlySavings', monthlySavings);
  }, [monthlySavings]);

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('purchasedGoals', JSON.stringify(purchasedGoals));
  }, [purchasedGoals]);

  const handleAddGoal = (newGoal) => {
    const goal = {
      ...newGoal,
      id: Date.now().toString(),
      addedAt: Date.now()
    };
    setGoals([...goals, goal]);
  };

  const handleDeleteGoal = (id) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const handleUpdatePriority = (id, newPriority) => {
    setGoals(goals.map(g => g.id === id ? { ...g, priority: newPriority } : g));
  };

  const handleOpenPurchaseModal = (goal) => {
    setActivePurchaseGoal(goal);
    setFundingSource('outside');
    const maxSavingsAvailable = Math.min(goal.cost, currentSavings);
    setAmountFromSavings(maxSavingsAvailable.toString());
  };

  const handleConfirmPurchase = (e) => {
    e.preventDefault();
    if (!activePurchaseGoal) return;

    let takenFromSavings = 0;
    if (fundingSource === 'savings') {
      takenFromSavings = Number(amountFromSavings) || 0;
      const maxPossible = Math.min(activePurchaseGoal.cost, currentSavings);
      if (takenFromSavings > maxPossible) {
        takenFromSavings = maxPossible;
      }
      if (takenFromSavings < 0) {
        takenFromSavings = 0;
      }
    }

    // Deduct from savings
    setCurrentSavings(prev => Math.max(0, prev - takenFromSavings));

    // Add to purchased list
    const purchasedItem = {
      ...activePurchaseGoal,
      amountFromSavings: takenFromSavings,
      purchasedAt: Date.now()
    };
    setPurchasedGoals([purchasedItem, ...purchasedGoals]);

    // Remove from active goals
    setGoals(goals.filter(g => g.id !== activePurchaseGoal.id));

    // Close modal
    setActivePurchaseGoal(null);
  };

  const handleDeletePurchased = (id) => {
    setPurchasedGoals(purchasedGoals.filter(g => g.id !== id));
  };

  const { results, buyNowOpportunities } = calculateTimeline(currentSavings, monthlySavings, goals);

  return (
    <div className="app-container">
      <header>
        <h1>Planer Štednje</h1>
        <p className="header-subtitle">Pratite svoje ciljeve i saznajte kada ćete ih ostvariti</p>
      </header>

      <div className="grid-layout">
        <div>
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h2 className="card-title">
              <Wallet className="text-primary" size={20} color="var(--color-primary)" />
              Vaše financije
            </h2>
            <div className="form-group">
              <label>Trenutno ušteđeno (€)</label>
              <input
                type="number"
                min="0"
                className="input-field"
                value={currentSavings}
                onChange={(e) => setCurrentSavings(Number(e.target.value) || 0)}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Mjesečno izdvajanje za štednju (€)</label>
              <div style={{ position: 'relative' }}>
                <TrendingUp 
                  size={18} 
                  color="var(--color-text-light)" 
                  style={{ position: 'absolute', top: '14px', left: '12px' }} 
                />
                <input
                  type="number"
                  min="0"
                  className="input-field"
                  style={{ paddingLeft: '2.5rem' }}
                  value={monthlySavings}
                  onChange={(e) => setMonthlySavings(Number(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          <AddGoalForm onAddGoal={handleAddGoal} />
          
          <PurchasedHistory 
            purchasedGoals={purchasedGoals} 
            onDeletePurchased={handleDeletePurchased} 
          />

          <Statistics purchasedGoals={purchasedGoals} />
        </div>

        <div>
          <Timeline 
            results={results} 
            buyNowOpportunities={buyNowOpportunities} 
            onDelete={handleDeleteGoal}
            onUpdatePriority={handleUpdatePriority}
            onPurchase={handleOpenPurchaseModal}
          />
        </div>
      </div>

      {/* Purchase Financing Modal */}
      {activePurchaseGoal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h3 className="modal-header">Označite kao kupljeno</h3>
            <p style={{ marginBottom: '1.25rem', fontSize: '0.95rem' }}>
              Kupili ste <strong>{activePurchaseGoal.name}</strong> za <strong>{activePurchaseGoal.cost} €</strong>. 
              Kako ste financirali ovu kupnju?
            </p>
            
            <form onSubmit={handleConfirmPurchase}>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="fundingSource"
                    value="outside"
                    checked={fundingSource === 'outside'}
                    onChange={() => setFundingSource('outside')}
                  />
                  <div>
                    <strong style={{ fontSize: '0.9rem' }}>Izvan štednje</strong>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', margin: '0.15rem 0 0 0' }}>
                      Plaćeno vlastitim novcem izvan štednje. Stanje štednje ostaje isto ({currentSavings} €).
                    </p>
                  </div>
                </label>
                
                <label className="radio-option">
                  <input
                    type="radio"
                    name="fundingSource"
                    value="savings"
                    checked={fundingSource === 'savings'}
                    disabled={currentSavings <= 0}
                    onChange={() => setFundingSource('savings')}
                  />
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: currentSavings <= 0 ? 'var(--color-text-light)' : 'inherit' }}>
                      Iz štednje
                    </strong>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)', margin: '0.15rem 0 0 0' }}>
                      {currentSavings <= 0 
                        ? 'Nemate ušteđevine na raspolaganju.' 
                        : 'Koristi dio ili cijeli iznos iz trenutne štednje.'}
                    </p>
                  </div>
                </label>
              </div>

              {fundingSource === 'savings' && currentSavings > 0 && (
                <div className="form-group" style={{ marginTop: '1.25rem', paddingLeft: '1.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '500' }}>Iznos uzet iz štednje (€)</label>
                  <input
                    type="number"
                    className="input-field"
                    min="0"
                    max={Math.min(activePurchaseGoal.cost, currentSavings)}
                    value={amountFromSavings}
                    onChange={(e) => setAmountFromSavings(e.target.value)}
                    required
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', display: 'block', marginTop: '0.25rem' }}>
                    Maksimalno možete povući: {Math.min(activePurchaseGoal.cost, currentSavings)} € (preostali dio plaćate van štednje).
                  </span>
                </div>
              )}

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-outline" 
                  onClick={() => setActivePurchaseGoal(null)}
                >
                  Odustani
                </button>
                <button type="submit" className="btn btn-primary btn-success">
                  Potvrdi kupnju
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
