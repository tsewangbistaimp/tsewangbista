import Link from "next/link";
import { BadgeCheck, CalendarDays, Clock, Compass, MapPin, Mountain, ShieldCheck } from "lucide-react";
import { itineraryBreakdown, money } from "../../lib/guide/pricing";
import { PRICE_STATUS, SERVICE_MODES, pkgSlug, safeUrl, type GuideData, type Itinerary } from "../../lib/guide/types";
import "./guides.css";

const Row = ({ k, v }: { k: string; v?: string }) => (v && v.trim() ? <div className="gd-row"><dt>{k}</dt><dd>{v}</dd></div> : null);
const Lines = ({ text }: { text: string }) => <>{text.split("\n").map((l, i) => <p key={i}>{l}</p>)}</>;
const Img = ({ url, alt, className }: { url: string; alt: string; className?: string }) => {
  const u = safeUrl(url);
  // eslint-disable-next-line @next/next/no-img-element
  return u ? <img src={u} alt={alt} className={className} loading="lazy" referrerPolicy="no-referrer" /> : null;
};

export function priceLine(it: Itinerary): string {
  const { f, currency, status } = it.pricing;
  const label = PRICE_STATUS.find(([k]) => k === status)?.[1] ?? "";
  const base = f.perPerson ? `${currency} ${f.perPerson} per person` : f.perGroup ? `${currency} ${f.perGroup} per group` : f.private ? `${currency} ${f.private} private` : f.custom ? "Custom pricing" : "Price on request";
  return `${base} · ${label}`;
}

