const P = {
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />,
  arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
  out: <><path d="M7 17 17 7" /><path d="M8 7h9v9" /></>,
  menu: <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h10" /></>,
  close: <><path d="M6 6l12 12" /><path d="M18 6 6 18" /></>,
  play: <path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m3 7 9 6 9-6" /></>,
  pin: <><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  pause: <><path d="M9 6v12" /><path d="M15 6v12" /></>,
  facebook: <path d="M14 8h3V4.5h-3c-2.5 0-4 1.7-4 4.2V11H7.5v3.5H10V21h3.6v-6.5h3l.5-3.5h-3.5V9c0-.6.4-1 .9-1z" fill="currentColor" stroke="none" />,
  youtube: <><rect x="2.5" y="5.5" width="19" height="13" rx="3.5" /><path d="M10 9.2v5.6l5-2.8z" fill="currentColor" stroke="none" /></>,
  pinterest: <><circle cx="12" cy="12" r="9" /><path d="M10.5 20.5 12.2 13" /><path d="M10 13.5c-.6-.8-.8-1.6-.6-2.6.4-2 2-3 3.6-2.8 1.9.2 2.8 1.8 2.4 3.6-.4 2-1.6 3-2.9 2.8-1-.2-1.3-1-1.1-1.8" /></>,
  leaf: <><path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14z" /><path d="M5 19 13 11" /></>,
  sprout: <><path d="M12 20v-8" /><path d="M12 12c0-3.5-2.5-6-7-6 0 3.5 2.5 6 7 6z" /><path d="M12 14c0-3 2.2-5.5 7-5.5 0 3-2.2 5.5-7 5.5z" /></>,
  shield: <><path d="M12 3 5 6v5.5c0 4.4 3 8 7 9.5 4-1.5 7-5.1 7-9.5V6z" /><path d="m9 12 2.2 2.2L15.5 10" /></>,
  compass: <><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5z" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" /></>,
  home: <><path d="M3.5 11 12 4l8.5 7" /><path d="M6 9.5V20h12V9.5" /><path d="M10 20v-5h4v5" /></>,
  image: <><rect x="3" y="4.5" width="18" height="15" rx="2.5" /><circle cx="9" cy="10" r="1.8" /><path d="m4 18 5-5 3.5 3.5L15 14l5 4.5" /></>,
  calendar: <><rect x="3.5" y="5" width="17" height="15" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>,
  layers: <><path d="m12 4 9 4.5-9 4.5-9-4.5z" /><path d="m3 13 9 4.5 9-4.5" /></>,
  drop: <path d="M12 3.5s-6 6.6-6 11a6 6 0 0 0 12 0c0-4.4-6-11-6-11z" />,
  tent: <><path d="M3 19 12 5l9 14z" /><path d="M12 5v14" /><path d="m9.5 19 2.5-5 2.5 5" /></>,
  doc: <><path d="M6.5 3.5h7l4 4V20.5h-11z" /><path d="M13.5 3.5v4h4" /><path d="M9 12h6M9 15.5h6" /></>,
  tag: <><path d="M3.5 12.5V4.5h8l9 9-8 8z" /><circle cx="8" cy="9" r="1.6" /></>,
  chevron: <path d="m7 10 5 5 5-5" />,
  search: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.5 4.5" /></>,
  moon: <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z" />,
  tree: <><path d="M12 21v-6" /><path d="M12 3 6 11h3l-4 5h14l-4-5h3z" /></>,
  hammer: <><path d="m14 6 4 4" /><path d="M13 7 4.5 15.5a1.8 1.8 0 0 0 2.5 2.5L15.5 9.5" /><path d="m12 4 3-1 6 6-1 3z" /></>,
  hand: <><path d="M7 12V6.5a1.5 1.5 0 0 1 3 0V11" /><path d="M10 10V4.5a1.5 1.5 0 0 1 3 0V11" /><path d="M13 10.5V6a1.5 1.5 0 0 1 3 0v5" /><path d="M16 9.5a1.5 1.5 0 0 1 3 0V14a7 7 0 0 1-7 7h-.5A6.5 6.5 0 0 1 6 18l-2.6-4.4a1.5 1.5 0 0 1 2.6-1.5L7 13.5" /></>,
  instagram: <><rect x="3.5" y="3.5" width="17" height="17" rx="4.5" /><circle cx="12" cy="12" r="3.8" /><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" /></>,
}

export default function Icon({ name, size = 20, className, title }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : 'true'}
      role={title ? 'img' : undefined}
    >
      {title && <title>{title}</title>}
      {P[name]}
    </svg>
  )
}
