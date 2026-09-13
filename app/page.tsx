"use client";

import QRCode from "qrcode";
import { ArrowRight, Check, ChevronDown, Contact, Copy, Download, ExternalLink, Link2, LogOut, Menu, MoreHorizontal, Plus, QrCode, Search, Sparkles, Trash2, X } from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";

const FYND_PATH = "M30.872 4.243 27.019 1.043c-1.67-1.389-4.095-1.389-5.765 0l-4.661 3.871-4.657-3.871c-1.671-1.389-4.092-1.391-5.764-.004L2.31 4.243A6.4 6.4 0 0 0 0 9.162v7.97c0 1.899.844 3.699 2.304 4.912l10.199 8.48a6.4 6.4 0 0 0 8.17 0l10.199-8.48a6.4 6.4 0 0 0 2.306-4.916v-7.97a6.4 6.4 0 0 0-2.306-4.915Zm-.701 12.359a4.52 4.52 0 0 1-1.627 3.469l-9.072 7.542a4.52 4.52 0 0 1-5.768 0l-9.071-7.542a4.52 4.52 0 0 1-1.626-3.469V9.69c0-1.342.598-2.614 1.631-3.471l2.733-2.267a2.64 2.64 0 0 1 3.362.002l3.507 2.915-5.118 4.249a2.63 2.63 0 0 0-.002 4.046l5.776 4.813a2.63 2.63 0 0 0 3.366.002l5.792-4.815a2.63 2.63 0 0 0 0-4.046l-2.812-2.337a.375.375 0 0 0-.481 0l-1.764 1.466a.375.375 0 0 0 0 .578l2.091 1.738a.75.75 0 0 1 0 1.156l-4.025 3.349a.75.75 0 0 1-.963-.002l-4.014-3.345a.75.75 0 0 1 .002-1.156l3.249-2.699.775-.642 2.832-2.353 2.249-1.868 1.261-1.049a2.64 2.64 0 0 1 3.363 0l2.727 2.264a4.52 4.52 0 0 1 1.627 3.47Z";

type QrType = "single" | "multi" | "vcard";
type ActiveQrType = "single" | "vcard";
type SavedQr = { id: string; name: string; type: QrType; destination: string; created: string };

function FyndMark({ inverse = false }: { inverse?: boolean }) {
  return <svg aria-label="Fynd" className="fynd-mark" viewBox="0 0 33.178 32"><path d={FYND_PATH} fill={inverse ? "white" : "currentColor"}/></svg>;
}

function StatQr() {
  return <div className="hero-qr" aria-hidden="true"><div className="finder f1"/><div className="finder f2"/><div className="finder f3"/><div className="bits"/><div className="qr-logo"><FyndMark/></div></div>;
}

function SignIn({ onSuccess }: { onSuccess: (email: string) => void }) {
  const [email, setEmail] = useState("paul@gofynd.com");
  const [error, setError] = useState("");
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const normalized = email.trim().toLowerCase();
    if (!/^[^@\s]+@(gofynd|fynd)\.com$/.test(normalized)) {
      setError("Use your @gofynd.com or @fynd.com work email.");
      return;
    }
    localStorage.setItem("fynd-qr-user", normalized);
    onSuccess(normalized);
  };

  return <main className="auth-shell">
    <section className="auth-story">
      <div className="brand-lockup"><FyndMark inverse/><span>Fynd QR</span></div>
      <div className="story-copy"><div className="eyebrow inverse"><Sparkles size={14}/> Built for Fynd teams</div><h1>Every link.<br/><span>One lasting scan.</span></h1><p>Create beautifully branded QR codes that never expire. No limits, no hidden plans.</p></div>
      <div className="story-visual"><StatQr/><div className="floating-card fc-one"><span>Lifetime validity</span><strong>Always on</strong></div><div className="floating-card fc-two"><span>QRs created</span><strong>Unlimited</strong></div></div>
      <p className="story-foot">A Fynd internal tool</p>
    </section>
    <section className="auth-panel"><div className="auth-card"><div className="mobile-brand"><FyndMark/><span>Fynd QR</span></div><div className="eyebrow">Workspace access</div><h2>Create links that last</h2><p>Sign in with your Fynd work email to start creating.</p><form onSubmit={submit}><label htmlFor="email">Work email</label><div className={`field-wrap ${error ? "field-error" : ""}`}><input id="email" type="email" value={email} onChange={(e) => {setEmail(e.target.value); setError("");}} placeholder="you@gofynd.com" autoComplete="email"/><span>@</span></div>{error && <div className="error-text">{error}</div>}<button className="primary wide" type="submit">Continue <ArrowRight size={18}/></button></form><div className="allowed"><Check size={15}/> Only @gofynd.com and @fynd.com accounts are allowed</div></div><p className="legal">By continuing, you agree to use this tool responsibly.</p></section>
  </main>;
}

