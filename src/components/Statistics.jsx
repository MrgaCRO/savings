import React from 'react';
import { BarChart3 } from 'lucide-react';

export function Statistics({ purchasedGoals }) {
  if (!purchasedGoals || purchasedGoals.length === 0) return null;

  const totalFromSavings = purchasedGoals.reduce((sum, g) => sum + (g.amountFromSavings || 0), 0);
  const totalFromOther = purchasedGoals.reduce((sum, g) => sum + (g.cost - (g.amountFromSavings || 0)), 0);
  const totalSpent = purchasedGoals.reduce((sum, g) => sum + g.cost, 0);

  return (
    <div className="card" style={{ marginTop: '2rem' }}>
      <h2 className="card-title">
        <BarChart3 className="text-primary" size={20} color="var(--color-primary)" />
        Statistika potrošnje
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
          <span style={{ color: 'var(--color-text-light)' }}>Ukupno kupljeno:</span>
          <strong style={{ fontSize: '1.1rem' }}>{totalSpent} €</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '0.5rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', display: 'inline-block' }}></span>
            Iz štednje:
          </span>
          <strong>{totalFromSavings} €</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '0.5rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-text-light)', display: 'inline-block' }}></span>
            Iz drugih sredstava:
          </span>
          <strong>{totalFromOther} €</strong>
        </div>
      </div>
    </div>
  );
}
