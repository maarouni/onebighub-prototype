// One icon set for the whole site, following Cesar's "Legend Icons" page
// (Figma, Info section, Rev 261012). Every icon has a name and a tooltip
// label; the Info → Legend Icons page renders this list, so adding an icon
// here documents it automatically.
//
// <Glyph name="cart" />                 → bare SVG
// <IconButton name="cart" onClick=... /> → button with hover tooltip

const P = {
  // ---- Header ----
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6" /><path d="M12 7.5h.01" /></>,
  // Oct 15 Figma: header Dashboards icon is a bar chart in a box.
  dashboards: <><rect x="3" y="3" width="18" height="18" rx="2.5" /><path d="M8 16v-4M12 16V8M16 16v-6" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" /></>,
  pdf: <><path d="M12 3v12" /><path d="M7 10l5 5 5-5" /><path d="M4 19h16" /></>,
  print: <><path d="M6 9V3h12v6" /><rect x="3" y="9" width="18" height="8" rx="2" /><path d="M6 14h12v7H6z" /></>,
  eyeView: <><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
  plusBold: <><path d="M12 4v16M4 12h16" strokeWidth="3" /></>,
  login: <><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><path d="M10 17l5-5-5-5" /><path d="M15 12H3" /></>,
  barter: <><path d="M4 8h14l-3-3" /><path d="M20 16H6l3 3" /></>,
  register: <><circle cx="10" cy="8" r="4" /><path d="M2 21c0-4 3.6-7 8-7s8 3 8 7" /><path d="M19 8v6M16 11h6" /></>,
  user: <><circle cx="12" cy="12" r="9.5" /><text x="12" y="16.2" textAnchor="middle" fontSize="11" fontWeight="700" fill="currentColor" stroke="none">M</text></>,
  // ---- Actions ----
  search: <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" /></>,
  prev: <path d="M15 6l-6 6 6 6" />,
  next: <path d="M9 6l6 6-6 6" />,
  collapse: <path d="M6 15l6-6 6 6" />,
  expand: <path d="M6 9l6 6 6-6" />,
  public: <><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>,
  private: <><path d="M9.9 5.2A10 10 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-2.4 3.3M6.6 6.6C3.7 8.4 2 12 2 12s3.6 7 10 7a9.7 9.7 0 0 0 5.4-1.6" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /><path d="M3 3l18 18" /></>,
  select: <path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9L12 3Z" />,
  gcal: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /><path d="M12 13v5M9.5 15.5h5" /></>,
  calculate: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M8 7h8" /><path d="M8 11h.01M12 11h.01M16 11h.01M8 14.5h.01M12 14.5h.01M16 14.5h.01M8 18h.01M12 18h4" /></>,
  gallery: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="M21 16l-5-5-9 9" /></>,
  comments: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10Z" />,
  like: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 1 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8Z" />,
  thumbUp: <><path d="M7 10v11H3V10z" /><path d="M7 10l4-7a2 2 0 0 1 3 2l-1 5h6a2 2 0 0 1 2 2.3l-1.2 7A2 2 0 0 1 17.8 21H7" /></>,
  share: <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" /></>,
  viewMode: <><path d="M4 4h12l4 4v12H4z" /><path d="M8 12h8M8 16h5" /></>,
  editMode: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" /></>,
  addNew: <><circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" /></>,
  cart: <><circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /><path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 7H6" /></>,
  cartAdd: <><circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /><path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 7H6" /><path d="M14 8.5v5M11.5 11h5" /></>,
  delete: <><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M6 6l1 14h10l1-14" /><path d="M10 11v6M14 11v6" /></>,
  xMark: <path d="M6 6l12 12M18 6 6 18" />,
  clearAll: <><circle cx="12" cy="12" r="9" /><path d="M15 9l-6 6M9 9l6 6" /></>,
  ticket: <><path d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4V8Z" /><path d="M13 6v12" strokeDasharray="2 2" /></>,
  map: <><path d="M9 4l-6 2v14l6-2 6 2 6-2V4l-6 2-6-2Z" /><path d="M9 4v14M15 6v14" /></>,
  qr: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><path d="M14 14h3v3M21 14v.01M17 21h4v-4M14 18v3" /></>,
  // ---- Listings / images ----
  expo: <><circle cx="8" cy="8" r="3" /><circle cx="16" cy="8" r="3" /><path d="M2 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /><path d="M14 14.3A6 6 0 0 1 22 20" /></>,
  dinner: <><path d="M7 3v8a2 2 0 0 0 2 2v8" /><path d="M5 3v6M9 3v6" /><path d="M17 21V3c-2 0-3 3-3 7h3" /></>,
  workshop: <><rect x="3" y="4" width="18" height="12" rx="1.5" /><path d="M12 16v4M8 20h8" /><path d="M7 12l3-3 2 2 4-4" /></>,
  logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></>,
  email: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>,
  verifyEmail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /><path d="M14.5 17.5l2 2 4-4" /></>,
  miniCard: <><rect x="2" y="5" width="20" height="14" rx="2" /><circle cx="8" cy="11" r="2.2" /><path d="M5 16c.6-1.6 1.7-2.4 3-2.4s2.4.8 3 2.4" /><path d="M14 10h5M14 13h4" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2.5" /><path d="M3 10h18" /><path d="M8 3v4M16 3v4" /></>,
  discount: <><circle cx="8" cy="8" r="2.5" /><circle cx="16" cy="16" r="2.5" /><path d="M17 7 7 17" /></>,
  connections: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18" /></>,
  products: <><path d="M12 2.5l8.5 4.75v9.5L12 21.5l-8.5-4.75v-9.5Z" /><path d="M3.5 7.25 12 12l8.5-4.75M12 12v9.5" /></>,
  service: <><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4Z" /></>,
  membership: <><rect x="2.5" y="5" width="19" height="14" rx="2" /><path d="M2.5 9.5h19" /><circle cx="8" cy="14" r="2" /><path d="M13 13h5M13 16h3" /></>,
  // Nov 6 — Info list icons (everyCircle style)
  document: <><path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8l-5-5Z" /><path d="M14 3v5h5" /><path d="M9 13h6M9 17h6" /></>,
  shield: <><path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6l-8-3Z" /><path d="M12 8v5" /><path d="M12 16h.01" /></>,
  contactCard: <><rect x="2.5" y="5" width="19" height="14" rx="2" /><circle cx="8.5" cy="11" r="2" /><path d="M5.5 16c.5-1.6 1.6-2.4 3-2.4s2.5.8 3 2.4" /><path d="M14 10h4.5M14 13.5h4.5" /></>,
  smiley: <><circle cx="12" cy="12" r="9" /><path d="M8.5 14.5c1.9 2 5.1 2 7 0" /><path d="M9 9.5h.01M15 9.5h.01" /></>,
  connectMe: <><rect x="3" y="4" width="18" height="16" rx="3" /><path d="M7 10h9l-2.5-2.5" /><path d="M17 14H8l2.5 2.5" /></>,
  megaphone: <><path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1Z" /><path d="M15 9a4 4 0 0 1 0 6M18 6a8 8 0 0 1 0 12" /></>,
  organizations: <><path d="M12 3 3 20h18L12 3Z" /><path d="M7.6 12h8.8M5.4 16h13.2" /></>,
  employment: <><rect x="3" y="8" width="18" height="12" rx="2" /><path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M3 13h18" /></>,
  notifications: <><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9Z" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></>,
  // Nov 9 Index icons (Cesar's Figma "Icons / Images")
  idxProduct: <><path d="M12 2.5 21 7v10l-9 4.5L3 17V7z" /><path d="M3 7l9 4.5L21 7M12 11.5V21.5" /></>,
  idxProductEdit: <><path d="M12 2.5 21 7v10l-9 4.5L3 17V7z" fill="currentColor" /><path d="M3 7l9 4.5L21 7M12 11.5V21.5" stroke="#fff" /></>,
  idxService: <><circle cx="9" cy="9" r="3" /><path d="M9 3v2M9 13v2M3 9h2M13 9h2M4.8 4.8l1.4 1.4M11.8 11.8l1.4 1.4M4.8 13.2l1.4-1.4M11.8 6.2l1.4-1.4" /><circle cx="17" cy="16" r="2.2" /><path d="M17 12v1.5M17 18.5V20M13 16h1.5M19.5 16H21" /></>,
  idxClassified: <><rect x="3" y="4" width="13" height="16" rx="1.5" /><path d="M6 8h4M6 11h7M6 14h7M6 17h5" /><circle cx="17.5" cy="7.5" r="3" /><path d="M19.6 9.6 22 12" /></>,
  idxMembership: <><rect x="2.5" y="5" width="19" height="14" rx="2" /><path d="M8 9.2l.9 1.8 2 .3-1.5 1.4.4 2-1.8-1-1.8 1 .4-2-1.5-1.4 2-.3z" /><path d="M14 10h4M14 13h4" /></>,
  idxSubscription: <><circle cx="9" cy="8" r="4" /><path d="M2 21a7 7 0 0 1 14 0" /><path d="M19 8v6M16 11h6" /></>,
  idxSurvey: <><rect x="4" y="4" width="13" height="17" rx="2" /><path d="M8 3h5v3H8z" /><path d="M7 10h7M7 13h7M7 16h4" /><path d="M20.5 12.5 15 18l-1.5.5.5-1.5 5.5-5.5z" /></>,
  idxAnnounce: <><path d="M3 10v4h3l7 4V6L6 10z" /><path d="M6 14l1.5 5h2.5l-1.3-4" /><path d="M17 9.5a3.5 3.5 0 0 1 0 5M19.5 5l1-1.5M20 9h1.8M19.5 13.5l1 1" /></>,
  idxMenu: <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2.4" />,
  idxStore: <><path d="M3 9.5 5 4h14l2 5.5" /><path d="M3 9.5c0 1.4 1.1 2.5 2.5 2.5S8 10.9 8 9.5c0 1.4 1.1 2.5 2.5 2.5S13 10.9 13 9.5c0 1.4 1.1 2.5 2.5 2.5S18 10.9 18 9.5c0 1.4 1.1 2.5 1.5 2.5" /><path d="M5 12v8h14v-8M10 20v-5h4v5" /></>,
  idxPhone: <><path d="M4 4.5c0 8.3 6.7 15 15 15l1.5-3.5-4-2-2 2c-2.5-1-4.5-3-5.5-5.5l2-2-2-4z" fill="currentColor" /><path d="M14 3h7v5h-3l-2 2V8h-2z" fill="currentColor" /></>,
  idxScale: <><path d="M12 3v17M7 20h10M5 6h14" /><path d="M5 6 2.5 12a2.5 2.5 0 0 0 5 0zM19 6l-2.5 6a2.5 2.5 0 0 0 5 0z" /></>,
  idxTerms: <><path d="M6 3h9l4 4v14H6z" /><path d="M9 9h7M9 12h7M9 15h4" /><path d="M14.5 18.5l1.5 1.5 3-3" /></>,
  idxPrivacy: <><path d="M12 2.5 20 5.5v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10v-6z" /><rect x="9" y="11" width="6" height="5" rx="1" /><path d="M10 11V9.5a2 2 0 0 1 4 0V11" /></>,
  idxShield: <><path d="M12 2.5 20 5.5v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10v-6z" /><path d="M8.5 12l2.5 2.5 4.5-5" /></>,
  idxGlobe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
  idxPerson: <><circle cx="12" cy="12" r="9.5" /><circle cx="12" cy="10" r="3.2" /><path d="M6 18.5a7 7 0 0 1 12 0" /></>,
  idxBell: <><path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z" /><path d="M10 20a2 2 0 0 0 4 0" /></>,
  idxBellFill: <><path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z" fill="currentColor" /><path d="M10 20a2 2 0 0 0 4 0" /></>,
  idxBriefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5h6v2M3 12h18" /><rect x="10.5" y="11" width="3" height="3" /></>,
  idxBriefcaseFill: <><rect x="3" y="7" width="18" height="13" rx="2" fill="currentColor" /><path d="M9 7V5h6v2" /><path d="M3 12h18" stroke="#fff" /></>,
  idxDeal: <><path d="M12 2.5l2.2 1.6 2.7-.2.9 2.6 2.3 1.4-.6 2.7 1 2.5-2.1 1.7-.2 2.7-2.7.4-1.8 2-2.4-1.3-2.4 1.3-1.8-2-2.7-.4-.2-2.7-2.1-1.7 1-2.5-.6-2.7 2.3-1.4.9-2.6 2.7.2z" /><path d="M9 15l6-6" /><circle cx="9.5" cy="9.5" r="1" /><circle cx="14.5" cy="14.5" r="1" /></>,
  idxDealFill: <><path d="M12 2.5l2.2 1.6 2.7-.2.9 2.6 2.3 1.4-.6 2.7 1 2.5-2.1 1.7-.2 2.7-2.7.4-1.8 2-2.4-1.3-2.4 1.3-1.8-2-2.7-.4-.2-2.7-2.1-1.7 1-2.5-.6-2.7 2.3-1.4.9-2.6 2.7.2z" fill="currentColor" /><path d="M9 15l6-6" stroke="#fff" /></>,
  idxPrevNext: <><circle cx="7" cy="12" r="5" /><path d="M8 9.5 5.5 12 8 14.5" /><circle cx="17" cy="12" r="5" /><path d="M16 9.5 18.5 12 16 14.5" /></>,
  idxCollapse: <><circle cx="7" cy="12" r="5" /><path d="M4.5 13 7 10.5 9.5 13" /><circle cx="17" cy="12" r="5" /><path d="M14.5 11 17 13.5 19.5 11" /></>,
  idxHide: <><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /><path d="M3 3l18 18" /></>,
  idxAddDigest: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M6 4h12M8 1.5h8" /><path d="M10 11l5 2.5-5 2.5z" /></>,
  idxSparkle: <><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z" /><path d="M19 15l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7zM5 15l.6 1.6 1.6.6-1.6.6L5 19.4l-.6-1.6-1.6-.6 1.6-.6z" /></>,
  idxBarterOk: <><circle cx="12" cy="12" r="9.5" /><path d="M7 10h9l-2.5-2.5M17 14H8l2.5 2.5" /></>,
  idxAssign: <><circle cx="6" cy="5" r="2" /><path d="M3 11a3 3 0 0 1 6 0" /><circle cx="17" cy="14" r="2.5" fill="currentColor" /><path d="M13 21a4 4 0 0 1 8 0" fill="currentColor" /><path d="M6 13v4h7M15 5h4v4" /></>,
  idxSigns: <><path d="M12 2v20M7 21h10" /><path d="M5 5h11l2 2-2 2H5zM19 11H8l-2 2 2 2h11z" /></>,
  idxReturn: <><circle cx="12" cy="12" r="9.5" /><path d="M16.5 12h-9M11 8l-4 4 4 4" /></>,
  idxIntro: <><circle cx="12" cy="5" r="2" /><path d="M9.5 10a2.5 2.5 0 0 1 5 0" /><circle cx="5" cy="15" r="2" /><path d="M2.5 20a2.5 2.5 0 0 1 5 0" /><circle cx="19" cy="15" r="2" /><path d="M16.5 20a2.5 2.5 0 0 1 5 0M8 18h8M9 11l-3 2M15 11l3 2" /></>,
  idxPrivateLabel: <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 16l1-3.5 6-6 2.5 2.5-6 6zM7 18h10" /></>,
  idxSwitch: <><rect x="2" y="7" width="20" height="10" rx="5" fill="currentColor" /><circle cx="16.5" cy="12" r="3.3" fill="#fff" stroke="none" /></>,
  idxListings: <path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01" strokeWidth="2.4" />,
  idxDigestImg: <><path d="M4 21V10l8-6 8 6v11z" /><path d="M4 10l8 5 8-5" /><path d="M9 6V3h6v3" /></>,
  idxTarget: <><circle cx="12" cy="12" r="9.5" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2.5" /><path d="M14 10l6-6M17 4h3v3" /></>,
  idxHome: <><path d="M3 11 12 3l9 8" /><path d="M5 10v10h14V10M10 20v-5h4v5" /></>,
  idxSmile: <><circle cx="12" cy="12" r="9.5" /><path d="M8 14a5 5 0 0 0 8 0M9 9.5h.01M15 9.5h.01" /></>,
  idxSad: <><circle cx="12" cy="12" r="9.5" /><path d="M8 16.5a5 5 0 0 1 8 0M9 9.5h.01M15 9.5h.01" /></>,
  idxHeart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 1 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />,
  idxMiniCard: <><circle cx="12" cy="12" r="9.5" /><circle cx="12" cy="10" r="3.2" fill="currentColor" /><path d="M6 18.5a7 7 0 0 1 12 0" fill="currentColor" /></>,
  idxBank: <><path d="M3 9 12 4l9 5H3zM5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18" /></>,
  idxReceipt: <><rect x="3" y="4" width="18" height="16" rx="1.5" /><circle cx="7.5" cy="9" r="1.5" /><circle cx="7.5" cy="15" r="1.5" /><path d="M11 9h7M11 15h7" /></>,
  idxTransact: <><path d="M20 12a8 8 0 1 1-2.4-5.7L20 8.5M20 4v4.5h-4.5" /><path d="M12 8v8M14 9.5h-3a1.5 1.5 0 0 0 0 3h2a1.5 1.5 0 0 1 0 3h-3" /></>,
  idxAttendees: <><circle cx="8" cy="7" r="2" /><circle cx="16" cy="7" r="2" /><circle cx="12" cy="12" r="2" /><path d="M4 13a4 4 0 0 1 6 0M14 13a4 4 0 0 1 6 0M8 19a4 4 0 0 1 8 0" /></>,
  idxCollateral: <><path d="M4 18 14 6l4 4L8 20z" /><path d="M15 4l1-2M19 6l2-1M18 2l.5 2" /><path d="M4 18l2 3h2" /></>,
  idxMessages: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><path d="M7 8h10M7 12h7" /></>,
};

