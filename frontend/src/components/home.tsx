import { Link } from 'react-router-dom'
import { ArrowRight, Bug, Users, BarChart3, Clock, Github } from 'lucide-react'

export default function Home() {
  const techStack = [
    { name: 'React', category: 'Frontend' },
    { name: 'TypeScript', category: 'Frontend' },
    { name: 'Tailwind CSS', category: 'Styling' },
    { name: 'Vite', category: 'Build Tool' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'Express', category: 'Backend' },
    { name: 'MongoDB', category: 'Database' },
    { name: 'Better Auth', category: 'Auth' },
  ]

  const highlights = [
    {
      title: 'Role-Based Access',
      desc: 'Developers, QA engineers, analysts, and managers each see a tailored view. Admins get full oversight via a dedicated dashboard.',
    },
    {
      title: 'Full Auth Flow',
      desc: 'Register with role selection, sign in with session persistence, and protected routes — built with Better Auth and Zod validation.',
    },
    {
      title: 'Live Bug Management',
      desc: 'Create, assign, prioritise, and close bugs. Log hours worked, add test cases, and leave threaded comments on every issue.',
    },
    {
      title: 'Admin Dashboard',
      desc: 'Real-time pie chart of open vs closed bugs, user table with role badges, and summary stats — all driven by live API data.',
    },
  ]

  return (
    <div className="bg-white text-neutral-900">

      {/* HERO */}
      <section className="relative min-h-[88vh] overflow-hidden">
        <img
          src="/IssueTrackerHero.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-neutral-950/65" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 h-full min-h-[88vh] flex flex-col justify-end pb-20">
          <p className="text-xs tracking-[0.25em] uppercase text-neutral-400 mb-5 font-medium">
            Portfolio Project — Full-Stack Web App
          </p>
          <h1 className="text-5xl md:text-7xl font-black leading-[0.92] tracking-tight text-white max-w-3xl mb-8">
            Bug tracker,<br />built from<br />scratch.
          </h1>
          <p className="text-neutral-300 text-base max-w-xl mb-10 leading-relaxed">
            A full-stack issue tracking application with role-based access control, real-time dashboards, and a complete auth flow. Built with React, TypeScript, Node.js, and MongoDB.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/Register"
              className="inline-flex items-center gap-2 bg-white text-neutral-900 font-semibold px-6 py-3 text-sm hover:bg-neutral-100 transition-colors"
            >
              Try the demo <ArrowRight size={15} />
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-white/40 text-white font-medium px-6 py-3 text-sm hover:border-white/80 transition-colors"
            >
              <Github size={14} /> View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* TECH STACK STRIP */}
      <section className="bg-neutral-950 text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
          <p className="text-xs uppercase tracking-widest text-neutral-500 mb-5">Tech Stack</p>
          <div className="flex flex-wrap gap-3">
            {techStack.map(t => (
              <span key={t.name} className="inline-flex items-center gap-2 border border-neutral-700 px-3 py-1.5 text-xs font-medium text-neutral-300">
                <span className="text-neutral-600 text-[10px] uppercase tracking-wider">{t.category}</span>
                {t.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-24">
        <div className="flex items-end justify-between mb-14 gap-6 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-widest text-neutral-400 mb-3">What I Built</p>
            <h2 className="text-4xl font-black leading-tight">Key features.</h2>
          </div>
          <Link to="/Register" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors flex items-center gap-1 shrink-0">
            Try the demo <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-200 border border-neutral-200">
          {[
            { icon: Bug,       title: 'Bug Reporting',   desc: 'Structured issue forms with reproduction steps, priority levels, and automatic tagging by category.' },
            { icon: Users,     title: 'Team Assignment', desc: 'Route issues to the right person by role — developer, QA, analyst, or manager.' },
            { icon: BarChart3, title: 'Admin Dashboard', desc: 'Live charts on open vs closed bugs, a full user table, and summary stats powered by real API calls.' },
            { icon: Clock,     title: 'Work Logging',    desc: 'Log hours per bug, attach test cases, and leave threaded comments — full audit trail on every issue.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white p-8 group hover:bg-neutral-950 transition-colors duration-200">
              <Icon size={18} className="text-neutral-400 group-hover:text-neutral-300 mb-6 transition-colors" />
              <h3 className="font-bold text-neutral-900 group-hover:text-white mb-3 transition-colors">{title}</h3>
              <p className="text-sm text-neutral-500 group-hover:text-neutral-400 leading-relaxed transition-colors">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROJECT HIGHLIGHTS */}
      <section className="bg-neutral-50 py-24 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-neutral-400 mb-3">Under the Hood</p>
          <h2 className="text-3xl font-black text-neutral-900 mb-12 max-w-lg leading-tight">
            Things I focused on getting right.
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {highlights.map((h, i) => (
              <div key={h.title} className="bg-white border border-neutral-200 p-8">
                <p className="text-[10px] text-neutral-400 font-mono mb-4">0{i + 1}</p>
                <h3 className="font-bold text-neutral-900 mb-3 text-lg">{h.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-neutral-950 text-white py-24 px-6 md:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-10">
          <div>
            <h2 className="text-4xl md:text-6xl font-black leading-[0.92] max-w-xl mb-4">
              Want to explore<br />the project?
            </h2>
            <p className="text-neutral-400 text-sm max-w-sm">
              Create a demo account and try the full app, or browse the source code on GitHub.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              to="/Register"
              className="inline-flex items-center gap-2 bg-white text-neutral-900 font-semibold px-8 py-4 text-sm hover:bg-neutral-100 transition-colors"
            >
              Try the demo <ArrowRight size={15} />
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-white/30 text-white font-medium px-8 py-4 text-sm hover:border-white/70 transition-colors"
            >
              <Github size={14} /> Source Code
            </a>
          </div>
        </div>
      </section>

    </div>
  )
}