function QRCanvas({ value, color, canvasRef }: { value: string; color: string; canvasRef: React.RefObject<HTMLCanvasElement | null> }) {
  useEffect(() => {
    let live = true;
    const render = async () => {
      if (!canvasRef.current || !value) return;
      await QRCode.toCanvas(canvasRef.current, value, { width: 560, margin: 3, errorCorrectionLevel: "H", color: { dark: color, light: "#FFFFFF" } });
      if (!live || !canvasRef.current) return;
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;
      const cx = 280, cy = 280, plate = 72;
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.roundRect(cx - plate / 2, cy - plate / 2, plate, plate, 18); ctx.fill();
      ctx.save(); ctx.translate(cx - 22, cy - 21); ctx.scale(44 / 33.178, 42 / 32); ctx.fillStyle = "#3535F3"; ctx.fill(new Path2D(FYND_PATH)); ctx.restore();
    };
    render(); return () => { live = false; };
  }, [value, color, canvasRef]);
  return <canvas ref={canvasRef} aria-label="Generated QR code preview"/>;
}

function Dashboard({ user, onSignOut }: { user: string; onSignOut: () => void }) {
  const [type, setType] = useState<ActiveQrType>("single");
  const [name, setName] = useState("Campaign QR");
  const [singleUrl, setSingleUrl] = useState("https://www.fynd.com");
  const [contact, setContact] = useState({ name: "", company: "", email: "", phone: "" });
  const [color, setColor] = useState("#0E0E0E");
  const [saved, setSaved] = useState<SavedQr[]>([]);
  const [toast, setToast] = useState("");
  const [view, setView] = useState<"create" | "library">("create");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => { try { setSaved(JSON.parse(localStorage.getItem("fynd-qr-library") || "[]")); } catch {} }, []);
  const vcardPayload = useMemo(() => {
    const escapeVcard = (value: string) => value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/([;,])/g, "\\$1");
    const parts = contact.name.trim().split(/\s+/);
    const family = parts.length > 1 ? parts.pop() || "" : "";
    const given = parts.join(" ") || contact.name.trim();
    return ["BEGIN:VCARD", "VERSION:3.0", `N:${escapeVcard(family)};${escapeVcard(given)};;;`, `FN:${escapeVcard(contact.name.trim())}`, contact.company.trim() && `ORG:${escapeVcard(contact.company.trim())}`, contact.phone.trim() && `TEL;TYPE=CELL:${escapeVcard(contact.phone.trim())}`, contact.email.trim() && `EMAIL;TYPE=INTERNET:${escapeVcard(contact.email.trim())}`, "END:VCARD"].filter(Boolean).join("\r\n");
  }, [contact]);
  const value = type === "single" ? singleUrl : vcardPayload;
  const isValid = type === "single" ? /^https?:\/\//i.test(singleUrl) : Boolean(contact.name.trim() && contact.phone.trim() && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact.email));

  const flash = useCallback((message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2200); }, []);
  const saveQr = () => {
    if (!isValid) return flash(type === "single" ? "Enter a valid URL including https://" : "Add a name, valid email, and phone number");
    const item: SavedQr = { id: crypto.randomUUID(), name: name || "Untitled QR", type, destination: type === "single" ? singleUrl : `${contact.name}${contact.company ? ` · ${contact.company}` : ""}`, created: new Date().toISOString() };
    const next = [item, ...saved]; setSaved(next); localStorage.setItem("fynd-qr-library", JSON.stringify(next)); flash("QR saved to your library");
  };
  const download = () => {
    if (!isValid || !canvasRef.current) return flash("Add a valid destination first");
    const anchor = document.createElement("a"); anchor.download = `${(name || "fynd-qr").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`; anchor.href = canvasRef.current.toDataURL("image/png"); anchor.click(); flash("High-resolution PNG downloaded");
  };

  return <div className="app-shell">
    <aside><div className="brand-lockup dark"><FyndMark inverse/><span>Fynd QR</span></div><nav><button className={view === "create" ? "active" : ""} onClick={() => setView("create")}><Plus size={19}/> Create QR</button><button className={view === "library" ? "active" : ""} onClick={() => setView("library")}><QrCode size={19}/> My QR codes <span className="count">{saved.length}</span></button></nav><div className="side-note"><div className="infinity">∞</div><strong>Unlimited. Forever.</strong><p>Your QR codes never expire and have no scan limits.</p></div><button className="profile" onClick={onSignOut}><span className="avatar">{user[0].toUpperCase()}</span><span><strong>{user.split("@")[0]}</strong><small>{user}</small></span><LogOut size={17}/></button></aside>
    <section className="workspace"><header><div><button className="menu-button" aria-label="Open menu"><Menu/></button><span>{view === "create" ? "Create QR code" : "My QR codes"}</span></div><div className="status"><span></span> All systems operational</div></header>
      {view === "create" ? <div className="builder"><div className="builder-head"><div><span className="kicker">QR builder</span><h1>Make your next scan count.</h1><p>Choose a destination, add your touch, and download.</p></div><div className="step-pill"><span>1</span> Destination <i/> <span>2</span> Design <i/> <span>3</span> Download</div></div>
        <div className="builder-grid"><div className="config-card"><div className="type-tabs"><button className={type === "single" ? "active" : ""} onClick={() => setType("single")}><Link2 size={18}/> Single link</button><button className="coming-soon-tab" disabled aria-disabled="true"><Menu size={18}/> Multi link <span>Coming soon</span></button><button className={type === "vcard" ? "active" : ""} onClick={() => setType("vcard")}><Contact size={18}/> Virtual card</button></div><div className="form-body"><div className="field"><label>QR name</label><input value={name} onChange={e => setName(e.target.value)} placeholder={type === "vcard" ? "e.g. My contact card" : "e.g. Store launch"}/></div>{type === "single" ? <div className="field"><label>Destination URL</label><div className="url-input"><Link2 size={18}/><input value={singleUrl} onChange={e => setSingleUrl(e.target.value)} placeholder="https://example.com"/></div><small>Use a complete URL including https://</small></div> : <div className="vcard-editor"><div className="field-label"><label>Contact information</label><small>Saved as a vCard</small></div><div className="contact-fields"><div className="field"><label htmlFor="contact-name">Full name</label><input id="contact-name" value={contact.name} onChange={e => setContact({...contact, name:e.target.value})} placeholder="e.g. Aisha Shah" autoComplete="name"/></div><div className="field"><label htmlFor="contact-company">Company name</label><input id="contact-company" value={contact.company} onChange={e => setContact({...contact, company:e.target.value})} placeholder="e.g. Fynd" autoComplete="organization"/></div><div className="field"><label htmlFor="contact-email">Email</label><input id="contact-email" type="email" value={contact.email} onChange={e => setContact({...contact, email:e.target.value})} placeholder="aisha@gofynd.com" autoComplete="email"/></div><div className="field"><label htmlFor="contact-phone">Phone number</label><input id="contact-phone" type="tel" value={contact.phone} onChange={e => setContact({...contact, phone:e.target.value})} placeholder="+91 98765 43210" autoComplete="tel"/></div></div><div className="vcard-note"><Contact size={16}/><span>When scanned, the phone will offer to add this person to contacts.</span></div></div>}<div className="divider"/><div className="field"><label>QR colour</label><div className="swatches">{["#0E0E0E", "#3535F3", "#000093", "#9747FF"].map(c => <button key={c} aria-label={`Use colour ${c}`} className={color === c ? "selected" : ""} style={{background:c}} onClick={() => setColor(c)}>{color === c && <Check size={15}/>}</button>)}<div className="hex">{color}<ChevronDown size={15}/></div></div></div></div></div>
          <div className="preview-card"><div className="preview-top"><div><span>Live preview</span><small>Updates as you type</small></div><button aria-label="More options"><MoreHorizontal/></button></div><div className="qr-stage"><div className="qr-paper"><QRCanvas value={isValid ? value : "https://www.fynd.com"} color={color} canvasRef={canvasRef}/></div><div className="scan-line"><span/><p>{name || "Untitled QR"}</p><small>{type === "single" ? "Single destination" : "Downloadable contact"} · Never expires</small></div></div><div className="preview-actions"><button className="secondary" onClick={saveQr}><QrCode size={18}/> Save QR</button><button className="primary" onClick={download}><Download size={18}/> Download PNG</button></div></div></div>
        <div className="assurance"><div><Check/><span><strong>Lifetime validity</strong><small>Direct, non-expiring QR data</small></span></div><div><Sparkles/><span><strong>Fynd branded</strong><small>Official mark on every code</small></span></div><div><QrCode/><span><strong>Unlimited scans</strong><small>No counters or usage caps</small></span></div></div>
      </div> : <Library saved={saved} onDelete={(id) => { const next = saved.filter(q => q.id !== id); setSaved(next); localStorage.setItem("fynd-qr-library", JSON.stringify(next)); }} onCreate={() => setView("create")}/>} </section>{toast && <div className="toast"><Check size={17}/>{toast}</div>}
  </div>;
}

