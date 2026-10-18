import { useState } from 'react'
import { asset } from '../lib/asset.js'
import { COLORS, DEFAULT_ROOF, DEFAULT_WALL } from '../content/couleurs.js'

const nameOf = (id) => COLORS.find((c) => c.id === id)?.name

function Swatches({ label, kind, value, onChange }) {
  return (
    <fieldset className="cp-swatches">
      <legend><span className="cp-swatches-l">{label}</span> <span className="cp-swatches-v">{nameOf(value)}</span></legend>
      <div className="cp-swatch-list">
        {COLORS.map((c) => (
          <button
            key={c.id} type="button" className="cp-swatch" aria-pressed={value === c.id} aria-label={`${label} : ${c.name}`} title={c.name}
            style={{ backgroundImage: `url(${asset(`/img/couleurs/${kind}-pattern/${c.id}.webp`)})` }}
            onClick={() => onChange(c.id)}
          />
        ))}
      </div>
    </fieldset>
  )
}

/** Sélecteur de coloris de la toile : une yourte dont le toit et les murs changent de couleur. */
export default function ColorPicker() {
  const [roof, setRoof] = useState(DEFAULT_ROOF)
  const [wall, setWall] = useState(DEFAULT_WALL)
  return (
    <div className="cp-colors">
      <div className="cp-colors-view" role="img" aria-label={`Yourte avec un toit ${nameOf(roof)} et des murs ${nameOf(wall)}`}>
        <img className="cp-colors-wall" src={asset(`/img/couleurs/wall/${wall}.webp`)} alt="" width="515" height="174" decoding="async" />
        <img className="cp-colors-roof" src={asset(`/img/couleurs/roof/${roof}.webp`)} alt="" width="515" height="144" decoding="async" />
      </div>
      <div className="cp-colors-pick">
        <Swatches label="Toits" kind="roof" value={roof} onChange={setRoof} />
        <Swatches label="Murs" kind="wall" value={wall} onChange={setWall} />
      </div>
    </div>
  )
}
