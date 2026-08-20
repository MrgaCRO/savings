import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Trash2, CheckCircle } from 'lucide-react';

export function PurchasedHistory({ purchasedGoals, onDeletePurchased }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!purchasedGoals || purchasedGoals.length === 0) return null;

  return (
    <div className="card" style={{ marginTop: '2rem' }}>
      <div 
        className="purchased-header" 
        onClick={() => setIsOpen(!isOpen)}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', fontSize: '1rem', color: 'var(--color-text)' }}>
          <CheckCircle size={18} color="var(--color-primary)" />
          Povijest kupnji ({purchasedGoals.length})
        </span>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>
      
      {isOpen && (
        <div className="purchased-list">
          {purchasedGoals.map(goal => (
            <div key={goal.id} className="purchased-item">
              <div className="purchased-item-info">
                <span className="purchased-item-title">{goal.name}</span>
                <span className="purchased-item-meta">
                  Cijena: {goal.cost} € 
                  {goal.amountFromSavings > 0 
                    ? ` (iz štednje: ${goal.amountFromSavings} €)` 
                    : ' (van štednje)'}
                </span>
              </div>
              <button 
                onClick={() => onDeletePurchased(goal.id)}
                className="btn-danger"
                style={{ padding: '0.25rem', display: 'flex', alignItems: 'center' }}
                title="Ukloni iz povijesti"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
