import { useState } from 'react';
import { submitCheckin } from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFaceFrown,
  faFaceMeh,
  faFaceSmile,
  faFaceLaugh,
  faFaceGrinStars,
  faClipboardCheck,
  faMoon,
  faDroplet,
  faPlus,
  faMinus,
  faXmark,
  faBandage,
  faCircleCheck,
  faForwardStep,
  faSpinner,
  faTriangleExclamation,
  faStarOfLife,
} from '@fortawesome/free-solid-svg-icons';

const MOOD_OPTIONS = [
  { value: 1, icon: faFaceFrown,     label: 'Very low',  color: '#e74c3c', bg: '#fdf0ef' },
  { value: 2, icon: faFaceMeh,       label: 'Low',       color: '#e67e22', bg: '#fef5ec' },
  { value: 3, icon: faFaceSmile,     label: 'Neutral',   color: '#f1c40f', bg: '#fefce8' },
  { value: 4, icon: faFaceLaugh,     label: 'Good',      color: '#2ecc71', bg: '#edfaf4' },
  { value: 5, icon: faFaceGrinStars, label: 'Excellent', color: '#2d7a4e', bg: '#e8f5ee' },
];

const SLEEP_PRESETS = [5, 6, 7, 8, 9];
const MAX_HYDRATION = 12;

