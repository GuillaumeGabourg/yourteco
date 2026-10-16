import { motion, useTransform, useReducedMotion, useMotionValue } from 'motion/react'

/* Yourte en coupe (moitié gauche : structure / moitié droite : finie), montée au fil du défilement :
   pilotis → plancher → treillis → porte → perches → couronne → Skydôme → toile murale → toile de toit
   → isolation → sol non imperméabilisé. progress : MotionValue 0..1 */

const CX = 300
const WALL = { l: 110, r: 490, t: 250, b: 340 }
const EAVE = { l: 94, r: 506, y: 248 }
const CROWN = { y: 146, rx: 46 }

const ROOF = `M${EAVE.l} ${EAVE.y}Q168 190 ${CX - CROWN.rx} ${CROWN.y}L${CX + CROWN.rx} ${CROWN.y}Q432 190 ${EAVE.r} ${EAVE.y}Z`

function lattice() {
  let d = ''
  for (let x = WALL.l - 90; x < CX + 10; x += 18) d += `M${x} ${WALL.b}L${x + 90} ${WALL.t}M${x} ${WALL.t}L${x + 90} ${WALL.b}`
  return d
}
function poles() {
  let d = ''
  for (let x = WALL.l; x <= CX - 8; x += 13) {
    const tx = CX + (x - CX) * 0.16
    d += `M${x} ${WALL.t - 1}L${tx} ${CROWN.y + 4}`
  }
  return d
}
function roofSeams() {
  let d = ''
  for (let x = CX + 18; x <= EAVE.r; x += 26) {
    const tx = CX + (x - CX) * 0.16
    d += `M${x} ${EAVE.y - 2}Q${(x + tx) / 2 + 6} ${(EAVE.y + CROWN.y) / 2 - 4} ${tx} ${CROWN.y + 2}`
  }
  return d
}
function grass() {
  let d = ''
  for (let x = 6; x < 600; x += 11) d += `M${x} 378q2 -7 5 -9M${x + 3} 378q-1 -5 -3 -7`
  return d
}

const seg = (p, a, b) => useTransform(p, [a, b], [0, 1], { clamp: true })

