import { motion, useTransform, useReducedMotion, useMotionValue } from 'motion/react'

/* Élévation de yourte, montée au fil du défilement :
   plancher → treillis → perches → couronne/Skydôme → toile → isolation → sol non imperméabilisé.
   progress : MotionValue 0..1 */

const WALL_L = 120, WALL_R = 480, WALL_T = 250, WALL_B = 340
const CROWN_Y = 146, CX = 300

function latticePath() {
  let d = ''
  for (let x = WALL_L - 90; x < WALL_R; x += 22) {
    d += `M${x} ${WALL_B}L${x + 90} ${WALL_T}`
    d += `M${x} ${WALL_T}L${x + 90} ${WALL_B}`
  }
  return d
}
function polesPath() {
  let d = ''
  for (let x = WALL_L; x <= WALL_R; x += 20) {
    const tx = CX + (x - CX) * 0.14
    d += `M${x} ${WALL_T}L${tx} ${CROWN_Y}`
  }
  return d
}
function pilesPath() {
  let d = ''
  for (let x = 118; x <= 482; x += 52) d += `M${x} 354L${x} 380`
  return d
}
function grassPath() {
  let d = 'M40 380L560 380'
  for (let x = 48; x < 560; x += 17) d += `M${x} 380l4 -7`
  return d
}

const seg = (p, a, b) => useTransform(p, [a, b], [0, 1], { clamp: true })

export default function YurtAssembly({ progress, step }) {
  const reduce = useReducedMotion()
  const done = useMotionValue(1)
  const P = reduce || !progress ? done : progress

  const floor = seg(P, 0.0, 0.12)
  const lattice = seg(P, 0.08, 0.26)
  const door = seg(P, 0.2, 0.28)
  const poles = seg(P, 0.24, 0.42)
  const crown = seg(P, 0.38, 0.48)
  const dome = seg(P, 0.44, 0.54)
  const toile = seg(P, 0.5, 0.62)
  const toileFill = useTransform(P, [0.55, 0.66], [0, 1], { clamp: true })
  const iso = seg(P, 0.64, 0.78)
  const ground = seg(P, 0.8, 0.94)

  const draw = (v) => ({ pathLength: v, opacity: useTransform(v, [0, 0.02], [0, 1]) })

  return (
    <svg className="yurt-svg" viewBox="20 80 560 340" role="img" aria-label={`Élévation d'une yourte Yourteco, étape ${step} sur 4 du montage`}>
      <defs>
        <clipPath id="wallClip"><rect x={WALL_L} y={WALL_T} width={WALL_R - WALL_L} height={WALL_B - WALL_T} /></clipPath>
      </defs>

      {/* sol + pilotis : posé sans imperméabilisation */}
      <motion.path d={grassPath()} className="y-ground" style={draw(ground)} />
      <motion.path d={pilesPath()} className="y-piles" style={draw(ground)} />

      {/* plancher */}
      <motion.path d="M100 342H500V354H100Z M100 348H500" className="y-floor" style={draw(floor)} />

      {/* toile (remplissage derrière la structure) */}
      <motion.path
        d={`M104 258L${CX - 44} ${CROWN_Y + 2}L${CX + 44} ${CROWN_Y + 2}L496 258L496 342L104 342Z`}
        className="y-toile-fill"
        style={{ opacity: toileFill }}
      />

      {/* treillis (khana) */}
      <g clipPath="url(#wallClip)">
        <motion.path d={latticePath()} className="y-lattice" style={draw(lattice)} />
      </g>
      <motion.path d={`M${WALL_L} ${WALL_T}H${WALL_R}M${WALL_L} ${WALL_B}H${WALL_R}`} className="y-beam" style={draw(lattice)} />

      {/* porte */}
      <motion.path d="M276 342V272H324V342M276 272H324" className="y-door" style={draw(door)} />

      {/* perches */}
      <motion.path d={polesPath()} className="y-poles" style={draw(poles)} />

      {/* couronne + Skydôme */}
      <motion.ellipse cx={CX} cy={CROWN_Y} rx="44" ry="8" className="y-crown" style={draw(crown)} />
      <motion.path d={`M${CX - 40} ${CROWN_Y - 4}Q${CX} ${CROWN_Y - 46} ${CX + 40} ${CROWN_Y - 4}`} className="y-dome" style={draw(dome)} />

      {/* toile (contour) */}
      <motion.path
        d={`M104 258L${CX - 44} ${CROWN_Y + 2}M${CX + 44} ${CROWN_Y + 2}L496 258L496 342M104 258L104 342`}
        className="y-toile"
        style={draw(toile)}
      />

      {/* isolation d'épaisseur bâtiment */}
      <motion.path
        d={`M128 256L${CX - 40} ${CROWN_Y + 12}M${CX + 40} ${CROWN_Y + 12}L472 256L472 336M128 256L128 336`}
        className="y-iso"
        style={draw(iso)}
      />

      {/* repères */}
      <motion.g style={{ opacity: useTransform(P, [0.46, 0.54], [0, 1], { clamp: true }) }}>
        <path d={`M${CX + 42} ${CROWN_Y - 30}L398 104H452`} className="y-lead" />
        <text x="404" y="98" className="y-label">Skydôme</text>
      </motion.g>
      <motion.g style={{ opacity: useTransform(P, [0.58, 0.64], [0, 1], { clamp: true }) }}>
        <path d="M440 232L500 196H548" className="y-lead" />
        <text x="504" y="190" className="y-label">Membrane 40 ans</text>
      </motion.g>
      <motion.g style={{ opacity: useTransform(P, [0.72, 0.78], [0, 1], { clamp: true }) }}>
        <path d="M128 318H66V390" className="y-lead" />
        <text x="30" y="406" className="y-label">Isolation jusqu'à 30 cm</text>
      </motion.g>
      <motion.g style={{ opacity: useTransform(P, [0.9, 0.96], [0, 1], { clamp: true }) }}>
        <text x="384" y="406" className="y-label">Sol non imperméabilisé</text>
      </motion.g>
    </svg>
  )
}