function Library({ saved, onDelete, onCreate }: { saved: SavedQr[]; onDelete: (id: string) => void; onCreate: () => void }) {
  const [query, setQuery] = useState("");
  const results = saved.filter(q => q.name.toLowerCase().includes(query.toLowerCase()));
  return <div className="library"><div className="library-head"><div><span className="kicker">Your collection</span><h1>QR codes that keep working.</h1><p>Everything you create stays ready for the next scan.</p></div><button className="primary" onClick={onCreate}><Plus size={18}/> Create QR</button></div><div className="library-tools"><div className="search"><Search size={18}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search QR codes"/></div><button className="filter">All types <ChevronDown size={16}/></button></div>{results.length ? <div className="qr-table"><div className="table-row table-head"><span>Name</span><span>Type</span><span>Created</span><span/></div>{results.map(item => <div className="table-row" key={item.id}><span className="qr-name"><span className="mini-qr">{item.type === "vcard" ? <Contact/> : <QrCode/>}</span><span><strong>{item.name}</strong><small>{item.destination}</small></span></span><span><span className="type-badge">{item.type === "single" ? "Single link" : item.type === "multi" ? "Multi link" : "Virtual card"}</span></span><span>{new Date(item.created).toLocaleDateString(undefined, {day:"numeric", month:"short", year:"numeric"})}</span><span className="row-actions"><button aria-label="Copy destination" onClick={() => navigator.clipboard.writeText(item.destination)}><Copy/></button><button aria-label="Open destination"><ExternalLink/></button><button aria-label="Delete QR" onClick={() => onDelete(item.id)}><Trash2/></button></span></div>)}</div> : <div className="empty-state"><div><QrCode/></div><h2>No QR codes yet</h2><p>Create your first branded QR code in under a minute.</p><button className="primary" onClick={onCreate}>Create your first QR <ArrowRight size={18}/></button></div>}</div>;
}

export default function Home() {
  const [user, setUser] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => { setUser(localStorage.getItem("fynd-qr-user")); setReady(true); }, []);
  if (!ready) return <div className="boot"/>;
  return user ? <Dashboard user={user} onSignOut={() => { localStorage.removeItem("fynd-qr-user"); setUser(null); }}/> : <SignIn onSuccess={setUser}/>;
}