export default function YurtAssembly({ progress, step }) {
  const reduce = useReducedMotion()
  const done = useMotionValue(1)
  const P = reduce || !progress ? done : progress

  const piles = seg(P, 0.0, 0.08)
  const floor = seg(P, 0.04, 0.14)
  const lat = seg(P, 0.1, 0.26)
  const door = seg(P, 0.22, 0.3)
  const pol = seg(P, 0.26, 0.42)
  const crown = seg(P, 0.38, 0.46)
  const dome = seg(P, 0.44, 0.52)
  const wallCanvas = seg(P, 0.5, 0.6)
  const roofCanvas = seg(P, 0.56, 0.68)
  const iso = seg(P, 0.68, 0.8)
  const ground = seg(P, 0.82, 0.94)

  const pilesY = useTransform(piles, [0, 1], [26, 0])
  const floorX = useTransform(floor, [0, 1], [-40, 0])
  const crownY = useTransform(crown, [0, 1], [-40, 0])
  const domeS = useTransform(dome, [0, 1], [0.6, 1])
  const wallW = useTransform(wallCanvas, [0, 1], [0, WALL.r - CX + 2])
  const roofW = useTransform(roofCanvas, [0, 1], [0, EAVE.r - CX + 4])
  const lblPoles = useTransform(P, [0.36, 0.42], [0, 1], { clamp: true })
  const lblDome = useTransform(P, [0.5, 0.54], [0, 1], { clamp: true })
  const lblMem = useTransform(P, [0.64, 0.68], [0, 1], { clamp: true })
  const lblIso = useTransform(P, [0.76, 0.8], [0, 1], { clamp: true })
  const lblSol = useTransform(P, [0.9, 0.94], [0, 1], { clamp: true })

  return (
    <svg className="yurt-svg" viewBox="0 70 600 360" role="img" aria-label={`Yourte Yourteco en coupe, étape ${step} sur 4 du montage`}>
      <defs>
        <clipPath id="yt-left"><rect x="0" y="0" width={CX} height="430" /></clipPath>
        <clipPath id="yt-wall-r"><motion.rect x={CX - 1} y={WALL.t - 2} height={WALL.b - WALL.t + 4} width={wallW} /></clipPath>
        <clipPath id="yt-roof-r"><motion.rect x={CX - 2} y="60" height="200" width={roofW} /></clipPath>
        <clipPath id="yt-wall"><rect x={WALL.l} y={WALL.t} width={WALL.r - WALL.l} height={WALL.b - WALL.t} /></clipPath>
        <linearGradient id="yt-roof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4F8240" />
          <stop offset="1" stopColor="#2F5A2A" />
        </linearGradient>
        <linearGradient id="yt-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7DAE4F" />
          <stop offset="1" stopColor="#5E8E3A" />
        </linearGradient>
        <linearGradient id="yt-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E4F2F6" />
          <stop offset="1" stopColor="#A9CFDB" />
        </linearGradient>
        <pattern id="yt-felt" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="#E3D86A" />
          <circle cx="3" cy="3" r="1.1" fill="#C6B83C" />
        </pattern>
      </defs>

      {/* sol vivant : herbe, pas de dalle */}
      <motion.g style={{ opacity: ground }}>
        <rect x="0" y="376" width="600" height="54" fill="url(#yt-ground)" />
        <path d={grass()} className="y-grass" />
        {[150, 230, 370, 450].map((x, i) => (
          <path key={x} className="y-drop" style={{ animationDelay: `${i * 0.45}s` }} d={`M${x} 384c-3 5 -5 8 -5 10a5 5 0 0 0 10 0c0 -2 -2 -5 -5 -10z`} />
        ))}
      </motion.g>
      <line x1="0" y1="376" x2="600" y2="376" className="y-ground-line" />

      {/* pilotis */}
      <motion.g style={{ y: pilesY, opacity: piles }}>
        {[118, 178, 238, 298, 358, 418, 478].map((x) => <rect key={x} x={x} y="350" width="8" height="27" rx="1.5" className="y-wood-dark" />)}
      </motion.g>

      {/* plancher */}
      <motion.g style={{ x: floorX, opacity: floor }}>
        <rect x="90" y="339" width="420" height="13" rx="2" className="y-wood" />
        <path d="M90 345.5H510M150 339v13M226 339v13M302 339v13M378 339v13M454 339v13" className="y-wood-line" />
      </motion.g>

      {/* MOITIÉ GAUCHE : structure visible */}
      <g clipPath="url(#yt-left)">
        <motion.path d={ROOF} className="y-interior" style={{ opacity: pol }} />
        <rect x={WALL.l} y={WALL.t} width={CX - WALL.l} height={WALL.b - WALL.t} className="y-interior" />
        <g clipPath="url(#yt-wall)">
          <motion.path d={lattice()} className="y-lattice" style={{ pathLength: lat, opacity: lat }} />
        </g>
        <motion.path d={`M${WALL.l} ${WALL.t}H${CX}M${WALL.l} ${WALL.b - 1}H${CX}`} className="y-beam" style={{ pathLength: lat }} />
        <motion.path d={poles()} className="y-poles" style={{ pathLength: pol, opacity: pol }} />
        {/* isolation d'épaisseur bâtiment, visible dans la coupe */}
        <motion.g style={{ opacity: iso }}>
          <path d={`M${EAVE.l + 22} ${EAVE.y - 3}Q176 202 ${CX - CROWN.rx + 4} ${CROWN.y + 10}`} className="y-iso" />
          <path d={`M${WALL.l + 6} ${WALL.t + 2}V${WALL.b - 3}`} className="y-iso" />
        </motion.g>
        {/* bord de la coupe */}
        <motion.path d={`M${EAVE.l} ${EAVE.y}Q168 190 ${CX - CROWN.rx} ${CROWN.y}M${WALL.l} ${WALL.t}V${WALL.b}`} className="y-cut" style={{ pathLength: roofCanvas }} />
      </g>

      {/* MOITIÉ DROITE : finie (toile) */}
      <g clipPath="url(#yt-wall-r)">
        <rect x={CX} y={WALL.t} width={WALL.r - CX} height={WALL.b - WALL.t} className="y-canvas" />
        <path d="M324 250V340M348 250V340M372 250V340M396 250V340M420 250V340M444 250V340M468 250V340" className="y-canvas-seam" />
        <rect x="404" y="266" width="50" height="46" rx="3" className="y-wood" />
        <rect x="409" y="271" width="40" height="36" rx="1.5" fill="url(#yt-glass)" />
        <path d="M429 271V307M409 289H449" className="y-wood-line" />
      </g>
      <g clipPath="url(#yt-roof-r)">
        <path d={ROOF} fill="url(#yt-roof)" />
        <path d={roofSeams()} className="y-roof-seam" />
        <path d={`M${CX} ${EAVE.y + 1}H${EAVE.r + 2}`} className="y-eave" />
      </g>

      {/* porte bois vitrée (au centre, sur la coupe) */}
      <motion.g style={{ opacity: door }}>
        <rect x="272" y="268" width="56" height="72" rx="2" className="y-wood-dark" />
        <rect x="277" y="273" width="22" height="64" rx="1" className="y-wood" />
        <rect x="301" y="273" width="22" height="64" rx="1" className="y-wood" />
        <rect x="280" y="277" width="16" height="26" rx="1" fill="url(#yt-glass)" />
        <rect x="304" y="277" width="16" height="26" rx="1" fill="url(#yt-glass)" />
        <circle cx="297" cy="312" r="1.6" className="y-knob" />
      </motion.g>

      {/* couronne (toono) + Skydôme */}
      <motion.g style={{ y: crownY, opacity: crown }}>
        <ellipse cx={CX} cy={CROWN.y} rx={CROWN.rx} ry="8" className="y-wood" />
        <ellipse cx={CX} cy={CROWN.y - 1} rx={CROWN.rx - 8} ry="4.5" className="y-crown-in" />
      </motion.g>
      <motion.g style={{ scale: domeS, opacity: dome, transformOrigin: `${CX}px ${CROWN.y}px` }}>
        <path d={`M${CX - CROWN.rx + 2} ${CROWN.y - 2}Q${CX} ${CROWN.y - 54} ${CX + CROWN.rx - 2} ${CROWN.y - 2}Z`} fill="url(#yt-glass)" className="y-dome" />
        <path d={`M${CX - 24} ${CROWN.y - 14}Q${CX - 14} ${CROWN.y - 32} ${CX + 2} ${CROWN.y - 34}`} className="y-shine" />
      </motion.g>

      {/* repères */}
      <motion.g style={{ opacity: lblPoles }}>
        <path d="M180 214L120 176H40" className="y-lead" />
        <text x="40" y="168" className="y-label">Charpente bois du Nord</text>
      </motion.g>
      <motion.g style={{ opacity: lblDome }}>
        <path d={`M${CX + 30} ${CROWN.y - 24}L392 100H452`} className="y-lead" />
        <text x="398" y="92" className="y-label">Skydôme</text>
      </motion.g>
      <motion.g style={{ opacity: lblMem }}>
        <path d="M452 214L512 178H560" className="y-lead" />
        <text x="470" y="170" className="y-label">Membrane 40 ans</text>
      </motion.g>
      <motion.g style={{ opacity: lblIso }}>
        <path d={`M${WALL.l + 6} 268H98`} className="y-lead" />
        <text x="94" y="262" textAnchor="end" className="y-label">Isolation</text>
        <text x="94" y="279" textAnchor="end" className="y-label">jusqu'à 30 cm</text>
      </motion.g>
      <motion.g style={{ opacity: lblSol }}>
        <text x="300" y="414" textAnchor="middle" className="y-label y-label-light">Sol non imperméabilisé</text>
      </motion.g>
    </svg>
  )
}