// Legend groups, labels exactly as Cesar's Legend Icons page names them.
export const LEGEND = [
  {
    group: "Header",
    items: [
      ["info", "Info"], ["dashboards", "Dashboards"], ["settings", "Settings"],
      ["pdf", "Download this page as a PDF"], ["print", "Print this page"],
      ["login", "Registration – Sign Up / Log In"], ["register", "Registration – Sign Up"], ["user", "Logged In – User's First Name Initial"]
    ],
  },
  {
    group: "Actions",
    items: [
      ["search", "SEARCH"], ["prev", "Previous"], ["next", "Next"], ["collapse", "Collapse"], ["expand", "View / Expand"],
      ["public", "Display, Public"], ["private", "Hide, Private"],
      ["select", "Add listing(s) to My Selection"], ["gcal", "Add event(s) to My Google Calendar"],
      ["calculate", "Calculate"], ["gallery", "Gallery"], ["comments", "Comments"], ["like", "Like"], ["share", "Share"],
      ["viewMode", "View Mode"], ["editMode", "Edit Mode"], ["addNew", "Add New"],
      ["ticket", "RSVP / Order Tickets"], ["delete", "Delete"],
      ["pdf", "Download this page as a PDF"], ["print", "Print this page"], ["clearAll", "Clear All"],
      ["map", "Google Map"], ["qr", "QR Code"], ["barter", "Barter – no payment, not tracked"],
    ],
  },
  {
    group: "Sections",
    items: [
      ["calendar", "One Big Calendar"], ["discount", "Discount / Gift Certificates"], ["connections", "Connections"],
      ["employment", "Employment Listings"], ["notifications", "Notifications"],
    ],
  },
  {
    group: "Images",
    items: [
      ["expo", "Networking Expos / Mixers"], ["dinner", "Networking Dinners"], ["workshop", "Seminars / Workshops"],
      ["logout", "Registration Log Out"], ["email", "Registration Sign Up Email"],
      ["miniCard", "Mini-Cards"], ["verifyEmail", "Verify Email"],
    ],
  },
];

