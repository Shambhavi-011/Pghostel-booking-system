import React, { useEffect, useRef } from 'react';
import Icon from './Icon';
import { money } from '../data';

export default function StayDialog({ stay, close, saved, toggleSave }) {
  const dialog = useRef(null);
  useEffect(() => {
    const element = dialog.current;
    const previous = document.activeElement;
    element.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { element.close(); document.body.style.overflow = previousOverflow; previous?.focus(); };
  }, []);
  return <dialog ref={dialog} className="stay-dialog" aria-labelledby="stay-dialog-title" onCancel={close} onClick={(event) => { if (event.target === dialog.current) close(); }}>
    <button className="dialog-close icon-button" aria-label="Close property details" onClick={close}><Icon name="close" /></button>
    <img src={`/images/${stay.image}`} alt="Illustrative room interior" />
    <div className="dialog-body"><span className="eyebrow">PROJECT CATALOG · MIET AREA</span><h2 id="stay-dialog-title">{stay.name}</h2><p>{stay.tagline}</p>
      <div className="dialog-facts"><span><Icon name="pin" />{stay.distance} km from MIET</span><span><Icon name="bed" />{stay.sharing} person sharing</span><span><Icon name="snow" />{stay.ac ? 'AC room' : 'Non-AC room'}</span></div>
      <strong className="dialog-price">{money(stay.rent)}<small> / month</small></strong>
      <p className="catalog-notice">This record comes from the project dataset. The photo is illustrative. Availability, owner contact, exact location and whether rent is per bed or room still need confirmation.</p>
      <button className="primary-button" onClick={() => toggleSave(stay.id)}><Icon name="heart" />{saved ? 'Remove from saved' : 'Save this stay'}</button>
    </div>
  </dialog>;
}
