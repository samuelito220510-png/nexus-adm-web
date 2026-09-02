import { type ChangeEvent, type FormEvent, type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ClipboardList,
  Facebook,
  FileCheck2,
  ImagePlus,
  Inbox,
  Instagram,
  LayoutDashboard,
  Mail,
  Phone,
  MapPin,
  Menu,
  MessageCircle,
  Minus,
  Plus,
  ScanLine,
  Send,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  Trash2,
  UserRound,
  Wrench,
  X,
} from 'lucide-react';
import { Link, Route, Router, Switch, useLocation } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import { ErrorBoundary } from '@/components/error-boundary';
import {
  formatCOP,
  serviceCatalog,
  type ChatMessage,
  type RequestStatus,
  type ServiceRequest,
  type WorkspaceRole,
  useNexusWorkspace,
} from '@/hooks/use-nexus-workspace';
import ShapeGrid from '@/components/ShapeGrid';
import GooeyNav from '@/components/GooeyNav';

/** Animated ShapeGrid tuned for dark (black) sections, in brand blue. */
function DarkGridBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <ShapeGrid
        shape="square"
        direction="diagonal"
        speed={0.35}
        squareSize={44}
        borderColor="rgba(91,140,255,0.14)"
        hoverFillColor="rgba(37,99,235,0.55)"
        hoverTrailAmount={5}
      />
    </div>
  );
}

type WorkspaceState = ReturnType<typeof useNexusWorkspace>;

const asset = (file: string) => `${import.meta.env.BASE_URL}${file}`;

/** Smooth-scroll to an in-page section. Needed because the app uses hash routing,
 *  so a plain `#seccion` anchor would be swallowed by the router. */
function scrollToHash(href: string) {
  if (!href.startsWith('#')) return;
  document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const navItems = [
  { label: 'Servicios', href: '#servicios' },
  { label: 'Nosotros', href: '#origen' },
  { label: 'Línea beauty', href: '#beauty' },
  { label: 'Contacto', href: '#contacto' },
];

/* ============================================================
   Brand
   ============================================================ */

function BrandMark({ dark = false }: { dark?: boolean }) {
  const monoColor = dark ? '#f4f6fa' : 'var(--ink)';
  const wordColor = dark ? 'var(--coral-soft)' : 'var(--coral)';
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="NEXUS ADM SAS — inicio">
      <svg width="42" height="34" viewBox="0 0 42 34" aria-hidden="true">
        <text
          x="21"
          y="28"
          textAnchor="middle"
          fontFamily="'Playfair Display', Georgia, serif"
          fontSize="34"
          fontWeight={600}
          letterSpacing="-5"
          fill={monoColor}
        >
          NA
        </text>
      </svg>
      <span className="flex flex-col leading-none">
        <span className="display text-[15px] font-semibold tracking-[.1em]" style={{ color: wordColor }}>
          NEXUS ADM SAS
        </span>
        <span
          className="mt-1 hidden text-[8px] font-semibold tracking-[.14em] sm:block"
          style={{ color: dark ? 'rgba(236,241,248,.5)' : 'var(--muted)' }}
        >
          CONECTAMOS TU POTENCIAL CON RESULTADOS
        </span>
      </span>
    </Link>
  );
}

/* ============================================================
   Public site
   ============================================================ */

