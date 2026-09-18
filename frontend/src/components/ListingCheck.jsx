import React, { useEffect, useRef, useState } from 'react';
import Icon from './Icon';

export default function ListingCheck() {
  const [values, setValues] = useState({ rent: 8000, distance_to_miet: 2, photos_count: 4, amenities_count: 3 });
  const [state, setState] = useState({ loading: false, result: '', error: '' });
  const request = useRef(null);
  useEffect(() => () => request.current?.abort(), []);
  async function submit(event) {
    event.preventDefault();
    if (request.current) return;
    const controller = new AbortController();
    request.current = controller;
    let timeout = false;
    const timer = setTimeout(() => { timeout = true; controller.abort(); }, 15000);
    setState({ loading: true, result: '', error: '' });
    try {
      const response = await fetch(process.env.REACT_APP_CHECK_API_URL || '/check-fake', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values), signal: controller.signal });
      if (!response.ok) throw new Error(`The check could not complete (HTTP ${response.status}). Please retry.`);
      const data = await response.json();
      if (!['FAKE', 'REAL'].includes(data.status)) throw new Error('The service returned an unexpected result.');
      setState({ loading: false, result: data.status, error: '' });
    } catch (error) {
      if (!controller.signal.aborted || timeout) setState({ loading: false, result: '', error: timeout ? 'The check timed out. Please retry.' : error instanceof TypeError ? 'Cannot reach the AI service. Start the Python API and try again.' : error.message });
    } finally { clearTimeout(timer); if (request.current === controller) request.current = null; }
  }
  const fields = [['rent', 'Monthly rent (₹)', 1, 1000000], ['distance_to_miet', 'Distance from MIET (km)', 0, 100], ['photos_count', 'Number of photos', 0, 1000], ['amenities_count', 'Number of amenities', 0, 100]];
  return <div className="listing-check"><form onSubmit={submit}><span className="eyebrow">A SECOND LOOK</span><h3>Does the listing add up?</h3><p>Check for unusual patterns before reaching out to an owner.</p><fieldset disabled={state.loading}><legend className="sr-only">Listing details</legend><div className="check-inputs">{fields.map(([name, label, min, max]) => <label key={name}>{label}<input type="number" min={min} max={max} step="1" required value={values[name]} onChange={(e) => { setValues({ ...values, [name]: e.target.value === '' ? '' : Number(e.target.value) }); setState({ loading: false, result: '', error: '' }); }} /></label>)}</div><button className="primary-button" disabled={state.loading}><Icon name="shield" />{state.loading ? 'Checking listing…' : 'Check listing'}</button></fieldset></form>
    <div className="check-result" role="status" aria-live="polite"><span className="check-emblem"><Icon name="shield" size={44} /></span><h3>{state.loading ? 'Looking for unusual patterns…' : state.error ? 'Couldn’t complete the check' : state.result === 'FAKE' ? 'This listing needs a closer look' : state.result === 'REAL' ? 'No suspicious pattern flagged' : 'A little extra peace of mind.'}</h3><p>{state.error || (state.result ? 'This is a model signal, not proof of authenticity or fraud. Visit the property and verify the owner before paying.' : 'Add the listing details to run a model-based screening. The current model uses distance from MIET.')}</p><span className="small-tag">Experimental listing screening</span></div>
  </div>;
}