// Oct 30 (Cesar's Figma Rev 261030): these icons are Cesar's own artwork from the
// Figma file, not hand-drawn. Anything listed here renders his image instead of an SVG.
// Icon names the site already used (info, print, login, ...) now point at his versions.
const FIG = {
  info: "info", dashboards: "dashboards", settings: "gear", pdf: "download", print: "print", login: "login",
  figDigest: "digest", figEdit: "edit", figConnDigest: "connections-digest", figViewProfile: "view-profile", figEditProfile: "edit-profile",
  pagePrev: "prev", pageNext: "next", clearX: "clear-x", figConnect: "connect", figBack: "back",
  typeIndividual: "type-individual", typeBiz: "type-biz", typeOrg: "type-org", typeGroup: "type-group",
  organizations: "type-org", dinner: "ev-dinner", workshop: "ev-workshop", expo: "ev-expo",
};
const FIG_WIDE = { expo: true };   // 2:1 photo, not square

export const ICON_LABEL = Object.fromEntries(LEGEND.flatMap((g) => g.items.map(([k, l]) => [k, l])));

export function Glyph({ name, size = 18, strokeWidth = 1.8, className = "" }) {
  if (FIG[name]) {
    return (
      <img className={`glyph glyph-fig ${className}`} src={`/icons/fig/${FIG[name]}.png`} alt=""
        width={size} height={FIG_WIDE[name] ? undefined : size} style={FIG_WIDE[name] ? { width: size, height: "auto" } : undefined} />
    );
  }
  const p = P[name];
  if (!p) return null;
  return (
    <svg className={`glyph ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {p}
    </svg>
  );
}

export function IconButton({ name, tip, href, onClick, className = "", size = 18, badge, ...rest }) {
  const label = tip || ICON_LABEL[name] || name;
  const inner = (
    <>
      <Glyph name={name} size={size} />
      {badge ? <span className="icon-badge">{badge}</span> : null}
    </>
  );
  if (href)
    return <a href={href} className={`icon-btn ${className}`} data-tip={label} aria-label={label} {...rest}>{inner}</a>;
  return <button type="button" className={`icon-btn ${className}`} data-tip={label} aria-label={label} onClick={onClick} {...rest}>{inner}</button>;
}