function PublicHome({ workspace }: { workspace: WorkspaceState }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email.trim()) {
      localStorage.setItem('nexus-contact-email', email.trim());
      setSubmitted(true);
    }
  };

  return (
    <main>
      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden" style={{ background: 'var(--ink)', color: 'var(--paper)' }} id="inicio">
        <DarkGridBackdrop />
        <div className="hero-glow" style={{ background: 'var(--coral)', width: 420, height: 420, top: -120, right: -80 }} />
        <div className="hero-glow" style={{ background: '#3358d4', width: 360, height: 360, bottom: -160, left: -100, opacity: 0.35 }} />

        <div className="relative section-wrap">
          {/* nav */}
          <nav className="flex min-h-[82px] items-center justify-between" aria-label="Navegación principal">
            <BrandMark dark />
            <div className="hidden md:block">
              <GooeyNav items={navItems} />
            </div>
            <div className="hidden items-center gap-3 md:flex">
              <Link href="/tienda" className="btn btn-ghost-light btn-sm">
                <ShoppingBag size={15} /> Tienda
              </Link>
              <Link href="/panel" className="btn btn-primary btn-sm" data-testid="link-go-panel">
                Ir al panel <ArrowUpRight size={15} />
              </Link>
            </div>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-xl border border-[rgba(236,241,248,.28)] md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {menuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </nav>

          {menuOpen && (
            <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-[rgba(236,241,248,.14)] p-5 md:hidden">
              {navItems.map((item) => (
                <a
                  href={item.href}
                  className="py-1 text-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    setMenuOpen(false);
                    scrollToHash(item.href);
                  }}
                  key={item.href}
                >
                  {item.label}
                </a>
              ))}
              <Link href="/panel" className="btn btn-primary mt-2" onClick={() => setMenuOpen(false)}>
                Ir al panel <ArrowUpRight size={15} />
              </Link>
              <Link href="/tienda" className="btn btn-ghost-light" onClick={() => setMenuOpen(false)}>
                Tienda beauty <ShoppingBag size={15} />
              </Link>
            </div>
          )}

          {/* hero content */}
          <div className="grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_.95fr] lg:gap-16 lg:py-24">
            <div className="max-w-[640px]">
              <div className="eyebrow reveal">Administración · Transformación · Imagen</div>
              <h1 className="display reveal reveal-1 mt-6 text-[clamp(3rem,7vw,6.4rem)] font-medium leading-[.95]">
                Orden para <em style={{ color: 'var(--coral-soft)' }}>avanzar.</em>
                <br />
                Presencia para destacar.
              </h1>
              <p className="reveal reveal-2 mt-8 max-w-[520px] text-[15px] leading-7" style={{ color: 'rgba(236,241,248,.72)' }}>
                Acompañamos a mipymes y emprendedores a trabajar con más claridad, cumplir con
                confianza y proyectar lo mejor de su oficio.
              </p>
              <div className="reveal reveal-3 mt-9 flex flex-wrap items-center gap-3">
                <Link href="/panel" className="btn btn-primary">
                  Ir al panel <ArrowRight size={16} />
                </Link>
                <a href="#servicios" className="btn btn-ghost-light" onClick={(e) => { e.preventDefault(); scrollToHash('#servicios'); }}>
                  Conoce el método <ArrowDownRight size={16} />
                </a>
              </div>
              <div className="reveal reveal-4 mt-12 flex flex-wrap gap-8 border-t border-[rgba(236,241,248,.14)] pt-7">
                <Stat value="3" label="Especialistas dedicados" />
                <Stat value="Ley 594" label="Gestión documental" />
                <Stat value="100%" label="Enfoque en mipymes" />
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[460px] lg:justify-self-end">
              <div className="relative aspect-[.86] overflow-hidden rounded-[26px] p-3" style={{ background: 'var(--coral)' }}>
                <img
                  src={asset('nexus-lashes.jpg')}
                  alt="Implementos de precisión de la línea beauty NEXUS ADM"
                  className="float-slow h-full w-full rounded-[18px] object-cover object-center mix-blend-multiply opacity-95"
                />
                <div className="absolute inset-3 rounded-[18px] border border-[rgba(236,241,248,.4)]" />
              </div>
              <div className="absolute -bottom-6 -right-3 rounded-2xl px-5 py-4 shadow-lg" style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
                <p className="mono text-[9px]" style={{ color: 'var(--coral)' }}>
                  UN MISMO IMPULSO
                </p>
                <p className="mt-1 text-sm font-bold">Orden + imagen</p>
              </div>
            </div>
          </div>
        </div>

        {/* marquee */}
        <div className="relative border-t border-[rgba(236,241,248,.14)]">
          <div className="marquee-track flex items-center gap-8 whitespace-nowrap py-4 text-[10px] font-medium tracking-[.22em]" style={{ color: 'rgba(236,241,248,.5)' }}>
            {Array.from({ length: 2 }).map((_, block) => (
              <span key={block} className="flex items-center gap-8">
                <span>MIPYMES CON FUTURO</span>
                <span style={{ color: 'var(--coral)' }}>●</span>
                <span>ORDEN QUE SE NOTA</span>
                <span style={{ color: 'var(--coral)' }}>●</span>
                <span>CALIDAD QUE AVANZA</span>
                <span style={{ color: 'var(--coral)' }}>●</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Servicios ---------------- */}
      <section className="py-24 sm:py-28" id="servicios">
        <div className="section-wrap">
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
            <div>
              <p className="eyebrow">01 / Lo que ponemos en orden</p>
              <h2 className="display mt-5 max-w-[420px] text-4xl leading-[1.02] sm:text-5xl">
                Una empresa más clara se mueve distinto.
              </h2>
              <p className="mt-6 max-w-[380px] text-[15px] leading-7" style={{ color: 'var(--muted)' }}>
                La administración no tiene por qué sentirse distante. La convertimos en una herramienta
                cotidiana para cuidar lo que haces y hacerlo crecer.
              </p>
              <a href="#origen" className="mt-8 inline-flex items-center gap-2 text-sm font-bold" style={{ color: 'var(--ink)' }} onClick={(e) => { e.preventDefault(); scrollToHash('#origen'); }}>
                Por qué existimos <ArrowUpRight size={16} />
              </a>
            </div>
            <div className="grid gap-4">
              {serviceCatalog.map((service) => {
                const Icon = service.id === 'ley-594' ? FileCheck2 : service.id === 'calidad' ? ShieldCheck : ScanLine;
                return (
                  <article className="card card-hover flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:gap-6" key={service.id}>
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl" style={{ background: 'rgba(37,99,235,.12)', color: 'var(--coral)' }}>
                      <Icon size={20} strokeWidth={1.6} />
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="mono text-[10px]" style={{ color: 'var(--coral)' }}>
                          {service.number}
                        </span>
                        <h3 className="text-lg font-bold">{service.title}</h3>
                      </div>
                      <p className="mt-2 text-sm leading-6" style={{ color: 'var(--muted)' }}>
                        {service.description}
                      </p>
                      <p className="mt-3 text-xs font-semibold" style={{ color: 'var(--coral)' }}>
                        Especialista: {service.specialist} · {service.specialistRole}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Origen ---------------- */}
      <section className="py-6" id="origen">
        <div className="section-wrap">
          <div className="grid items-stretch gap-0 overflow-hidden rounded-[26px] lg:grid-cols-[.9fr_1.1fr]">
            <div className="relative min-h-[360px] p-8 sm:p-12" style={{ background: 'var(--coral)' }}>
              <div className="absolute -right-10 -top-10 h-52 w-52 rounded-full border border-[rgba(10,13,18,.25)]" />
              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="eyebrow" style={{ color: 'var(--ink)' }}>
                    NEXUS ADM SAS
                  </span>
                  <span className="mono text-[10px]" style={{ color: 'rgba(10,13,18,.7)' }}>
                    CO / 2024
                  </span>
                </div>
                <div>
                  <Sparkles size={30} strokeWidth={1.3} className="mb-5" style={{ color: 'var(--ink)' }} />
                  <p className="display max-w-[340px] text-3xl leading-[1.05] sm:text-4xl" style={{ color: 'var(--ink)' }}>
                    La calma también puede ser una estrategia.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-14" style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
              <p className="eyebrow">02 / Nuestro origen</p>
              <h2 className="display mt-5 text-3xl leading-[1.05] sm:text-4xl">Nacimos de una pregunta sencilla.</h2>
              <p className="mt-6 max-w-[520px] text-[15px] leading-7" style={{ color: 'rgba(236,241,248,.7)' }}>
                ¿Cómo acompañar a quienes hacen empresa todos los días, pero todavía cargan sus documentos,
                sus decisiones y su crecimiento en la cabeza?
              </p>
              <p className="mt-4 max-w-[520px] text-[15px] leading-7" style={{ color: 'rgba(236,241,248,.7)' }}>
                NEXUS ADM SAS surge para unir eficiencia administrativa, bienestar e imagen profesional en
                una experiencia cercana para mipymes y emprendedores.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-5 border-t border-[rgba(236,241,248,.14)] pt-6">
                <MiniPoint num="01" text="Eficiencia para la operación" />
                <MiniPoint num="02" text="Bienestar para el día a día" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Beauty ---------------- */}
      <section className="py-24 sm:py-28" id="beauty">
        <div className="section-wrap">
          <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">03 / Una línea que complementa</p>
              <h2 className="display mt-5 max-w-[620px] text-4xl leading-[1.0] sm:text-6xl">
                Tu trabajo también habla antes que tú.
              </h2>
            </div>
            <p className="max-w-[280px] text-sm leading-6" style={{ color: 'var(--muted)' }}>
              Una presentación profesional empieza en los detalles. Por eso creamos una línea beauty con la
              misma exigencia.
            </p>
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-[.95fr_1.05fr] lg:gap-16">
            <div className="relative min-h-[440px] overflow-hidden rounded-[26px] p-4" style={{ background: 'var(--coral)' }}>
              <img
                src={asset('nexus-lashes.jpg')}
                alt="Bandejas de fibras para extensiones de pestañas y pinzas"
                className="h-full min-h-[420px] w-full rounded-[18px] object-cover object-center mix-blend-multiply opacity-95"
              />
              <div className="absolute inset-4 rounded-[18px] border border-[rgba(236,241,248,.5)]" />
            </div>
            <div className="flex flex-col justify-center">
              <p className="max-w-[520px] text-lg leading-8" style={{ color: 'var(--ink)' }}>
                Vendemos pestañas punto a punto y todo lo que necesitas para trabajarlas: adhesivos y pinzas
                de precisión. Productos seleccionados para un acabado natural, definido y de larga duración,
                pensados para quienes buscan calidad en cada aplicación.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {workspace.products.slice(0, 3).map((product) => (
                  <div className="card p-3" key={product.id}>
                    <div className="aspect-[4/3] w-full overflow-hidden rounded-xl" style={{ background: 'var(--coral)' }}>
                      <img src={product.image} alt={product.name} className="h-full w-full object-cover object-center" />
                    </div>
                    <h4 className="mt-3 text-sm font-bold leading-snug">{product.name}</h4>
                    <p className="mt-1 text-sm font-bold" style={{ color: 'var(--coral)' }}>
                      {formatCOP(product.price)}
                    </p>
                  </div>
                ))}
              </div>
              <Link href="/tienda" className="btn btn-primary mt-8 self-start">
                Explorar la línea beauty <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Misión / Visión ---------------- */}
      <section className="py-6">
        <div className="section-wrap">
          <div className="rounded-[26px] p-8 sm:p-14" style={{ background: '#e9eef7' }}>
            <p className="eyebrow" style={{ color: 'var(--ink)' }}>
              04 / Hacia dónde vamos
            </p>
            <div className="mt-8 grid gap-10 sm:grid-cols-2 sm:gap-14">
              <div className="border-t pt-5" style={{ borderColor: 'rgba(10,13,18,.2)' }}>
                <p className="mono text-[10px]" style={{ color: 'var(--coral)' }}>
                  MISIÓN
                </p>
                <p className="mt-4 text-[16px] leading-7" style={{ color: 'var(--ink)' }}>
                  Brindar servicios administrativos y comerciales especializados, orientar en la Ley 594 de
                  2000 y en estándares de control y calidad, digitalizar soportes y ofrecer productos que
                  acompañen a quienes emprenden.
                </p>
              </div>
              <div className="border-t pt-5" style={{ borderColor: 'rgba(10,13,18,.2)' }}>
                <p className="mono text-[10px]" style={{ color: 'var(--coral)' }}>
                  VISIÓN / 2030
                </p>
                <p className="mt-4 text-[16px] leading-7" style={{ color: 'var(--ink)' }}>
                  Ser líderes y referentes por la calidad e innovación de nuestros servicios, reconocidos por
                  ayudar a nuestros clientes a crecer y competir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Contacto ---------------- */}
      <section className="relative overflow-hidden mt-16 py-24 sm:py-28" style={{ background: 'var(--ink)', color: 'var(--paper)' }} id="contacto">
        <DarkGridBackdrop />
        <div className="relative z-10 section-wrap">
          <div className="grid gap-14 lg:grid-cols-[1fr_.7fr] lg:gap-20">
            <div>
              <p className="eyebrow">05 / Demos el siguiente paso</p>
              <h2 className="display mt-5 max-w-[640px] text-4xl leading-[1.0] sm:text-6xl">
                Cuéntanos qué quieres ordenar.
              </h2>
              <p className="mt-6 max-w-[500px] text-[15px] leading-7" style={{ color: 'rgba(236,241,248,.65)' }}>
                Déjanos tu correo y te contactaremos para conversar sobre administración, digitalización,
                calidad o nuestra línea beauty.
              </p>
              <form onSubmit={handleSubmit} className="mt-8 max-w-[540px]">
                <label htmlFor="contact-email" className="mono text-[10px]" style={{ color: 'var(--coral)' }}>
                  TU CORREO ELECTRÓNICO
                </label>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setSubmitted(false);
                    }}
                    placeholder="nombre@tuempresa.com"
                    className="field flex-1"
                    style={{ background: 'transparent', color: 'var(--paper)', borderColor: 'rgba(236,241,248,.28)' }}
                  />
                  <button type="submit" className="btn btn-primary">
                    Quiero conversar <ArrowUpRight size={16} />
                  </button>
                </div>
                {submitted && (
                  <p className="toast-success mt-4 flex items-center gap-2 text-sm" style={{ color: 'var(--coral-soft)' }}>
                    <Check size={16} /> Gracias. Hemos guardado tu interés.
                  </p>
                )}
              </form>
            </div>
            <div className="flex flex-col justify-end border-t border-[rgba(236,241,248,.14)] pt-8 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
              <p className="mono text-[10px]" style={{ color: 'rgba(236,241,248,.45)' }}>
                ENCUÉNTRANOS
              </p>
              <div className="mt-5 flex flex-col gap-4 text-sm" style={{ color: 'rgba(236,241,248,.78)' }}>
                <a href="mailto:nexus.adm.sas@gmail.com" className="flex items-center gap-3 hover:text-white">
                  <Mail size={17} /> nexus.adm.sas@gmail.com
                </a>
                <a href="https://wa.me/573147682797" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-white">
                  <Phone size={17} /> +57 314 768 2797 <span className="text-[11px]" style={{ color: 'rgba(236,241,248,.5)' }}>· WhatsApp</span>
                </a>
                <span className="flex items-center gap-3">
                  <MapPin size={17} /> Colombia
                </span>
              </div>
              <div className="mt-10 flex gap-3">
                <a href="https://www.instagram.com/nexusadm_sas" target="_blank" rel="noreferrer" aria-label="Instagram de NEXUS ADM SAS" className="grid h-10 w-10 place-items-center rounded-xl border border-[rgba(236,241,248,.25)] hover:border-[color:var(--coral)]">
                  <Instagram size={16} />
                </a>
                <a href="https://www.facebook.com/share/1Gnk9DiMaC/?mibextid=wwXIfr" target="_blank" rel="noreferrer" aria-label="Facebook de NEXUS ADM SAS" className="grid h-10 w-10 place-items-center rounded-xl border border-[rgba(236,241,248,.25)] hover:border-[color:var(--coral)]">
                  <Facebook size={16} />
                </a>
                <a href="https://wa.me/573147682797" target="_blank" rel="noreferrer" aria-label="WhatsApp de NEXUS ADM SAS" className="grid h-10 w-10 place-items-center rounded-xl border border-[rgba(236,241,248,.25)] hover:border-[color:var(--coral)]">
                  <Phone size={16} />
                </a>
              </div>
            </div>
          </div>
          <footer className="mt-20 flex flex-col gap-4 border-t border-[rgba(236,241,248,.14)] pt-7 text-[11px] sm:flex-row sm:items-center sm:justify-between" style={{ color: 'rgba(236,241,248,.5)' }}>
            <span className="font-bold tracking-[.16em]" style={{ color: 'rgba(236,241,248,.8)' }}>
              NEXUS ADM SAS
            </span>
            <span>Administración que ordena. Imagen que impulsa.</span>
            <span>© 2024 · Colombia</span>
          </footer>
        </div>
      </section>
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="display text-2xl" style={{ color: 'var(--paper)' }}>
        {value}
      </p>
      <p className="mt-1 text-[11px]" style={{ color: 'rgba(236,241,248,.55)' }}>
        {label}
      </p>
    </div>
  );
}