export default function CheckinModal({ isOpen, onClose, onSave, sessionId }) {
  const [sleepHours, setSleepHours] = useState('');
  const [mood, setMood] = useState(null);
  const [hydration, setHydration] = useState(0);
  const [symptomInput, setSymptomInput] = useState('');
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const selectedMood = MOOD_OPTIONS.find(o => o.value === mood);

  const addSymptom = () => {
    const val = symptomInput.trim();
    if (val && !symptoms.includes(val)) {
      setSymptoms([...symptoms, val]);
      setSymptomInput('');
    }
  };

  const removeSymptom = (s) => setSymptoms(symptoms.filter(x => x !== s));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mood) return;
    setLoading(true);
    setError('');
    try {
      await submitCheckin({
        session_id: "session1",
        sleep_hours: parseFloat(sleepHours) || 0,
        mood,
        hydration,
        symptoms,
      });
      onSave({ sleep: sleepHours || '—', mood, hydration: hydration || '—', symptoms });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('afya_skip_today', 'true');
    localStorage.setItem('afya_skip_date', today);
    onClose();
  };

  const hydrationStatus =
    hydration === 0 ? 'None yet' :
    hydration >= 8  ? 'Well hydrated' :
    hydration >= 4  ? 'Getting there' : 'Low';

  const hydrationColor =
    hydration >= 8  ? 'var(--a-green)' :
    hydration >= 4  ? '#e67e22' : '#aaa';

  return (
    <>
      <style>{`
        @keyframes afya-modal-in {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes afya-overlay-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .afya-ci-overlay {
          position: fixed; inset: 0;
          background: rgba(10,28,18,0.6);
          backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000;
          animation: afya-overlay-in 0.2s ease both;
        }
        .afya-ci-box {
          background: #ffffff;
          border-radius: 22px;
          width: 90%; max-width: 500px;
          max-height: 90vh; overflow-y: auto;
          animation: afya-modal-in 0.3s cubic-bezier(0.34,1.4,0.64,1) both;
          box-shadow: 0 28px 64px rgba(10,28,18,0.2), 0 4px 16px rgba(10,28,18,0.08);
        }
        .afya-ci-box::-webkit-scrollbar { width: 3px; }
        .afya-ci-box::-webkit-scrollbar-thumb { background: var(--a-green); border-radius: 3px; }

        .afya-ci-header {
          background: linear-gradient(135deg, #2d7a4e, #3a9660);
          padding: 16px 24px 12px;
          border-radius: 22px 22px 0 0;
          position: relative; overflow: hidden;
        }
        .afya-ci-header::before {
          content: ''; position: absolute;
          top: -40px; right: -40px;
          width: 140px; height: 140px; border-radius: 50%;
          background: rgba(255,255,255,0.07); pointer-events: none;
        }
        .afya-ci-header::after {
          content: ''; position: absolute;
          bottom: -25px; right: 70px;
          width: 80px; height: 80px; border-radius: 50%;
          background: rgba(255,255,255,0.05); pointer-events: none;
        }
        .afya-ci-icon-badge {
          width: 36px; height: 36px; border-radius: 10px;
          background: rgba(255,255,255,0.18);
          border: 1px solid rgba(255,255,255,0.28);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 8px; position: relative;
        }
        .afya-ci-title {
          font-family: 'DM Serif Display', serif;
          font-size: 1.5rem; color: white;
          margin: 0 0 2px; position: relative;
        }
        .afya-ci-date {
          font-size: 11px; color: rgba(255,255,255,0.7);
          margin: 0; position: relative;
          font-family: 'DM Sans', sans-serif;
        }

        .afya-ci-body {
          padding: 14px 24px 0px;
        }

        .afya-ci-section { margin-bottom: 16px; }

        .afya-ci-label {
          display: flex; align-items: center; gap: 7px;
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--a-cream3); margin-bottom: 8px;
        }
        .afya-ci-label-icon {
          width: 20px; height: 20px; border-radius: 6px;
          background: rgba(45,122,78,0.1);
          display: flex; align-items: center; justify-content: center;
          color: var(--a-green); flex-shrink: 0;
        }
        .afya-ci-label-aside {
          margin-left: auto; font-size: 10px; font-weight: 600;
          letter-spacing: 0.04em; text-transform: none;
        }

        .afya-ci-divider { height: 1px; background: #f0f0ee; margin: 12px 0; }

        /* Sleep */
        .afya-ci-sleep-input {
          width: 100%; padding: 9px 12px;
          border: 1.5px solid #e8e8e8; border-radius: 10px;
          font-family: 'DM Sans', sans-serif; font-size: 14px;
          color: var(--a-cream); outline: none; margin-bottom: 6px;
          transition: border-color 0.18s; box-sizing: border-box;
        }
        .afya-ci-sleep-input:focus { border-color: var(--a-green); }
        .afya-ci-presets { display: flex; gap: 5px; flex-wrap: wrap; }
        .afya-ci-preset {
          padding: 4px 12px; border-radius: 20px;
          border: 1.5px solid #e8e8e8; background: none;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 600; color: var(--a-cream2);
          transition: all 0.14s;
        }
        .afya-ci-preset:hover { border-color: var(--a-green); color: var(--a-green); }
        .afya-ci-preset.on { background: var(--a-green); border-color: var(--a-green); color: white; }

        /* Mood */
        .afya-ci-mood-grid {
          display: grid; grid-template-columns: repeat(5,1fr); gap: 5px;
        }
        .afya-ci-mood-btn {
          display: flex; flex-direction: column; align-items: center;
          padding: 6px 2px 4px; border-radius: 12px;
          border: 2px solid transparent; cursor: pointer;
          transition: all 0.17s; background: #f7f7f6;
          font-family: 'DM Sans', sans-serif;
        }
        .afya-ci-mood-btn svg {
          font-size: 20px;
        }
        .afya-ci-mood-btn:hover { transform: translateY(-2px); }
        .afya-ci-mood-lbl {
          font-size: 9px; font-weight: 600; margin-top: 4px;
          text-align: center; line-height: 1.2;
        }

        /* Hydration */
        .afya-ci-hydration-row {
          display: flex; align-items: center; gap: 8px;
        }
        .afya-ci-h-btn {
          width: 30px; height: 30px; border-radius: 8px;
          border: 1.5px solid #e8e8e8; background: none;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: var(--a-cream2);
          transition: all 0.14s; flex-shrink: 0;
        }
        .afya-ci-h-btn:hover:not(:disabled) {
          border-color: var(--a-green); color: var(--a-green);
          background: rgba(45,122,78,0.05);
        }
        .afya-ci-h-btn:disabled { opacity: 0.28; cursor: not-allowed; }
        .afya-ci-h-count {
          font-size: 19px; font-weight: 700; color: var(--a-green);
          min-width: 24px; text-align: center;
          font-family: 'DM Serif Display', serif;
        }
        .afya-ci-h-dots {
          display: flex; flex-wrap: wrap; gap: 2px; flex: 1;
        }
        .afya-ci-hdot {
          width: 13px; height: 13px; border-radius: 50%;
          cursor: pointer; transition: transform 0.12s;
        }
        .afya-ci-hdot:hover { transform: scale(1.2); }
        .afya-ci-hdot.on  { background: #3b9fd4; }
        .afya-ci-hdot.off { background: #eef0f2; }

        /* Symptoms */
        .afya-ci-sym-row { display: flex; gap: 6px; }
        .afya-ci-sym-input {
          flex: 1; padding: 8px 12px;
          border: 1.5px solid #e8e8e8; border-radius: 10px;
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          color: var(--a-cream); outline: none;
          transition: border-color 0.18s;
        }
        .afya-ci-sym-input:focus { border-color: var(--a-green); }
        .afya-ci-sym-add {
          padding: 0 12px; border-radius: 10px;
          background: var(--a-green); color: white;
          border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 700;
          transition: opacity 0.14s;
        }
        .afya-ci-sym-add:hover { opacity: 0.86; }
        .afya-ci-sym-tags { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 8px; }
        .afya-ci-sym-tag {
          display: inline-flex; align-items: center; gap: 5px;
          background: #f0f7f3; border: 1px solid rgba(45,122,78,0.2);
          padding: 4px 8px 4px 10px; border-radius: 20px;
          font-size: 11px; font-weight: 500; color: var(--a-green);
          font-family: 'DM Sans', sans-serif;
        }
        .afya-ci-sym-rm {
          width: 16px; height: 16px; border-radius: 50%;
          background: rgba(45,122,78,0.15); border: none;
          display: flex; align-items: center; justify-content: center;
          color: var(--a-green); cursor: pointer; flex-shrink: 0;
          transition: background 0.14s;
        }
        .afya-ci-sym-rm:hover { background: rgba(231,76,60,0.15); color: #e74c3c; }

        /* Error */
        .afya-ci-error {
          display: flex; align-items: center; gap: 8px;
          background: #fdf0ef; border: 1px solid rgba(231,76,60,0.25);
          border-radius: 10px; padding: 8px 12px;
          color: #c0392b; font-size: 12px; margin-bottom: 12px;
          font-family: 'DM Sans', sans-serif;
        }

        /* Footer */
        .afya-ci-footer {
          display: flex; align-items: center; gap: 9px;
          padding: 12px 24px 16px;
          border-top: 1px solid #f0f0ee;
        }
        .afya-ci-btn-skip {
          background: none; border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; color: var(--a-cream3);
          display: flex; align-items: center; gap: 5px;
          padding: 6px 0; transition: color 0.14s; margin-right: auto;
        }
        .afya-ci-btn-skip:hover { color: var(--a-cream2); }
        .afya-ci-btn-cancel {
          padding: 8px 16px; border-radius: 9px;
          border: 1.5px solid #e8e8e8; background: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 500; color: var(--a-cream2);
          cursor: pointer; transition: all 0.14s;
        }
        .afya-ci-btn-cancel:hover { border-color: #ccc; }
        .afya-ci-btn-save {
          padding: 8px 18px; border-radius: 9px;
          background: var(--a-green); color: white; border: none;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 700;
          display: flex; align-items: center; gap: 6px;
          transition: all 0.17s;
          box-shadow: 0 3px 12px rgba(45,122,78,0.28);
        }
        .afya-ci-btn-save:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(45,122,78,0.38);
        }
        .afya-ci-btn-save:disabled { opacity: 0.55; cursor: not-allowed; transform: none; box-shadow: none; }

        @media (max-width: 500px) {
          .afya-ci-mood-grid {
            grid-template-columns: repeat(3, 1fr);
          }
          .afya-ci-hydration-row {
            flex-wrap: wrap;
          }
        }
      `}</style>

      <div className="afya-ci-overlay">
        <div className="afya-ci-box">

          {/* ── Header ── */}
          <div className="afya-ci-header">
            <div className="afya-ci-icon-badge">
              <FontAwesomeIcon icon={faClipboardCheck} style={{ fontSize: 16, color: 'white' }} />
            </div>
            <h2 className="afya-ci-title">Daily Check-in</h2>
            <p className="afya-ci-date">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* ── Body ── */}
          <div className="afya-ci-body">
            <form onSubmit={handleSubmit}>

              {/* Sleep */}
              <div className="afya-ci-section">
                <div className="afya-ci-label">
                  <div className="afya-ci-label-icon">
                    <FontAwesomeIcon icon={faMoon} style={{ fontSize: 10 }} />
                  </div>
                  Sleep
                </div>
                <input
                  className="afya-ci-sleep-input"
                  type="number" step="0.5" min="0" max="24"
                  value={sleepHours}
                  onChange={e => setSleepHours(e.target.value)}
                  placeholder="Hours slept last night"
                  required
                />
                <div className="afya-ci-presets">
                  {SLEEP_PRESETS.map(h => (
                    <button
                      key={h} type="button"
                      className={`afya-ci-preset${sleepHours === String(h) ? ' on' : ''}`}
                      onClick={() => setSleepHours(String(h))}
                    >
                      {h}h
                    </button>
                  ))}
                </div>
              </div>

              <div className="afya-ci-divider" />

              {/* Mood */}
              <div className="afya-ci-section">
                <div className="afya-ci-label">
                  <div className="afya-ci-label-icon">
                    <FontAwesomeIcon icon={faFaceSmile} style={{ fontSize: 10 }} />
                  </div>
                  Mood
                  {selectedMood && (
                    <span className="afya-ci-label-aside" style={{ color: selectedMood.color }}>
                      {selectedMood.label}
                    </span>
                  )}
                </div>
                <div className="afya-ci-mood-grid">
                  {MOOD_OPTIONS.map(opt => {
                    const on = mood === opt.value;
                    return (
                      <button
                        key={opt.value} type="button"
                        className="afya-ci-mood-btn"
                        onClick={() => setMood(opt.value)}
                        style={{
                          background: on ? opt.bg : '#f7f7f6',
                          borderColor: on ? opt.color : 'transparent',
                          transform: on ? 'translateY(-2px) scale(1.03)' : undefined,
                          boxShadow: on ? `0 4px 12px ${opt.color}40` : 'none',
                        }}
                      >
                        <FontAwesomeIcon
                          icon={opt.icon}
                          style={{ fontSize: 20, color: on ? opt.color : '#c8c8c8', transition: 'color 0.17s' }}
                        />
                        <span
                          className="afya-ci-mood-lbl"
                          style={{ color: on ? opt.color : '#bbb' }}
                        >
                          {opt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="afya-ci-divider" />

              {/* Hydration */}
              <div className="afya-ci-section">
                <div className="afya-ci-label">
                  <div className="afya-ci-label-icon">
                    <FontAwesomeIcon icon={faDroplet} style={{ fontSize: 10 }} />
                  </div>
                  Hydration
                  <span className="afya-ci-label-aside" style={{ color: hydrationColor }}>
                    {hydrationStatus}
                  </span>
                </div>
                <div className="afya-ci-hydration-row">
                  <button type="button" className="afya-ci-h-btn"
                    onClick={() => setHydration(h => Math.max(0, h - 1))}
                    disabled={hydration === 0}
                  >
                    <FontAwesomeIcon icon={faMinus} style={{ fontSize: 10 }} />
                  </button>
                  <span className="afya-ci-h-count">{hydration}</span>
                  <button type="button" className="afya-ci-h-btn"
                    onClick={() => setHydration(h => Math.min(MAX_HYDRATION, h + 1))}
                    disabled={hydration === MAX_HYDRATION}
                  >
                    <FontAwesomeIcon icon={faPlus} style={{ fontSize: 10 }} />
                  </button>
                  <div className="afya-ci-h-dots">
                    {Array.from({ length: MAX_HYDRATION }).map((_, i) => (
                      <div
                        key={i}
                        className={`afya-ci-hdot ${i < hydration ? 'on' : 'off'}`}
                        onClick={() => setHydration(i + 1)}
                        title={`${i + 1} glass${i + 1 !== 1 ? 'es' : ''}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="afya-ci-divider" />

              {/* Symptoms */}
              <div className="afya-ci-section">
                <div className="afya-ci-label">
                  <div className="afya-ci-label-icon">
                    <FontAwesomeIcon icon={faBandage} style={{ fontSize: 10 }} />
                  </div>
                  Symptoms
                  <span className="afya-ci-label-aside" style={{ color: '#bbb', fontWeight: 400 }}>
                    optional
                  </span>
                </div>
                <div className="afya-ci-sym-row">
                  <input
                    className="afya-ci-sym-input"
                    type="text"
                    value={symptomInput}
                    onChange={e => setSymptomInput(e.target.value)}
                    placeholder="e.g. headache, fatigue, nausea"
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSymptom())}
                  />
                  <button type="button" className="afya-ci-sym-add" onClick={addSymptom}>
                    Add
                  </button>
                </div>
                {symptoms.length > 0 && (
                  <div className="afya-ci-sym-tags">
                    {symptoms.map(s => (
                      <span key={s} className="afya-ci-sym-tag">
                        <FontAwesomeIcon icon={faStarOfLife} style={{ fontSize: 6, opacity: 0.5 }} />
                        {s}
                        <button type="button" className="afya-ci-sym-rm" onClick={() => removeSymptom(s)}>
                          <FontAwesomeIcon icon={faXmark} style={{ fontSize: 7 }} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {error && (
                <div className="afya-ci-error">
                  <FontAwesomeIcon icon={faTriangleExclamation} style={{ fontSize: 12 }} />
                  {error}
                </div>
              )}

            </form>
          </div>

          {/* ── Footer ── */}
          <div className="afya-ci-footer">
            <button type="button" className="afya-ci-btn-skip" onClick={handleSkip}>
              <FontAwesomeIcon icon={faForwardStep} style={{ fontSize: 10 }} />
              Skip today
            </button>
            <button type="button" className="afya-ci-btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="afya-ci-btn-save"
              disabled={loading || !mood || !sleepHours}
              onClick={handleSubmit}
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: 11 }} />
                  Saving…
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faCircleCheck} style={{ fontSize: 11 }} />
                  Save
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </>
  );
}