export function ProfileView({ d, slug, verified, preview }: { d: GuideData; slug?: string; verified?: boolean; preview?: boolean }) {
  const p = d.p;
  const services = Object.entries(d.services).filter(([, m]) => m !== "none");
  const modeLabel = (m: string) => SERVICE_MODES.find(([k]) => k === m)?.[1] ?? "";
  const wa = p.whatsapp.replace(/[^\d]/g, "");
  return (
    <div className="gd">
      <header className="gd-hero">
        <Img url={p.coverPhoto} alt="" className="gd-cover" />
        <div className="gd-hero-body">
          <Img url={p.profilePhoto} alt={p.displayName} className="gd-avatar" />
          <div>
            <p className="eyebrow">Trekking guide{p.location ? ` · ${p.location}` : ""}</p>
            <h1>{p.displayName || "Guide name"}</h1>
            <p className="gd-headline">{p.headline}</p>
            <p className="gd-badges">
              {verified ? <span className="gd-ok"><BadgeCheck size={15} /> Verified by admin</span> : <span><ShieldCheck size={15} /> {preview ? "Preview" : "Information submitted by the guide"}</span>}
              {d.languages.length ? <span>{d.languages.join(", ")}</span> : null}
            </p>
            {!preview && wa ? <a className="button primary" href={`https://wa.me/${wa}`}>WhatsApp</a> : null}
          </div>
        </div>
      </header>

      <section className="gd-sec"><h2>About</h2><Lines text={p.bio} />
        <dl className="gd-grid">
          <Row k="Nationality" v={p.nationality} /><Row k="Based in" v={p.location} /><Row k="Website" v={safeUrl(p.website)} /><Row k="Social" v={p.socials} />
        </dl>
      </section>

      <section className="gd-sec"><h2>Experience</h2>
        <div className="gd-stats">
          {[["Years of experience", d.q.yearsExp], ["Treks completed", d.q.treksDone], ["Trekkers guided", d.q.trekkersGuided], ["Highest altitude", d.q.highestAlt]].filter(([, v]) => v).map(([k, v]) => (
            <div key={k}><b>{v}</b><span>{k}</span></div>
          ))}
        </div>
        {d.experiences.filter((e) => e.role || e.company).map((e, i) => (
          <article className="gd-card" key={i}><h3>{e.role}{e.company ? ` · ${e.company}` : ""}</h3><p className="gd-meta">{e.period}{e.regions ? ` · ${e.regions}` : ""}</p>{e.details ? <p>{e.details}</p> : null}</article>
        ))}
        <dl className="gd-grid">
          <Row k="Previous companies" v={d.q.previousCompanies} /><Row k="Memorable experiences" v={d.q.memorable} /><Row k="Achievements" v={d.q.achievements} />
        </dl>
      </section>

      <section className="gd-sec"><h2>Qualifications and training</h2>
        <dl className="gd-grid"><Row k="Guide training" v={d.q.training} /><Row k="First aid" v={d.q.firstAid} /><Row k="Wilderness medical" v={d.q.wilderness} /><Row k="Mountain rescue" v={d.q.rescue} /></dl>
        {d.certs.filter((c) => c.name).map((c, i) => (
          <article className="gd-card" key={i}><h3>{c.name}</h3><p className="gd-meta">{c.issuer}{c.issued ? ` · issued ${c.issued}` : ""}{c.expiry ? ` · expires ${c.expiry}` : ""}</p><p className="gd-meta">Listed by the guide{verified ? "; reviewed by admin" : "; not independently verified"}</p></article>
        ))}
      </section>

      <section className="gd-sec"><h2>Trekking expertise</h2>
        {d.regions.map((r) => {
          const i = d.regionInfo[r] ?? {};
          return (
            <article className="gd-card" key={r}><h3><Mountain size={16} /> {r}</h3>
              <dl className="gd-grid"><Row k="Routes known" v={i.routes} /><Row k="Times completed" v={i.timesCompleted} /><Row k="Years in region" v={i.yearsInRegion} /><Row k="Highest altitude" v={i.highestAlt} /><Row k="Difficulty handled" v={i.difficulty} /><Row k="Best seasons" v={i.seasons} /><Row k="Local culture" v={i.culture} /><Row k="Route knowledge" v={i.routeKnowledge} /><Row k="Special expertise" v={i.expertise} /></dl>
            </article>
          );
        })}
        <Row k="Other destinations" v={d.customDestinations} />
      </section>

      {services.length || d.customServices.length ? (
        <section className="gd-sec"><h2>Services</h2>
          <div className="gd-chips">
            {services.map(([n, m]) => <span key={n} className={m === "included" ? "in" : ""}>{n}<small>{modeLabel(m)}</small></span>)}
            {d.customServices.filter((c) => c.mode !== "none").map((c) => <span key={c.name}>{c.name}<small>{modeLabel(c.mode)}</small></span>)}
          </div>
        </section>
      ) : null}

      <section className="gd-sec"><h2>Trekking packages</h2>
        {d.itineraries.length ? (
          <div className="gd-packages">
            {d.itineraries.map((it) => {
              const href = slug ? `/guides/${slug}/${pkgSlug(it)}` : undefined;
              const body = (
                <>
                  <Img url={it.f.photos.split(/\s|,/)[0] ?? ""} alt={it.f.title} className="gd-pkg-img" />
                  <h3>{it.f.title || "Untitled package"}</h3>
                  <p className="gd-meta"><Compass size={14} /> {it.f.region}{it.f.destination ? ` · ${it.f.destination}` : ""}</p>
                  <p className="gd-meta"><Clock size={14} /> {it.f.durationDays ? `${it.f.durationDays} days` : `${it.days.length} listed days`}{it.f.difficulty ? ` · ${it.f.difficulty}` : ""}{it.f.maxAlt ? ` · max ${it.f.maxAlt}` : ""}</p>
                  <p>{it.f.short}</p>
                  <p className="gd-price">{priceLine(it)}</p>
                </>
              );
              return href ? <Link className="gd-card gd-pkg" href={href} key={it.id}>{body}</Link> : <article className="gd-card gd-pkg" key={it.id}>{body}</article>;
            })}
          </div>
        ) : <p className="gd-meta">No packages yet.</p>}
      </section>

      <section className="gd-sec"><h2>Safety and availability</h2>
        <dl className="gd-grid">
          <Row k="First aid status" v={d.safety.firstAidStatus} /><Row k="Emergency response experience" v={d.safety.responseExperience} /><Row k="Altitude sickness awareness" v={d.safety.altitudeAwareness} /><Row k="Acclimatization" v={d.safety.acclimatization} />
          <Row k="Evacuation procedure" v={d.safety.evacuation} /><Row k="Rescue coordination" v={d.safety.rescue} /><Row k="Satellite phone" v={d.safety.satPhone} /><Row k="Communication equipment" v={d.safety.commsEquipment} /><Row k="Weather monitoring" v={d.safety.weatherMonitoring} />
          <Row k="Travel insurance requirements" v={d.safety.insurance} /><Row k="Evacuation insurance requirements" v={d.safety.evacInsurance} />
          <Row k="Available seasons" v={d.availSeasons.join(", ")} /><Row k="Available months" v={d.availMonths.join(", ")} /><Row k="Available dates" v={d.avail.dates} /><Row k="Unavailable dates" v={d.avail.unavailable} />
          <Row k="Max groups at once" v={d.avail.maxGroups} /><Row k="Max group capacity" v={d.avail.maxCapacity} /><Row k="Advance booking" v={d.avail.advance} />
        </dl>
      </section>

      {d.gallery.length ? (
        <section className="gd-sec"><h2>Gallery</h2>
          <div className="gd-gallery">{d.gallery.map((g, i) => <figure key={i}><Img url={g.url} alt={g.caption || g.category} /><figcaption>{g.caption || g.category}</figcaption></figure>)}</div>
        </section>
      ) : null}
    </div>
  );
}

