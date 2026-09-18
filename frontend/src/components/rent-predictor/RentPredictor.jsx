import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ShineBorder } from "./ShineBorder";
import "./RentPredictor.css";

const INITIAL = { sharing_type: 2, has_ac: 1, has_wifi: 1, has_food: 1, distance_to_miet: 2 };
const AMENITIES = [
  ["has_ac", "Air conditioning", "A cooler place to unwind"],
  ["has_wifi", "Wi-Fi included", "Stay connected, study better"],
  ["has_food", "Meals included", "One less thing to plan"],
];
const rupees = new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0,
});

export default function RentPredictor({
  endpoint = process.env.REACT_APP_RENT_API_URL || "/predict-price",
  college = { id: 'miet', short: 'MIET' },
  onSelectMiet,
}) {
  const supported = college.id === 'miet';
  const [form, setForm] = useState(INITIAL);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const request = useRef(null);
  const id = useId();
  const reduceMotion = useReducedMotion();
  const spring = { type: "spring", stiffness: 260, damping: 25 };
  const enter = {
    initial: { opacity: 0, y: reduceMotion ? 0 : 20 },
    animate: { opacity: 1, y: 0 },
    transition: reduceMotion ? { duration: 0 } : spring,
  };

  useEffect(() => () => request.current?.abort(), []);

  function update(name, value) {
    setForm((previous) => ({ ...previous, [name]: value }));
    setResult(null);
    setError("");
  }

  async function predict(event) {
    event.preventDefault();
    if (request.current || !supported) return;
    const controller = new AbortController();
    request.current = controller;
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 15000);
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        signal: controller.signal,
      });
      if (!response.ok) {
        throw new Error(response.status === 422
          ? "The prediction service rejected these details. Check the API field types."
          : `Prediction service returned HTTP ${response.status}. Please try again.`);
      }
      const data = await response.json();
      if (typeof data.suggested_price !== "number" ||
          !Number.isFinite(data.suggested_price) || data.suggested_price <= 0) {
        throw new Error("The service returned an invalid rent estimate. Please try again.");
      }
      setResult(data.suggested_price);
    } catch (err) {
      if (controller.signal.aborted && !timedOut) return;
      setError(timedOut
        ? "The prediction took too long. Check that the AI service is running, then retry."
        : err instanceof TypeError
          ? "Cannot reach the AI service. Check the server, endpoint URL, and proxy or CORS setup."
          : err instanceof SyntaxError
            ? "The service did not return JSON. Check the prediction endpoint URL."
            : err.message || "Prediction failed. Please try again.");
    } finally {
      clearTimeout(timer);
      if (request.current === controller) request.current = null;
      if (!controller.signal.aborted || timedOut) setLoading(false);
    }
  }

  return (
    <section className="rp" aria-labelledby={`${id}-title`}>
      <h2 className="sr-only" id={`${id}-title`}>AI rent predictor</h2>
      {!supported && <div className="rp-coverage" role="status"><span><strong>{college.short} is in the campus explorer.</strong> Its local rent model is not available yet. Current predictions use MIET training data.</span><button type="button" onClick={onSelectMiet}>Try MIET predictor ↗</button></div>}

      <div className="rp-grid">
        <motion.form className="rp-card rp-form" onSubmit={predict} {...enter}
          transition={reduceMotion ? { duration: 0 } : { ...spring, delay: 0.1 }}>
          <div className="rp-section-heading"><span className="rp-step">✦</span><div><h3>Your room, your rules.</h3><p>Tell us what home looks like to you.</p></div></div>
          <fieldset disabled={loading || !supported} className="rp-fields">
            <legend className="rp-sr">Room preferences</legend>
            <fieldset className="rp-sharing">
              <legend>Room sharing</legend>
              <div className="rp-room-options">
                {[1, 2, 3].map((value) => (
                  <label key={value} className="rp-room">
                    <input type="radio" name={`${id}-sharing`} value={value}
                      checked={form.sharing_type === value}
                      onChange={() => update("sharing_type", value)} />
                    <motion.span whileHover={reduceMotion || loading ? {} : { y: -3 }} transition={spring}>
                      <span className="rp-room-symbol" aria-hidden="true">{value === 1 ? "▥" : value === 2 ? "▥ ▥" : "▥ ▥ ▥"}</span>
                      <strong>{["Single", "Double", "Triple"][value - 1]}</strong>
                      <small>{value === 1 ? "Your own space" : `${value} people / room`}</small>
                    </motion.span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="rp-distance">
              <div className="rp-label-row"><label htmlFor={`${id}-distance`}>Distance from MIET</label><output htmlFor={`${id}-distance`}>{form.distance_to_miet} km</output></div>
              <input id={`${id}-distance`} type="range" min="1" max="5" step="1"
                value={form.distance_to_miet}
                aria-valuetext={`${form.distance_to_miet} kilometres from MIET`}
                onChange={(event) => update("distance_to_miet", Number(event.target.value))} />
              <div className="rp-range-labels"><span>1 km · Closer to class</span><span>5 km · Further out</span></div>
            </div>

            <div className="rp-amenities">
              {AMENITIES.map(([name, title, description]) => (
                <label className="rp-amenity" key={name}>
                  <span><strong>{title}</strong><small>{description}</small></span>
                  <input type="checkbox" role="switch" checked={Boolean(form[name])}
                    onChange={(event) => update(name, Number(event.target.checked))} />
                  <span className="rp-switch" aria-hidden="true"><span /></span>
                </label>
              ))}
            </div>
            <motion.button type="submit" className="rp-submit" disabled={loading}
              whileHover={reduceMotion || loading ? {} : { y: -2, scale: 1.01 }}
              whileTap={reduceMotion || loading ? {} : { scale: 0.98 }} transition={spring}>
              <span>{loading ? "Finding your estimate…" : "Predict my rent"}</span><span aria-hidden="true">{loading ? "◌" : "↗"}</span>
            </motion.button>
          </fieldset>
          <p className="rp-footnote">MIET rent model · No sign-up needed</p>
        </motion.form>

        <motion.aside className="rp-card rp-result" {...enter}
          transition={reduceMotion ? { duration: 0 } : { ...spring, delay: 0.2 }}>
          <ShineBorder shineColor={["#8b5cf6", "#67e8f9", "#8b5cf6"]} />
          <div className="rp-result-top"><span className="rp-pill">✦ AI RENT ESTIMATE</span><span className="rp-local">{supported ? 'MIET area' : 'Model coverage'}</span></div>
          <div className="rp-result-content" aria-live="polite" aria-atomic="true" aria-busy={loading}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={loading ? "loading" : error ? "error" : result !== null ? "result" : "empty"}
                initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.2 }}>
                <div className="rp-orbit" aria-hidden="true"><span>{error ? "!" : result !== null ? "₹" : "✦"}</span></div>
                {loading ? <><h3>Connecting the dots</h3><p>Checking your room preferences with the rent model…</p><div className="rp-loading" aria-hidden="true" /></>
                  : error ? <><h3>Let’s try that again</h3><p className="rp-error">{error}</p></>
                  : result !== null ? <><p className="rp-result-label">Estimated monthly rent</p><strong className="rp-price">{rupees.format(result)}</strong><p>per month · model estimate</p><span className="rp-estimate-tag">Based on your selected preferences</span></>
                  : <><h3>{supported ? <>Big plans.<br />A clearer budget.</> : <>New campus.<br />More data needed.</>}</h3><p>{supported ? <>Set your preferences and let the model<br />find a starting point for your rent.</> : <>Select MIET to try the available model.<br />No unrelated estimate will be shown.</>}</p><span className="rp-empty-amount" aria-hidden="true">₹ — — —</span></>}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="rp-result-note"><strong>A starting point, not a quote.</strong><p>Estimated from a small MIET project dataset. Confirm actual rent with the owner.</p></div>
        </motion.aside>
      </div>
    </section>
  );
}
