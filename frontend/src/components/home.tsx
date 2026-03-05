import { Link } from 'react-router-dom'
import { ArrowRight, Bug, Users, BarChart3, Clock } from 'lucide-react'

export default function Home() {
  const partners = [
    {
      name: 'DevLab Tools',
      tag: 'Developer Tooling',
      blurb: 'Capturing edge-case failures across multiple environments — helping engineers resolve issues 40% faster during sprint cycles.',
      img: '/devLabs.jpg',
      tagline: 'Streamlining QA for fast-moving dev teams',
    },
    {
      name: 'PixelForge Studios',
      tag: 'Indie Game Dev',
      blurb: 'Logging player-reported bugs, prioritising fixes, and pushing clean updates — keeping gameplay smooth at every release.',
      img: '/pixelForge.avif',
      tagline: 'Keeping gameplay smooth and glitch-free',
    },
    {
      name: 'Shopfinity',
      tag: 'E-commerce',
      blurb: 'Monitoring frontend and backend issues in real time, reducing cart abandonment and improving customer trust globally.',
      img: '/shopfinity.jpg',
      tagline: 'E-commerce without the errors',
    },
  ]

  return (
    <div className="bg-white text-neutral-900">

      {/* ── HERO ── */}
      <section className="relative min-h-[88vh] overflow-hidden">
        <img
          src="/heroBackground.avif"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-neutral-950/60" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 h-full min-h-[88vh] flex flex-col justify-end pb-20">
          <p className="text-xs tracking-[0.25em] uppercase text-neutral-300 mb-5 font-medium">We Fix Fast</p>
          <h1 className="text-5xl md:text-7xl font-black leading-[0.92] tracking-tight text-white max-w-3xl mb-8">
            Track, manage,<br />and squash bugs<br />with precision.
          </h1>
          <p className="text-neutral-300 text-base max-w-xl mb-10 leading-relaxed">
            Our bug tracking platform streamlines issue reporting, prioritisation, and resolution — so your team stays focused and your product stays clean.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/Register" className="inline-flex items-center gap-2 bg-white text-neutral-900 font-semibold px-6 py-3 text-sm hover:bg-neutral-100 transition-colors">
              Get Started <ArrowRight size={15} />
            </Link>
            <Link to="/Login" className="inline-flex items-center gap-2 border border-white/40 text-white font-medium px-6 py-3 text-sm hover:border-white/80 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-neutral-950 text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
          {[
            { n: '90+', l: 'Countries' },
            { n: '40%', l: 'Faster Resolution' },
            { n: '10K+', l: 'Issues Tracked' },
            { n: '99.9%', l: 'Uptime' },
          ].map(s => (
            <div key={s.l} className="px-8 py-10">
              <p className="text-3xl font-black mb-1">{s.n}</p>
              <p className="text-xs uppercase tracking-widest text-neutral-400">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-24">
        <div className="flex items-end justify-between mb-14 gap-6 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-widest text-neutral-400 mb-3">Platform</p>
            <h2 className="text-4xl font-black leading-tight">Everything your team needs.</h2>
          </div>
          <Link to="/Register" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors flex items-center gap-1 shrink-0">
            Start for free <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-200 border border-neutral-200">
          {[
            { icon: Bug,      title: 'Bug Reporting',    desc: 'File issues in seconds with structured forms, reproduction steps, and automatic tagging.' },
            { icon: Users,    title: 'Team Assignment',   desc: 'Route issues to the right developer by role — developer, QA, analyst, manager.' },
            { icon: BarChart3, title: 'Admin Dashboard', desc: 'Real-time charts on open vs. closed bugs and full user oversight for admins.' },
            { icon: Clock,    title: 'Work Logging',      desc: 'Log hours per bug, track test cases, and leave threaded comments on every issue.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white p-8 group hover:bg-neutral-950 transition-colors duration-200">
              <Icon size={18} className="text-neutral-400 group-hover:text-neutral-300 mb-6 transition-colors" />
              <h3 className="font-bold text-neutral-900 group-hover:text-white mb-3 transition-colors">{title}</h3>
              <p className="text-sm text-neutral-500 group-hover:text-neutral-400 leading-relaxed transition-colors">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PARTNERS BANNER ── */}
      <section className="bg-[#f5ede0] py-16 px-6 md:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black text-neutral-900 mb-2">
              The leading experts in this field.<br />
              Trusted in over 90 countries.
            </h2>
            <p className="text-sm text-neutral-600">View some of our partners below.</p>
          </div>
          <Link to="/Register" className="shrink-0 text-sm font-semibold border border-neutral-900 text-neutral-900 px-6 py-3 hover:bg-neutral-900 hover:text-white transition-colors">
            Sign up your business
          </Link>
        </div>
      </section>

      {/* ── PARTNER ROWS ── */}
      {partners.map((p, i) => (
        <section key={p.name} className={`py-0 ${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}`}>
          <div className={`max-w-7xl mx-auto grid md:grid-cols-2 ${i % 2 !== 0 ? 'md:[direction:rtl]' : ''}`}>
            {/* Image */}
            <div className="relative overflow-hidden min-h-72 md:min-h-auto [direction:ltr]">
              <img src={p.img} alt={p.name} className="absolute inset-0 w-full h-full object-cover" />
            </div>
            {/* Text */}
            <div className="[direction:ltr] px-10 md:px-16 py-16 md:py-24 flex flex-col justify-center">
              <p className="text-xs uppercase tracking-widest text-neutral-400 mb-2">{p.tag}</p>
              <h2 className="text-3xl font-black text-neutral-900 mb-2 leading-tight">{p.name}</h2>
              <p className="text-sm text-neutral-500 mb-6 leading-relaxed italic">"{p.tagline}"</p>
              <p className="text-sm text-neutral-600 leading-relaxed mb-8">{p.blurb}</p>
              <button className="self-start text-xs font-semibold border border-neutral-300 text-neutral-700 px-5 py-2.5 hover:border-neutral-900 hover:text-neutral-900 transition-colors">
                View Their Website
              </button>
            </div>
          </div>
        </section>
      ))}

      {/* ── CTA ── */}
      <section className="bg-neutral-950 text-white py-24 px-6 md:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-10">
          <h2 className="text-4xl md:text-6xl font-black leading-[0.92] max-w-xl">
            Ready to squash<br />your first bug?
          </h2>
          <Link to="/Register" className="shrink-0 inline-flex items-center gap-2 bg-white text-neutral-900 font-semibold px-8 py-4 text-sm hover:bg-neutral-100 transition-colors">
            Create Free Account <ArrowRight size={15} />
          </Link>
        </div>
      </section>

    </div>
  )
}