export function PackageView({ it, currency }: { it: Itinerary; currency?: string }) {
  const f = it.f;
  const pr = it.pricing;
  const cur = currency ?? pr.currency;
  const b = itineraryBreakdown(it);
  const costs = pr.costs.filter((c) => c.label && c.amount);
  const incl = [...pr.included, ...pr.customIncluded.split("\n").filter(Boolean)];
  const excl = [...pr.excluded, ...pr.customExcluded.split("\n").filter(Boolean)];
  return (
    <div className="gd">
      <section className="gd-sec">
        <p className="eyebrow">{f.region}</p><h1>{f.title}</h1>
        <p className="gd-headline">{f.short}</p>
        {f.detail ? <Lines text={f.detail} /> : null}
        {f.highlights ? <><h3>Highlights</h3><Lines text={f.highlights} /></> : null}
        <dl className="gd-grid">
          <Row k="Destination" v={f.destination} /><Row k="Duration" v={f.durationDays ? `${f.durationDays} days${f.nights ? ` / ${f.nights} nights` : ""}` : ""} /><Row k="Start" v={f.start} /><Row k="End" v={f.end} />
          <Row k="Maximum altitude" v={f.maxAlt} /><Row k="Distance (km)" v={f.distanceKm} /><Row k="Difficulty" v={f.difficulty} /><Row k="Best season" v={f.season} />
          <Row k="Minimum age" v={f.minAge} /><Row k="Fitness" v={f.fitness} /><Row k="Participants" v={[f.minPart, f.maxPart].filter(Boolean).join(" to ")} />
          <Row k="Accommodation" v={f.accommodation} /><Row k="Transport" v={f.transport} /><Row k="Permits" v={f.permits} />
        </dl>
        {safeUrl(f.mapLink) ? <p><a className="tg-link" href={safeUrl(f.mapLink)}>Route map</a></p> : null}
      </section>

      <section className="gd-sec"><h2>Day-by-day itinerary</h2>
        {it.days.map((d, i) => (
          <article className="gd-card gd-day" key={d.id}>
            <h3><span>{i + 1}</span> {d.title}</h3>
            <p className="gd-meta">{d.type}{d.from || d.to ? ` · ${d.from} to ${d.to}` : ""}</p>
            <dl className="gd-grid">
              <Row k="Altitude" v={[d.altStart, d.altEnd].filter(Boolean).join(" to ")} /><Row k="Elevation change" v={d.gain} /><Row k="Distance" v={d.distance} /><Row k="Walking time" v={d.hours} />
              <Row k="Difficulty" v={d.difficulty} /><Row k="Meals" v={d.meals} /><Row k="Stay" v={d.stay} /><Row k="Activities" v={d.activities} />
            </dl>
            {d.description ? <p>{d.description}</p> : null}
            {d.notes ? <p className="gd-meta">Note: {d.notes}</p> : null}
          </article>
        ))}
        <dl className="gd-grid"><Row k="Alternative routes" v={f.alternatives} /><Row k="Emergency exit points" v={f.emergencyExit} /><Row k="Possible changes" v={f.changes} /><Row k="Weather adjustments" v={f.weather} /><Row k="Safety information" v={f.safetyInfo} /></dl>
      </section>

      <section className="gd-sec"><h2>Price and cost breakdown</h2>
        <p className="gd-price">{priceLine(it)}</p>
        <dl className="gd-grid">
          <Row k="Per person" v={pr.f.perPerson && `${cur} ${pr.f.perPerson}`} /><Row k="Per group" v={pr.f.perGroup && `${cur} ${pr.f.perGroup}`} /><Row k="Private trek" v={pr.f.private && `${cur} ${pr.f.private}`} />
          <Row k="Group trek" v={pr.f.groupPrice && `${cur} ${pr.f.groupPrice}`} /><Row k="Per day" v={pr.f.perDay && `${cur} ${pr.f.perDay}`} /><Row k="Group size" v={[pr.f.minGroup, pr.f.maxGroup].filter(Boolean).join(" to ")} />
          <Row k="Single supplement" v={pr.f.single} /><Row k="Child pricing" v={pr.f.child} /><Row k="Seasonal pricing" v={pr.f.seasonal} /><Row k="Custom pricing" v={pr.f.custom} />
        </dl>
        {costs.length ? (
          <>
            <table className="gd-table"><thead><tr><th>Item</th><th>Type</th><th>Amount ({cur})</th></tr></thead>
              <tbody>{costs.map((c) => <tr key={c.id}><td>{c.label}</td><td>{({ person: "Per person", group: "Per group", day: "Per day", once: "One-time", optional: "Optional" })[c.scope]}</td><td>{c.amount}</td></tr>)}</tbody></table>
            <p className="gd-meta">Cost breakdown for {b.travellers} traveller(s) over {b.days} day(s): <b>{money(b.total, cur)}</b> total, {money(b.perPerson, cur)} per person, {money(b.perDay, cur)} per day{b.optional ? `. Optional extras: ${money(b.optional, cur)}` : ""}. Calculated from the guide&apos;s figures.</p>
          </>
        ) : null}
        <div className="gd-two">
          <div><h3>Included</h3><ul>{incl.map((x) => <li key={x}>{x}</li>)}</ul></div>
          <div><h3>Not included</h3><ul>{excl.map((x) => <li key={x}>{x}</li>)}</ul></div>
        </div>
        <dl className="gd-grid">
          <Row k="Booking deposit" v={pr.f.deposit} /><Row k="Balance due" v={pr.f.balanceDeadline} /><Row k="Payment methods" v={pr.f.paymentMethods} /><Row k="Cancellation deadline" v={pr.f.cancelDeadline} />
          <Row k="Refund conditions" v={pr.f.refund} /><Row k="Weather cancellation" v={pr.f.weatherPolicy} /><Row k="Flight delays" v={pr.f.flightPolicy} /><Row k="Emergency changes" v={pr.f.emergencyPolicy} />
        </dl>
        <p className="gd-meta"><CalendarDays size={14} /> <MapPin size={14} /> Prices are set by the guide. Confirm availability and final price before any payment.</p>
      </section>
    </div>
  );
}
