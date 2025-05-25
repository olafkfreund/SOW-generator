import React, { useEffect, useState } from 'react';
import './ManagementDashboard.css';

type Engineer = { id: number; name: string; role: string };
type TimeOff = { engineerId: number | string; date: string; type: string };
type Price = { service: string; price: number | string };

const ManagementDashboard: React.FC = () => {
  // Engineers
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [newEngineer, setNewEngineer] = useState<{ name: string; role: string }>({ name: '', role: '' });
  const [showEngineerForm, setShowEngineerForm] = useState(false);
  
  // Calendar
  const [calendar, setCalendar] = useState<TimeOff[]>([]);
  const [newTimeOff, setNewTimeOff] = useState<{ engineerId: string; date: string; type: string }>({ engineerId: '', date: '', type: '' });
  const [showCalendarForm, setShowCalendarForm] = useState(false);
  
  // Pricing
  const [pricing, setPricing] = useState<Price[]>([]);
  const [newPrice, setNewPrice] = useState<{ service: string; price: string }>({ service: '', price: '' });
  const [showPricingForm, setShowPricingForm] = useState(false);
  
  // Error
  const [error, setError] = useState('');

  // Fetch data
  useEffect(() => {
    fetch('/api/engineers').then(r => r.json()).then(setEngineers);
    fetch('/api/calendar').then(r => r.json()).then(setCalendar);
    fetch('/api/pricing').then(r => r.json()).then(setPricing);
  }, []);

  // Add engineer
  const addEngineer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await fetch('/api/engineers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEngineer)
      });
      setEngineers([...engineers, { ...newEngineer, id: Date.now() }]);
      setNewEngineer({ name: '', role: '' });
      setShowEngineerForm(false);
    } catch (err: any) {
      setError('Failed to add engineer');
    }
  };

  // Add time off
  const addTimeOff = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTimeOff)
      });
      setCalendar([...calendar, { ...newTimeOff } as TimeOff]);
      setNewTimeOff({ engineerId: '', date: '', type: '' });
      setShowCalendarForm(false);
    } catch (err: any) {
      setError('Failed to add time off');
    }
  };

  // Add price
  const addPrice = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await fetch('/api/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPrice)
      });
      setPricing([...pricing, { ...newPrice, price: Number(newPrice.price) } as Price]);
      setNewPrice({ service: '', price: '' });
      setShowPricingForm(false);
    } catch (err: any) {
      setError('Failed to add price');
    }
  };

  return (
    <div className="management-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">⚙️ Management Dashboard</h1>
        <p className="dashboard-subtitle">
          Manage engineers, schedule time off, and configure pricing
        </p>
      </div>

      {error && (
        <div className="error-message">
          <span>⚠️</span> {error}
        </div>
      )}

      <div className="dashboard-sections">
        {/* Engineers Section */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">
              <span className="section-icon">👥</span>
              Engineers
            </h2>
            <button 
              className="add-button"
              onClick={() => setShowEngineerForm(!showEngineerForm)}
            >
              <span>➕</span> Add Engineer
            </button>
          </div>

          {showEngineerForm && (
            <div className="form-container">
              <form onSubmit={addEngineer}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      className="form-input"
                      placeholder="Enter engineer name"
                      value={newEngineer.name}
                      onChange={ev => setNewEngineer({ ...newEngineer, name: ev.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Role/Position</label>
                    <input
                      className="form-input"
                      placeholder="e.g., Senior Developer"
                      value={newEngineer.role}
                      onChange={ev => setNewEngineer({ ...newEngineer, role: ev.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary btn-save">
                    💾 Save Engineer
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary btn-cancel"
                    onClick={() => setShowEngineerForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="item-list">
            {engineers.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">👨‍💻</div>
                <div className="empty-title">No Engineers Added</div>
                <div className="empty-message">Add your first engineer to get started</div>
              </div>
            ) : (
              engineers.map((engineer) => (
                <div key={engineer.id} className="item-card">
                  <div className="item-header">
                    <div>
                      <div className="item-title">{engineer.name}</div>
                      <div className="item-subtitle">{engineer.role}</div>
                    </div>
                    <div className="item-actions">
                      <button className="action-button edit-button">
                        ✏️ Edit
                      </button>
                      <button className="action-button delete-button">
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                  <div className="item-details">
                    <div className="item-detail">
                      <span className="detail-label">ID:</span>
                      <span className="detail-value">#{engineer.id}</span>
                    </div>
                    <div className="item-detail">
                      <span className="detail-label">Status:</span>
                      <span className="detail-value">
                        <span className="badge badge-success">Active</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Calendar Section */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">
              <span className="section-icon">📅</span>
              Time Off Calendar
            </h2>
            <button 
              className="add-button"
              onClick={() => setShowCalendarForm(!showCalendarForm)}
            >
              <span>➕</span> Add Time Off
            </button>
          </div>

          {showCalendarForm && (
            <div className="form-container">
              <form onSubmit={addTimeOff}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Engineer</label>
                    <select
                      className="form-select"
                      value={newTimeOff.engineerId}
                      onChange={ev => setNewTimeOff({ ...newTimeOff, engineerId: ev.target.value })}
                      required
                    >
                      <option value="">Select Engineer</option>
                      {engineers.map(eng => (
                        <option key={eng.id} value={eng.id}>
                          {eng.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={newTimeOff.date}
                      onChange={ev => setNewTimeOff({ ...newTimeOff, date: ev.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Type</label>
                    <select
                      className="form-select"
                      value={newTimeOff.type}
                      onChange={ev => setNewTimeOff({ ...newTimeOff, type: ev.target.value })}
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="Vacation">Vacation</option>
                      <option value="Sick Leave">Sick Leave</option>
                      <option value="Personal">Personal</option>
                      <option value="Conference">Conference</option>
                    </select>
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary btn-save">
                    📅 Schedule Time Off
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary btn-cancel"
                    onClick={() => setShowCalendarForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="item-list">
            {calendar.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📅</div>
                <div className="empty-title">No Time Off Scheduled</div>
                <div className="empty-message">Schedule time off for your team</div>
              </div>
            ) : (
              calendar.map((timeOff, index) => (
                <div key={index} className="item-card calendar-event">
                  <div className="item-header">
                    <div>
                      <div className="event-date">{timeOff.date}</div>
                      <div className="event-title">
                        Engineer #{timeOff.engineerId}
                      </div>
                    </div>
                    <div className="item-actions">
                      <span className="event-type">{timeOff.type}</span>
                      <button className="action-button delete-button">
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pricing Section */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">
              <span className="section-icon">💰</span>
              Price List
            </h2>
            <button 
              className="add-button"
              onClick={() => setShowPricingForm(!showPricingForm)}
            >
              <span>➕</span> Add Service
            </button>
          </div>

          {showPricingForm && (
            <div className="form-container">
              <form onSubmit={addPrice}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Service Name</label>
                    <input
                      className="form-input"
                      placeholder="e.g., Senior Developer Hourly"
                      value={newPrice.service}
                      onChange={ev => setNewPrice({ ...newPrice, service: ev.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Price (USD)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="form-input"
                      placeholder="150.00"
                      value={newPrice.price}
                      onChange={ev => setNewPrice({ ...newPrice, price: ev.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary btn-save">
                    💰 Add Service
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary btn-cancel"
                    onClick={() => setShowPricingForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="item-list">
            {pricing.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">💰</div>
                <div className="empty-title">No Services Configured</div>
                <div className="empty-message">Add pricing for your services</div>
              </div>
            ) : (
              pricing.map((price, index) => (
                <div key={index} className="item-card pricing-card">
                  <div className="item-header">
                    <div>
                      <div className="item-title">{price.service}</div>
                      <div className="rate-display">
                        <span className="currency">$</span>{price.price}
                      </div>
                    </div>
                    <div className="item-actions">
                      <button className="action-button edit-button">
                        ✏️ Edit
                      </button>
                      <button className="action-button delete-button">
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagementDashboard;