function MiniPoint({ num, text }: { num: string; text: string }) {
  return (
    <div>
      <span className="mono text-[10px]" style={{ color: 'var(--coral)' }}>
        {num}
      </span>
      <p className="mt-2 text-xs leading-5" style={{ color: 'rgba(236,241,248,.6)' }}>
        {text}
      </p>
    </div>
  );
}

/* ============================================================
   Panel shell (shared by client + worker views)
   ============================================================ */

function PanelShell({
  children,
  active,
  workspace,
  title,
  eyebrow,
  showRoleSwitch = false,
}: {
  children: ReactNode;
  active: 'panel' | 'shop';
  workspace: WorkspaceState;
  title: string;
  eyebrow: string;
  showRoleSwitch?: boolean;
}) {
  const [mobileNav, setMobileNav] = useState(false);
  return (
    <div className="panel-shell">
      <aside
        className={`panel-sidebar fixed inset-y-0 left-0 z-40 w-[260px] -translate-x-full p-5 transition-transform duration-300 md:translate-x-0 ${
          mobileNav ? 'translate-x-0' : ''
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between pb-6">
            <BrandMark dark />
            <button
              type="button"
              onClick={() => setMobileNav(false)}
              className="grid h-8 w-8 place-items-center rounded-lg border border-[rgba(236,241,248,.16)] md:hidden"
              aria-label="Cerrar navegación"
            >
              <X size={15} />
            </button>
          </div>
          <div className="rounded-2xl border border-[rgba(236,241,248,.1)] p-4">
            <p className="mono text-[9px]" style={{ color: 'rgba(236,241,248,.4)' }}>
              MODO ACTIVO
            </p>
            <p className="mt-2 text-sm font-bold">
              {active === 'shop' ? 'Tienda beauty' : workspace.role === 'client' ? 'Vista cliente' : 'Vista trabajador'}
            </p>
            <p className="mt-1 text-[11px]" style={{ color: 'rgba(236,241,248,.5)' }}>
              Prototipo local · datos en tu navegador
            </p>
          </div>
          <nav className="mt-5 space-y-1.5" aria-label="Navegación del panel">
            <Link href="/panel" className={`nav-item ${active === 'panel' ? 'active' : ''}`} onClick={() => setMobileNav(false)}>
              <LayoutDashboard size={17} /> Panel
            </Link>
            <Link href="/tienda" className={`nav-item ${active === 'shop' ? 'active' : ''}`} onClick={() => setMobileNav(false)}>
              <ShoppingBag size={17} /> Tienda beauty
              <span className="ml-auto rounded-full px-1.5 py-0.5 text-[9px]" style={{ background: 'var(--coral)', color: '#fff' }}>
                {workspace.cartCount}
              </span>
            </Link>
          </nav>
          <div className="mt-auto border-t border-[rgba(236,241,248,.1)] pt-4">
            <Link href="/" className="nav-item">
              <ArrowLeft size={16} /> Volver al sitio
            </Link>
          </div>
        </div>
      </aside>

      <div className="md:pl-[260px]">
        <header className="glass sticky top-0 z-30 border-b border-[color:var(--line)] px-4 py-3.5 sm:px-8">
          <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4">
            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-lg border border-[color:var(--line-strong)] md:hidden"
              onClick={() => setMobileNav(true)}
              aria-label="Abrir navegación"
            >
              <Menu size={17} />
            </button>
            <div className="hidden sm:block">
              <p className="eyebrow">{eyebrow}</p>
              <h1 className="mt-1 text-lg font-bold">{title}</h1>
            </div>
            <div className="ml-auto flex items-center gap-3">
              {showRoleSwitch && (
                <div className="hidden sm:block">
                  <RoleToggle role={workspace.role} setRole={workspace.setRole} />
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="min-h-[calc(100dvh-64px)] px-4 py-7 sm:px-8 sm:py-10">
          <div className="mx-auto max-w-[1240px]">{children}</div>
        </main>
      </div>
    </div>
  );
}

function RoleSwitch({ role, setRole }: { role: WorkspaceRole; setRole: (role: WorkspaceRole) => void }) {
  return (
    <div className="segmented" role="tablist" aria-label="Cambiar modo del panel">
      <button
        type="button"
        role="tab"
        aria-selected={role === 'client'}
        className={role === 'client' ? 'active' : ''}
        onClick={() => setRole('client')}
        data-testid="button-role-client"
      >
        <UserRound size={15} /> Cliente
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={role === 'worker'}
        className={role === 'worker' ? 'active' : ''}
        onClick={() => setRole('worker')}
        data-testid="button-role-worker"
      >
        <Wrench size={15} /> Trabajador
      </button>
    </div>
  );
}

/** Role switch with a smooth sliding pill (always-visible animation, any background). */
function RoleToggle({ role, setRole }: { role: WorkspaceRole; setRole: (role: WorkspaceRole) => void }) {
  const isClient = role === 'client';
  return (
    <div className="role-toggle" data-active={role} role="tablist" aria-label="Cambiar modo del panel">
      <span className="role-toggle-thumb" aria-hidden="true" />
      <button
        type="button"
        role="tab"
        aria-selected={isClient}
        className={`role-toggle-opt ${isClient ? 'active' : ''}`}
        onClick={() => setRole('client')}
        data-testid="button-role-client"
      >
        <UserRound size={15} /> Cliente
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={!isClient}
        className={`role-toggle-opt ${!isClient ? 'active' : ''}`}
        onClick={() => setRole('worker')}
        data-testid="button-role-worker"
      >
        <Wrench size={15} /> Trabajador
      </button>
    </div>
  );
}

/* ============================================================
   Shared pieces
   ============================================================ */

function StatusPill({ status }: { status: RequestStatus }) {
  const labels: Record<RequestStatus, string> = {
    received: 'Recibida',
    in_progress: 'En progreso',
    completed: 'Completada',
  };
  const cls = status === 'in_progress' ? 'progress' : status;
  return (
    <span className={`pill pill-${cls}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {labels[status]}
    </span>
  );
}

function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="card flex min-h-[220px] flex-col items-center justify-center p-8 text-center">
      <ClipboardList size={30} style={{ color: 'var(--coral)' }} strokeWidth={1.4} />
      <h3 className="mt-4 text-base font-bold">{title}</h3>
      <p className="mt-2 max-w-[340px] text-sm leading-5" style={{ color: 'var(--muted)' }}>
        {body}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

function StatCard({ label, value, hint, dark = false }: { label: string; value: ReactNode; hint: string; dark?: boolean }) {
  return (
    <div className="card p-5" style={dark ? { background: 'var(--ink)', color: 'var(--paper)', borderColor: 'transparent' } : undefined}>
      <p className="mono text-[9px]" style={{ color: dark ? 'var(--coral-soft)' : 'var(--muted)' }}>
        {label}
      </p>
      <p className="mt-3 text-2xl font-bold">{value}</p>
      <p className="mt-1 text-[11px]" style={{ color: dark ? 'rgba(236,241,248,.55)' : 'var(--muted)' }}>
        {hint}
      </p>
    </div>
  );
}

function ChatPanel({
  request,
  service,
  messages,
  sender,
  onSend,
  onClose,
}: {
  request: ServiceRequest;
  service: (typeof serviceCatalog)[number];
  messages: ChatMessage[];
  sender: 'client' | 'specialist';
  onSend: (text: string) => void;
  onClose?: () => void;
}) {
  const [text, setText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const conversation = messages.filter((message) => message.requestId === request.id);
  const otherName = sender === 'client' ? service.specialist : request.clientName;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [conversation.length]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  };

  return (
    <section className="card flex min-h-[460px] flex-col overflow-hidden" data-testid="panel-chat">
      <div className="flex items-start justify-between border-b border-[color:var(--line)] p-5" style={{ background: 'rgba(37,99,235,.05)' }}>
        <div>
          <p className="eyebrow">Conversación · {sender === 'client' ? 'con tu técnico' : 'con el cliente'}</p>
          <h2 className="mt-2 text-base font-bold">
            {otherName} <span className="font-normal" style={{ color: 'var(--muted)' }}>· {service.shortTitle}</span>
          </h2>
          <p className="mt-1 text-[11px]" style={{ color: 'var(--muted)' }}>
            Solicitud {request.id} · {request.company}
          </p>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg border border-[color:var(--line-strong)]" aria-label="Cerrar conversación">
            <X size={15} />
          </button>
        )}
      </div>
      <div ref={scrollRef} className="chat-scroll flex flex-1 flex-col gap-2.5 overflow-y-auto p-5">
        {conversation.length === 0 ? (
          <div className="m-auto max-w-[280px] text-center">
            <MessageCircle className="mx-auto" size={28} strokeWidth={1.4} style={{ color: 'var(--coral)' }} />
            <p className="mt-4 text-sm font-semibold">La conversación está lista</p>
            <p className="mt-2 text-xs leading-5" style={{ color: 'var(--muted)' }}>
              Escribe un mensaje para iniciar el contacto con {otherName}.
            </p>
          </div>
        ) : (
          conversation.map((message) => {
            const mine = message.sender === sender;
            return (
              <div key={message.id} className={mine ? 'bubble bubble-me' : 'bubble bubble-them'}>
                <p>{message.text}</p>
                <p className="mono mt-1.5 text-[9px]" style={{ opacity: 0.6 }}>
                  {message.sender === 'client' ? request.clientName.split(' ')[0] : service.specialist} · {message.time}
                </p>
              </div>
            );
          })
        )}
      </div>
      <form onSubmit={submit} className="flex gap-2 border-t border-[color:var(--line)] p-4">
        <label htmlFor={`chat-input-${request.id}`} className="sr-only">
          Escribe un mensaje
        </label>
        <input
          id={`chat-input-${request.id}`}
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder={`Escribe a ${otherName}...`}
          className="field flex-1"
          data-testid="input-chat"
        />
        <button type="submit" className="btn btn-primary px-4" aria-label="Enviar mensaje" data-testid="button-send">
          <Send size={16} />
        </button>
      </form>
    </section>
  );
}

