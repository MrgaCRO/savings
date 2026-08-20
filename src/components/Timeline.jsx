import React from 'react';
import { Check, ShoppingBag, AlertCircle, Clock, Trash2, CheckSquare } from 'lucide-react';

export function Timeline({ 
  results, 
  buyNowOpportunities, 
  onDelete, 
  onUpdatePriority, 
  onPurchase
}) {
  const hasActiveGoals = results && results.length > 0;

  if (!hasActiveGoals) {
    return (
      <div className="card">
        <div className="empty-state">
          <ShoppingBag size={48} />
          <h3>Nemate postavljenih ciljeva</h3>
          <p>Dodajte svoj prvi cilj kako biste vidjeli plan štednje.</p>
        </div>
      </div>
    );
  }

  const getPrioritySelect = (goalId, priority) => {
    let selectClass = "badge-select ";
    switch(priority) {
      case 1: selectClass += "badge-high"; break;
      case 2: selectClass += "badge-medium"; break;
      case 3: selectClass += "badge-low"; break;
      default: break;
    }
    
    return (
      <select
        className={selectClass}
        value={priority}
        onChange={(e) => onUpdatePriority(goalId, Number(e.target.value))}
        title="Promijeni prioritet"
      >
        <option value="1">Visoki prioritet</option>
        <option value="2">Srednji prioritet</option>
        <option value="3">Niski prioritet</option>
      </select>
    );
  };

  return (
    <div className="card">
      <h2 className="card-title" style={{ marginBottom: '2rem' }}>
        <Clock className="text-primary" size={20} color="var(--color-primary)" />
        Vaš plan ostvarenja
      </h2>
      
      <div style={{ position: 'relative' }}>
        {results.map((goal, index) => {
          const isBuyNow = buyNowOpportunities.includes(goal.id);
          const isAffordableNow = goal.affordableNow;
          
          return (
            <div key={goal.id} className="timeline-item">
              <div className="timeline-line"></div>
              
              <div className="timeline-marker">
                {isAffordableNow || isBuyNow ? <Check size={14} /> : index + 1}
              </div>
              
              <div className={`timeline-content ${isBuyNow ? 'buy-now' : ''}`}>
                <div className="goal-header">
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>{goal.name}</h3>
                    <div className="goal-meta">
                      {getPrioritySelect(goal.id, goal.priority)}
                      <span>Dodano: {new Date(goal.addedAt).toLocaleDateString('hr-HR')}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="price-tag" style={{ marginRight: '0.5rem' }}>{goal.cost} €</span>
                    
                    <button 
                      onClick={() => onPurchase(goal)}
                      className="btn"
                      style={{ 
                        padding: '0.5rem', 
                        width: 'auto', 
                        backgroundColor: '#ecfdf5', 
                        color: 'var(--color-primary)',
                        border: '1px solid #a7f3d0'
                      }}
                      title="Označi kao kupljeno"
                      aria-label="Kupi"
                    >
                      <CheckSquare size={18} />
                    </button>

                    <button 
                      onClick={() => onDelete(goal.id)}
                      className="btn-danger"
                      title="Obriši cilj"
                      aria-label="Obriši"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {isAffordableNow ? (
                  <p style={{ color: 'var(--color-primary)', fontWeight: '500' }}>
                    Sredstva su već osigurana! Možete ostvariti ovaj cilj odmah.
                  </p>
                ) : (
                  <p>
                    Vrijeme čekanja: <strong>{goal.totalMonths} {goal.totalMonths === 1 ? 'mjesec' : 'mjeseci'}</strong> 
                    <span style={{ color: 'var(--color-text-light)', marginLeft: '0.5rem' }}>
                      (još {goal.monthsToSave} {goal.monthsToSave === 1 ? 'mjesec' : 'mjeseci'} štednje)
                    </span>
                  </p>
                )}

                {isBuyNow && (
                  <div className="buy-now-alert">
                    <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong>Prijedlog: Možete kupiti odmah!</strong>
                      <p style={{ marginTop: '0.25rem', marginBottom: 0 }}>
                        Imate dovoljno trenutne štednje za ovaj cilj. 
                        No, ako ga kupite sada, ostvarenje vaših prioritetnijih ciljeva će se pomaknuti.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