/* ============================================================
   Client view
   ============================================================ */

function ClientView({ workspace }: { workspace: WorkspaceState }) {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedChat, setSelectedChat] = useState<string | null>(workspace.requests[0]?.id ?? null);
  const [directServiceId, setDirectServiceId] = useState(serviceCatalog[0].id);
  const [success, setSuccess] = useState('');
  const clientRequests = workspace.requests;
  const currentRequest = clientRequests.find((request) => request.id === selectedChat);
  const chatRequest: ServiceRequest =
    currentRequest ?? {
      id: `consulta-${directServiceId}`,
      serviceId: directServiceId,
      clientName: 'Valentina Ruiz',
      company: 'Taller Vértice',
      summary: 'Consulta inicial sobre este servicio.',
      createdAt: 'Ahora',
      status: 'received',
    };
  const currentService = workspace.getService(chatRequest.serviceId);

  const handleCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const created = workspace.createRequest(
      String(data.get('serviceId')),
      String(data.get('summary')),
      String(data.get('clientName')),
      String(data.get('company')),
    );
    setShowRequestForm(false);
    setSelectedChat(created.id);
    setSuccess('Solicitud creada y especialista asignado.');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <>
      <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Vista cliente</p>
          <h2 className="display mt-3 max-w-[600px] text-4xl leading-none sm:text-5xl">
            Buen día, Valentina. Tu operación, <em style={{ color: 'var(--coral)' }}>más clara.</em>
          </h2>
          <p className="mt-4 max-w-[500px] text-sm leading-6" style={{ color: 'var(--muted)' }}>
            Revisa tus solicitudes, habla con tu técnico asignado y encuentra el siguiente paso sin perderte
            en el papeleo.
          </p>
        </div>
        <button type="button" onClick={() => setShowRequestForm(true)} className="btn btn-primary self-start sm:self-auto" data-testid="button-new-request">
          <Plus size={16} /> Nueva solicitud
        </button>
      </div>

      {success && (
        <div className="toast-success mb-6 flex items-center gap-2 rounded-xl px-4 py-3 text-sm" style={{ background: '#e7edfb', color: '#2145b8' }}>
          <CheckCircle2 size={17} /> {success}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="SOLICITUDES ACTIVAS" value={clientRequests.filter((item) => item.status !== 'completed').length} hint="Acompañamientos abiertos" />
        <StatCard label="TU TÉCNICO" value={<span className="text-lg">{currentService.specialist}</span>} hint={currentService.specialistRole} />
        <StatCard label="PRÓXIMO PASO" value={<span className="text-base">Continúa el chat</span>} hint="Tu contexto queda guardado" dark />
      </div>

      <section className="mt-10">
        <div className="mb-4">
          <p className="eyebrow">Personas asignadas</p>
          <h3 className="mt-2 text-xl font-bold">Habla con el técnico indicado</h3>
          <p className="mt-2 max-w-[620px] text-sm leading-5" style={{ color: 'var(--muted)' }}>
            Cada servicio tiene una persona responsable. El contacto abre un hilo específico y conserva tu
            contexto localmente.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {serviceCatalog.map((service) => (
            <article className="card card-hover flex flex-col justify-between p-5" key={service.id}>
              <div>
                <div className="flex items-start justify-between gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl text-xs font-bold" style={{ background: 'rgba(37,99,235,.12)', color: 'var(--coral)' }}>
                    {service.specialistInitials}
                  </span>
                  <span className="mono text-[9px]" style={{ color: 'var(--coral)' }}>
                    SERVICIO {service.number}
                  </span>
                </div>
                <h4 className="mt-4 text-base font-bold">{service.specialist}</h4>
                <p className="mt-1 text-[11px] font-semibold" style={{ color: 'var(--coral)' }}>
                  {service.specialistRole}
                </p>
                <p className="mt-3 text-xs leading-5" style={{ color: 'var(--muted)' }}>
                  {service.title}. {service.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setDirectServiceId(service.id);
                  setSelectedChat(clientRequests.find((request) => request.serviceId === service.id)?.id ?? null);
                }}
                className="btn btn-outline btn-sm mt-5 self-start"
              >
                <MessageCircle size={15} /> Abrir conversación
              </button>
            </article>
          ))}
        </div>
      </section>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_.9fr]">
        <section>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="eyebrow">Tus solicitudes</p>
              <h3 className="mt-2 text-xl font-bold">Acompañamientos en curso</h3>
            </div>
            <span className="mono text-[9px]" style={{ color: 'var(--muted)' }}>
              {clientRequests.length} REGISTROS
            </span>
          </div>
          {clientRequests.length === 0 ? (
            <EmptyState
              title="Aún no hay solicitudes"
              body="Cuando quieras poner un proceso en orden, tu técnico estará listo para acompañarte."
              action={
                <button type="button" onClick={() => setShowRequestForm(true)} className="btn btn-primary">
                  Crear solicitud
                </button>
              }
            />
          ) : (
            <div className="space-y-3">
              {clientRequests.map((request) => {
                const service = workspace.getService(request.serviceId);
                return (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedChat(request.id);
                      setDirectServiceId(request.serviceId);
                    }}
                    className={`card card-hover block w-full p-5 text-left ${selectedChat === request.id ? 'ring-2 ring-[color:var(--coral)]' : ''}`}
                    key={request.id}
                    data-testid={`card-request-${request.id}`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="mono text-[9px]" style={{ color: 'var(--coral)' }}>
                          {request.id}
                        </span>
                        <span className="text-[10px]" style={{ color: 'var(--muted)' }}>
                          {request.createdAt}
                        </span>
                      </div>
                      <StatusPill status={request.status} />
                    </div>
                    <h4 className="mt-3 text-sm font-bold">{service.title}</h4>
                    <p className="mt-2 text-xs leading-5" style={{ color: 'var(--muted)' }}>
                      {request.summary}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold" style={{ color: 'var(--coral)' }}>
                      <span className="grid h-6 w-6 place-items-center rounded-full text-[9px]" style={{ background: 'rgba(37,99,235,.14)' }}>
                        {service.specialistInitials}
                      </span>
                      {service.specialist} <MessageCircle size={13} className="ml-auto" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>
        <ChatPanel
          request={chatRequest}
          service={currentService}
          messages={workspace.messages}
          sender="client"
          onSend={(text) => workspace.sendMessage(chatRequest.id, text, 'client')}
        />
      </div>

      {showRequestForm && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4" style={{ background: 'rgba(10,13,18,.55)' }}>
          <div className="card w-full max-w-[560px] p-6 sm:p-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="eyebrow">Nueva solicitud</p>
                <h3 className="mt-2 text-2xl font-bold">Cuéntanos qué necesitas ordenar.</h3>
              </div>
              <button type="button" onClick={() => setShowRequestForm(false)} className="grid h-8 w-8 place-items-center rounded-lg border border-[color:var(--line-strong)]" aria-label="Cerrar formulario">
                <X size={15} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="mt-6 space-y-4">
              <div>
                <label htmlFor="request-service" className="mono text-[9px]">
                  SERVICIO
                </label>
                <select id="request-service" name="serviceId" defaultValue={serviceCatalog[0].id} className="field mt-2">
                  {serviceCatalog.map((service) => (
                    <option value={service.id} key={service.id}>
                      {service.title} · {service.specialist}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="request-name" className="mono text-[9px]">
                    TU NOMBRE
                  </label>
                  <input id="request-name" name="clientName" required defaultValue="Valentina Ruiz" className="field mt-2" />
                </div>
                <div>
                  <label htmlFor="request-company" className="mono text-[9px]">
                    EMPRESA
                  </label>
                  <input id="request-company" name="company" required defaultValue="Taller Vértice" className="field mt-2" />
                </div>
              </div>
              <div>
                <label htmlFor="request-summary" className="mono text-[9px]">
                  ¿QUÉ QUIERES RESOLVER?
                </label>
                <textarea id="request-summary" name="summary" required rows={4} placeholder="Describe brevemente tu necesidad..." className="field mt-2 resize-none" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowRequestForm(false)} className="btn btn-outline">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Enviar solicitud <ArrowUpRight size={15} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

/* ============================================================
   Worker view
   ============================================================ */

function WorkerView({ workspace }: { workspace: WorkspaceState }) {
  const [selectedId, setSelectedId] = useState(workspace.requests[0]?.id ?? null);
  const selected = workspace.requests.find((request) => request.id === selectedId) ?? workspace.requests[0];
  const counts = useMemo(
    () => ({
      received: workspace.requests.filter((request) => request.status === 'received').length,
      progress: workspace.requests.filter((request) => request.status === 'in_progress').length,
      completed: workspace.requests.filter((request) => request.status === 'completed').length,
    }),
    [workspace.requests],
  );

  return (
    <>
      <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Vista trabajador · Técnico NEXUS</p>
          <h2 className="display mt-3 text-4xl leading-none sm:text-5xl">
            La claridad, <em style={{ color: 'var(--coral)' }}>en equipo.</em>
          </h2>
          <p className="mt-4 max-w-[520px] text-sm leading-6" style={{ color: 'var(--muted)' }}>
            Recibe solicitudes de tus clientes, cambia su estado y abre el chat para acompañar cada caso.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-[color:var(--line)] bg-white px-3 py-2 text-[11px]" style={{ color: 'var(--muted)' }}>
          <span className="h-2 w-2 rounded-full" style={{ background: '#2563eb' }} /> Datos locales de demo
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="RECIBIDAS" value={counts.received} hint="Por revisar" />
        <StatCard label="EN PROGRESO" value={counts.progress} hint="En acompañamiento" />
        <StatCard label="COMPLETADAS" value={counts.completed} hint="Cerradas" />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
        <section>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="eyebrow">Bandeja de entrada</p>
              <h3 className="mt-2 text-xl font-bold">Solicitudes de clientes</h3>
            </div>
            <span className="mono text-[9px]" style={{ color: 'var(--muted)' }}>
              {workspace.requests.length} EN COLA
            </span>
          </div>
          {workspace.requests.length === 0 ? (
            <EmptyState title="Bandeja despejada" body="Las nuevas solicitudes de clientes aparecerán aquí para que puedas tomarlas." />
          ) : (
            <div className="card overflow-hidden">
              {workspace.requests.map((request, index) => {
                const service = workspace.getService(request.serviceId);
                const snippet = workspace.messages.filter((message) => message.requestId === request.id).slice(-1)[0];
                return (
                  <button
                    type="button"
                    onClick={() => setSelectedId(request.id)}
                    className={`grid w-full gap-3 p-5 text-left transition-colors sm:grid-cols-[1fr_auto] ${index > 0 ? 'border-t border-[color:var(--line)]' : ''} ${
                      selected?.id === request.id ? 'bg-[rgba(37,99,235,.06)]' : 'hover:bg-[rgba(10,13,18,.02)]'
                    }`}
                    key={request.id}
                    data-testid={`row-request-${request.id}`}
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="mono text-[9px]" style={{ color: 'var(--coral)' }}>
                          {request.id}
                        </span>
                        <span className="text-[10px]" style={{ color: 'var(--muted)' }}>
                          {request.createdAt}
                        </span>
                        <StatusPill status={request.status} />
                      </div>
                      <p className="mt-3 text-sm font-bold">
                        {request.company} <span className="font-normal" style={{ color: 'var(--muted)' }}>· {request.clientName}</span>
                      </p>
                      <p className="mt-1 text-xs" style={{ color: 'var(--muted)' }}>
                        {service.title}
                      </p>
                      <p className="mt-2 flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--muted)' }}>
                        <MessageCircle size={12} /> {snippet?.text ?? 'Sin mensajes todavía'}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-[11px] font-bold">{service.specialist}</p>
                      <p className="mt-1 max-w-[160px] text-[10px] leading-4 sm:ml-auto" style={{ color: 'var(--coral)' }}>
                        {service.specialistRole}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>
        {selected && <WorkerRequestDetail request={selected} workspace={workspace} />}
      </div>
    </>
  );
}

function WorkerRequestDetail({ request, workspace }: { request: ServiceRequest; workspace: WorkspaceState }) {
  const service = workspace.getService(request.serviceId);
  const [chatOpen, setChatOpen] = useState(false);
  const setStatus = (status: RequestStatus) => workspace.updateStatus(request.id, status);

  return (
    <section className="card min-h-[420px] p-5 sm:p-6" data-testid="panel-request-detail">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow">Detalle de solicitud</p>
          <h3 className="mt-2 text-xl font-bold">{request.id}</h3>
        </div>
        <StatusPill status={request.status} />
      </div>
      <div className="mt-6 border-y border-[color:var(--line)] py-5">
        <p className="text-sm font-bold">{request.company}</p>
        <p className="mt-1 text-xs" style={{ color: 'var(--muted)' }}>
          {request.clientName}
        </p>
        <p className="mt-4 text-sm leading-6" style={{ color: 'var(--muted)' }}>
          {request.summary}
        </p>
      </div>
      <div className="mt-6 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl text-xs font-bold" style={{ background: 'rgba(37,99,235,.12)', color: 'var(--coral)' }}>
          {service.specialistInitials}
        </span>
        <div>
          <p className="text-sm font-bold">{service.specialist}</p>
          <p className="text-[11px]" style={{ color: 'var(--coral)' }}>
            {service.specialistRole}
          </p>
        </div>
      </div>
      <div className="mt-6">
        <p className="mono text-[9px]" style={{ color: 'var(--muted)' }}>
          CAMBIAR ESTADO
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {(['received', 'in_progress', 'completed'] as RequestStatus[]).map((status) => (
            <button
              type="button"
              onClick={() => setStatus(status)}
              className={`btn btn-sm ${request.status === status ? 'btn-dark' : 'btn-outline'}`}
              key={status}
              data-testid={`button-status-${status}`}
            >
              {status === 'received' ? 'Recibida' : status === 'in_progress' ? 'En progreso' : 'Completada'}
            </button>
          ))}
        </div>
      </div>
      <button type="button" onClick={() => setChatOpen(true)} className="btn btn-primary mt-6" data-testid="button-open-client-chat">
        <MessageCircle size={15} /> Abrir chat con el cliente
      </button>
      {chatOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4" style={{ background: 'rgba(10,13,18,.55)' }}>
          <div className="w-full max-w-[620px]">
            <ChatPanel
              request={request}
              service={service}
              messages={workspace.messages}
              sender="specialist"
              onSend={(text) => workspace.sendMessage(request.id, text, 'specialist')}
              onClose={() => setChatOpen(false)}
            />
          </div>
        </div>
      )}
    </section>
  );
}

/* ============================================================
   Panel route (role-driven)
   ============================================================ */

function Panel({ workspace }: { workspace: WorkspaceState }) {
  return (
    <PanelShell
      active="panel"
      workspace={workspace}
      showRoleSwitch
      eyebrow={workspace.role === 'client' ? '01 / Espacio cliente' : '02 / Espacio trabajador'}
      title={workspace.role === 'client' ? 'Mi espacio de trabajo' : 'Coordinación interna'}
    >
      {/* Mobile role switch (topbar hides it under sm sometimes) */}
      <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-[color:var(--line)] bg-white p-3 sm:hidden">
        <span className="mono text-[9px]" style={{ color: 'var(--muted)' }}>
          MODO
        </span>
        <RoleToggle role={workspace.role} setRole={workspace.setRole} />
      </div>
      {workspace.role === 'client' ? <ClientView workspace={workspace} /> : <WorkerView workspace={workspace} />}
    </PanelShell>
  );
}

/* ============================================================
   Shop
   ============================================================ */

function ProductForm({ workspace }: { workspace: WorkspaceState }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('El archivo debe ser una imagen.'); return; }
    if (file.size > 2_500_000) { setError('La imagen es muy pesada (máx. 2.5 MB).'); return; }
    const reader = new FileReader();
    reader.onload = () => { setImage(String(reader.result)); setError(''); };
    reader.readAsDataURL(file);
  };

  const reset = () => {
    setName(''); setPrice(''); setDescription(''); setImage(''); setError('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const numericPrice = Number(price);
    if (!name.trim()) { setError('Escribe el nombre del producto.'); return; }
    if (!numericPrice || numericPrice <= 0) { setError('Ingresa un precio válido.'); return; }
    if (!image) { setError('Agrega una imagen del producto.'); return; }
    workspace.addProduct({
      name: name.trim(),
      price: Math.round(numericPrice),
      description: description.trim() || 'Producto de la línea beauty NEXUS.',
      image,
    });
    reset();
  };

  return (
    <form onSubmit={handleSubmit} className="card mb-8 p-6" data-testid="form-add-product">
      <div className="flex items-center gap-2">
        <ImagePlus size={18} style={{ color: 'var(--coral)' }} />
        <h3 className="text-lg font-bold">Agregar producto</h3>
      </div>
      <p className="mt-1 text-xs" style={{ color: 'var(--muted)' }}>
        Publica un nuevo producto con su imagen. Se guarda en este navegador (prototipo local).
      </p>

      <div className="mt-5 grid gap-5 lg:grid-cols-[200px_1fr]">
        <div>
          <label className="flex aspect-[4/3] w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-[color:var(--line-strong)] text-center" style={{ background: 'var(--paper-2, #f7f7f5)' }}>
            {image ? (
              <img src={image} alt="Vista previa del producto" className="h-full w-full object-cover" />
            ) : (
              <span className="flex flex-col items-center gap-2 px-3 text-xs" style={{ color: 'var(--muted)' }}>
                <ImagePlus size={22} style={{ color: 'var(--coral)' }} />
                Subir imagen
              </span>
            )}
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" data-testid="input-product-image" />
          </label>
        </div>

        <div className="grid gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mono text-[9px]" style={{ color: 'var(--muted)' }}>NOMBRE</span>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Pestañas punto a punto" className="field mt-1 w-full" data-testid="input-product-name" />
            </label>
            <label className="block">
              <span className="mono text-[9px]" style={{ color: 'var(--muted)' }}>PRECIO (COP)</span>
              <input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="45000" className="field mt-1 w-full" data-testid="input-product-price" />
            </label>
          </div>
          <label className="block">
            <span className="mono text-[9px]" style={{ color: 'var(--muted)' }}>DESCRIPCIÓN</span>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Breve descripción del producto…" className="field mt-1 w-full resize-none" data-testid="input-product-description" />
          </label>
          {error && <p className="text-xs font-semibold" style={{ color: '#c02626' }}>{error}</p>}
          <div className="flex gap-3">
            <button type="submit" className="btn btn-primary btn-sm" data-testid="button-save-product">
              <Plus size={15} /> Publicar producto
            </button>
            <button type="button" onClick={reset} className="btn btn-outline btn-sm">
              Limpiar
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

function ShopView({ workspace }: { workspace: WorkspaceState }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  const isWorker = workspace.role === 'worker';

  const submitOrder = () => {
    if (workspace.cartCount > 0) {
      localStorage.setItem('nexus-last-order', JSON.stringify({ items: workspace.cart, createdAt: new Date().toISOString() }));
      setConfirmation(true);
      setCartOpen(false);
    }
  };

  return (
    <PanelShell active="shop" workspace={workspace} eyebrow="03 / Tienda NEXUS" title="Línea beauty" showRoleSwitch>
      <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Insumos para una práctica pulida</p>
          <h2 className="display mt-3 max-w-[640px] text-4xl leading-none sm:text-5xl">
            Detalles que <em style={{ color: 'var(--coral)' }}>sostienen tu oficio.</em>
          </h2>
          <p className="mt-4 max-w-[520px] text-sm leading-6" style={{ color: 'var(--muted)' }}>
            La línea beauty de NEXUS lleva la misma exigencia de nuestros servicios: materiales confiables,
            selección precisa y una operación que se siente lista.
          </p>
        </div>
        <button type="button" onClick={() => setCartOpen(true)} className="btn btn-primary self-start sm:self-auto" data-testid="button-open-cart">
          <ShoppingBag size={16} /> Carrito
          <span className="rounded-full px-2 py-0.5 text-[9px]" style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
            {workspace.cartCount}
          </span>
        </button>
      </div>

      {confirmation && (
        <div className="toast-success mb-6 flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm" style={{ background: '#e7edfb', color: '#2145b8' }}>
          <span className="flex items-center gap-2">
            <CheckCircle2 size={17} /> Pedido guardado en tu espacio demo. Te contactaremos para coordinarlo.
          </span>
          <button type="button" onClick={() => setConfirmation(false)} aria-label="Cerrar confirmación">
            <X size={15} />
          </button>
        </div>
      )}

      {isWorker && <ProductForm workspace={workspace} />}

      <div className="mb-5 flex items-end justify-between">
        <div>
          <p className="eyebrow">Catálogo</p>
          <h3 className="mt-2 text-xl font-bold">{isWorker ? 'Productos publicados' : 'Nuestros productos'}</h3>
        </div>
        <span className="mono text-[9px]" style={{ color: 'var(--muted)' }}>
          COP · IVA INCLUIDO
        </span>
      </div>

      {workspace.products.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <ShoppingBag size={30} style={{ color: 'var(--coral)' }} strokeWidth={1.3} />
          <p className="mt-4 text-sm font-bold">Aún no hay productos.</p>
          <p className="mt-2 max-w-[260px] text-xs leading-5" style={{ color: 'var(--muted)' }}>
            {isWorker ? 'Agrega tu primer producto con el formulario de arriba.' : 'Muy pronto tendremos productos disponibles.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {workspace.products.map((product) => (
            <div className="card card-hover flex flex-col overflow-hidden p-0" key={product.id} data-testid={`card-product-${product.id}`}>
              <div className="relative aspect-[4/3] w-full overflow-hidden" style={{ background: 'var(--coral)' }}>
                <img src={product.image} alt={product.name} className="h-full w-full object-cover object-center" />
                {isWorker && (
                  <button
                    type="button"
                    onClick={() => workspace.removeProduct(product.id)}
                    className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-lg shadow-md"
                    style={{ background: 'var(--paper)', color: '#c02626' }}
                    aria-label={`Eliminar ${product.name}`}
                    data-testid={`button-remove-product-${product.id}`}
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h4 className="text-base font-bold leading-snug">{product.name}</h4>
                <p className="mt-1.5 flex-1 text-xs leading-5" style={{ color: 'var(--muted)' }}>
                  {product.description}
                </p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-base font-bold">{formatCOP(product.price)}</span>
                  <button
                    type="button"
                    onClick={() => workspace.addToCart(product.id)}
                    className="btn btn-primary btn-sm"
                    data-testid={`button-add-cart-${product.id}`}
                  >
                    <Plus size={15} /> Agregar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end" style={{ background: 'rgba(10,13,18,.45)' }}>
          <aside className="h-full w-full max-w-[430px] overflow-y-auto p-6 shadow-2xl sm:p-8" style={{ background: 'var(--paper)' }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="eyebrow">Tu selección</p>
                <h3 className="mt-2 text-2xl font-bold">Carrito NEXUS</h3>
              </div>
              <button type="button" onClick={() => setCartOpen(false)} className="grid h-9 w-9 place-items-center rounded-lg border border-[color:var(--line-strong)]" aria-label="Cerrar carrito">
                <X size={16} />
              </button>
            </div>
            {workspace.cart.length === 0 ? (
              <div className="flex min-h-[440px] flex-col items-center justify-center text-center">
                <ShoppingBag size={32} style={{ color: 'var(--coral)' }} strokeWidth={1.3} />
                <p className="mt-4 text-sm font-bold">Tu carrito está esperando.</p>
                <p className="mt-2 max-w-[240px] text-xs leading-5" style={{ color: 'var(--muted)' }}>
                  Selecciona un paquete para comenzar una selección que acompañe tu técnica.
                </p>
              </div>
            ) : (
              <div className="mt-8 space-y-4">
                {workspace.cart.map((item) => {
                  const product = workspace.getProduct(item.productId);
                  if (!product) return null;
                  return (
                    <div className="border-b border-[color:var(--line)] pb-4" key={item.productId} data-testid={`row-cart-${item.productId}`}>
                      <div className="flex justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img src={product.image} alt={product.name} className="h-11 w-11 shrink-0 rounded-lg object-cover" />
                          <div>
                            <p className="text-sm font-bold leading-tight">{product.name}</p>
                            <p className="mt-1 text-xs" style={{ color: 'var(--muted)' }}>
                              {formatCOP(product.price)} unidad
                            </p>
                          </div>
                        </div>
                        <button type="button" onClick={() => workspace.removeFromCart(item.productId)} style={{ color: '#5b6472' }} aria-label={`Eliminar ${product.name}`}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <button type="button" onClick={() => workspace.changeCartQuantity(item.productId, -1)} className="grid h-7 w-7 place-items-center rounded-lg border border-[color:var(--line-strong)]" aria-label="Reducir cantidad">
                          <Minus size={13} />
                        </button>
                        <span className="w-7 text-center text-xs font-bold">{item.quantity}</span>
                        <button type="button" onClick={() => workspace.changeCartQuantity(item.productId, 1)} className="grid h-7 w-7 place-items-center rounded-lg border border-[color:var(--line-strong)]" aria-label="Aumentar cantidad">
                          <Plus size={13} />
                        </button>
                        <span className="ml-auto text-sm font-bold">{formatCOP(product.price * item.quantity)}</span>
                      </div>
                    </div>
                  );
                })}
                <div className="border-t border-[color:var(--line-strong)] pt-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: 'var(--muted)' }}>
                      Total
                    </span>
                    <strong className="text-xl">{formatCOP(workspace.cartTotal)}</strong>
                  </div>
                  <button type="button" onClick={submitOrder} className="btn btn-primary mt-5 w-full" data-testid="button-submit-order">
                    Confirmar pedido <Check size={15} />
                  </button>
                  <p className="mt-3 text-center text-[10px] leading-4" style={{ color: 'var(--muted)' }}>
                    Prototipo local: el pedido se guarda en este navegador.
                  </p>
                </div>
              </div>
            )}
          </aside>
        </div>
      )}
    </PanelShell>
  );
}

/* ============================================================
   Not found
   ============================================================ */

function NotFound() {
  return (
    <div className="grid min-h-[100dvh] place-items-center p-6">
      <div className="text-center">
        <Inbox size={40} style={{ color: 'var(--coral)' }} strokeWidth={1.4} className="mx-auto" />
        <h1 className="display mt-5 text-4xl">Página no encontrada</h1>
        <p className="mt-3 text-sm" style={{ color: 'var(--muted)' }}>
          La ruta que buscas no existe.
        </p>
        <Link href="/" className="btn btn-primary mt-6">
          Volver al inicio <ArrowLeft size={16} />
        </Link>
      </div>
    </div>
  );
}

/* ============================================================
   Router / App
   ============================================================ */

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  const workspace = useNexusWorkspace();
  return (
    <Router hook={useHashLocation}>
      <RoutedErrorBoundary>
        <Switch>
          <Route path="/" component={() => <PublicHome workspace={workspace} />} />
          <Route path="/panel" component={() => <Panel workspace={workspace} />} />
          <Route path="/tienda" component={() => <ShopView workspace={workspace} />} />
          <Route component={NotFound} />
        </Switch>
      </RoutedErrorBoundary>
    </Router>
  );
}

export default App;
