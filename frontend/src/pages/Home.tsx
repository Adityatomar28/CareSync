import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Activity,
  Calendar,
  MessageSquare,
  FileText,
  Shield,
  Cloud,
  Server,
  Database,
  Lock,
  ChevronDown,
  Brain,
  Search,
  ActivitySquare,
  LineChart,
  ShieldCheck,
  CheckCircle2,
  Menu
} from 'lucide-react';
import { cn } from '../lib/utils';

// --- Shared Components ---

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost', size?: 'sm' | 'md' | 'lg' }>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20": variant === 'primary',
            "bg-slate-800 text-white hover:bg-slate-700 border border-slate-700/50": variant === 'secondary',
            "border border-slate-700 text-white hover:bg-slate-800": variant === 'outline',
            "text-slate-400 hover:text-white hover:bg-slate-800/50": variant === 'ghost',
            "h-9 px-4 text-sm": size === 'sm',
            "h-12 px-6 text-base": size === 'md',
            "h-14 px-8 text-lg": size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

// --- Sections ---

function Hero() {
  return (
    <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden border-b border-slate-800/50 bg-[#0B1120]">
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-indigo-900/20 to-transparent -z-10 opacity-50" />
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-8 max-w-2xl"
          >
            <div className="inline-flex items-center rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300 w-fit">
              <span className="flex h-2 w-2 rounded-full bg-indigo-400 mr-2 animate-pulse" />
              v2.0 is now live
            </div>
            <h1 className="text-5xl lg:text-7xl font-semibold tracking-tight text-white leading-[1.05]">
              Health insights <br className="hidden lg:block" />
              <span className="text-indigo-400">powered by AI.</span>
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed max-w-lg">
              Track symptoms, manage medications, and get intelligent health recommendations in one secure platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto gap-2 px-8">
                  Start tracking free <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto px-8">
                  Sign in
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative lg:ml-auto w-full max-w-xl"
          >
            <div className="relative rounded-2xl border border-slate-700/50 bg-[#1E293B] shadow-2xl p-8 overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-white font-medium text-lg">Health Overview</h3>
                  <p className="text-sm text-slate-400 mt-1">Last 7 days</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <Activity className="w-6 h-6" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-[#0f172a]/50 rounded-xl p-5 border border-slate-700/50">
                  <p className="text-sm text-slate-400 mb-2">Heart Rate</p>
                  <p className="text-3xl font-semibold text-white">72 <span className="text-base font-normal text-slate-500">bpm</span></p>
                  <div className="mt-3 flex items-center text-sm text-emerald-400 font-medium">
                    <ArrowRight className="w-4 h-4 -rotate-45 mr-1" /> Normal
                  </div>
                </div>
                <div className="bg-[#0f172a]/50 rounded-xl p-5 border border-slate-700/50">
                  <p className="text-sm text-slate-400 mb-2">Symptoms</p>
                  <p className="text-3xl font-semibold text-white">2 <span className="text-base font-normal text-slate-500">logged</span></p>
                  <div className="mt-3 flex items-center text-sm text-indigo-400 font-medium">
                    <CheckCircle2 className="w-4 h-4 mr-1" /> Mild severity
                  </div>
                </div>
              </div>

              <div className="h-40 w-full flex items-end justify-between gap-3 px-2">
                {[40, 70, 45, 90, 65, 85, 60].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                    className="w-full bg-indigo-500/80 rounded-t-md hover:bg-indigo-400 transition-colors"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    { icon: MessageSquare, title: "AI Symptom Chat", desc: "Interact with our advanced AI to evaluate your symptoms in real-time securely." },
    { icon: Activity, title: "Medication Tracking", desc: "Never miss a dose with smart reminders and comprehensive medication history." },
    { icon: FileText, title: "Health Logs", desc: "Keep a structured daily log of your vitals, mood, and recurring symptoms." },
    { icon: Calendar, title: "Smart Calendar", desc: "Schedule appointments and visualize your entire health timeline effortlessly." },
    { icon: LineChart, title: "Reports", desc: "Generate clinical-grade reports to share directly with your healthcare provider." },
    { icon: Shield, title: "Secure Vault", desc: "Store your medical records with military-grade AES-256 encryption." },
  ];

  return (
    <section className="py-32 bg-[#0B1120] relative border-b border-slate-800/50">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="mb-20">
          <h2 className="text-3xl font-semibold text-white mb-4">Comprehensive Care Platform</h2>
          <p className="text-lg text-slate-400 max-w-2xl">Everything you need to manage your health journey in one intuitive, beautifully designed interface.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl bg-[#1E293B]/50 border border-slate-700/50 hover:bg-[#1E293B] transition-colors"
            >
              <div className="h-12 w-12 rounded-xl bg-[#0f172a] border border-slate-700 text-indigo-400 flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-medium text-white mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AIIntelligence() {
  return (
    <section className="py-32 bg-[#0B1120] relative overflow-hidden border-b border-slate-800/50">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-semibold text-white mb-6 leading-tight">Multi-agent intelligence</h2>
            <p className="text-lg text-slate-400 mb-12 leading-relaxed">Our proprietary AI models work in tandem to analyze your data, extract meaningful patterns, and provide actionable insights for your doctor.</p>

            <div className="space-y-8">
              {[
                { icon: Search, title: "Symptom Extraction", desc: "Automatically parses your chat history and notes to identify key medical terms." },
                { icon: Brain, title: "Knowledge Retrieval", desc: "Cross-references your symptoms with vast medical databases for context." },
                { icon: ActivitySquare, title: "Diagnostic Analysis", desc: "Generates preliminary hypotheses to discuss with your healthcare provider." }
              ].map((item, i) => (
                <div key={i} className="flex gap-5">
                  <div className="shrink-0 mt-1 h-12 w-12 rounded-full bg-[#1E293B] border border-slate-700 flex items-center justify-center text-indigo-400">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white mb-1">{item.title}</h4>
                    <p className="text-slate-400 leading-relaxed text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2 w-full">
            <div className="bg-[#1E293B] border border-slate-700/50 rounded-2xl p-8 shadow-xl">
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-700/50">
                <div className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-medium text-white">SymptomSync AI</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-2 mt-1"><span className="h-2 w-2 rounded-full bg-emerald-500 block" /> Online</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-indigo-600 rounded-2xl rounded-tr-sm p-5 w-[85%] ml-auto text-white text-sm leading-relaxed">
                  I feel tired all the time.
                </div>
                <div className="bg-[#0f172a] rounded-2xl rounded-tl-sm p-5 w-[85%] text-slate-300 text-sm leading-relaxed border border-slate-700/50">
                  I'm sorry you're feeling that way. How long have you been experiencing fatigue?
                </div>
                <div className="bg-indigo-600 rounded-2xl rounded-tr-sm p-5 w-[85%] ml-auto text-white text-sm leading-relaxed">
                  About 2 weeks.
                </div>
                <div className="bg-[#0f172a] rounded-2xl rounded-tl-sm p-5 w-[85%] text-slate-300 text-sm leading-relaxed border border-slate-700/50">
                  Thank you for sharing. Fatigue lasting more than two weeks can sometimes be related to sleep, stress, or underlying health conditions. Would you like me to log this symptom and generate a summary for your next doctor visit?
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Security() {
  const cards = [
    { title: "Encryption by Default", icon: Lock, desc: "All data is encrypted at rest using AES-256 and in transit via TLS 1.3 protocols." },
    { title: "HIPAA-Compliant", icon: ShieldCheck, desc: "Our architecture follows strict guidelines to ensure full compliance with healthcare standards." },
    { title: "Operational Resilience", icon: Server, desc: "Automated backups and multi-region failover ensure your data is always available." }
  ];

  return (
    <section className="py-32 bg-[#0B1120] border-b border-slate-800/50">
      <div className="container mx-auto px-6 max-w-7xl text-center">
        <h2 className="text-3xl font-semibold text-white mb-16">Enterprise-grade security</h2>
        <div className="grid md:grid-cols-3 gap-6 text-left">
          {cards.map((card, i) => (
            <div key={i} className="p-8 rounded-2xl bg-[#1E293B]/30 border border-slate-700/50">
              <card.icon className="w-8 h-8 text-indigo-400 mb-6" />
              <h3 className="text-lg font-medium text-white mb-3">{card.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    { q: "How secure is my data?", a: "Extremely secure. We use AES-256 encryption for data at rest and TLS 1.3 for data in transit. Our infrastructure is designed to be HIPAA-compliant." },
    { q: "Can I export reports?", a: "Yes, you can generate and export comprehensive health reports in PDF format to easily share with your healthcare providers." },
    { q: "How do reminders work?", a: "We send intelligent notifications for your medications and appointments based on your schedule. You can customize the notification channels in your settings." },
    { q: "Is there mobile support?", a: "Our web application is fully responsive and behaves like a native app on mobile devices. You can add it to your home screen for quick access." },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-32 bg-[#0B1120] border-b border-slate-800/50">
      <div className="container mx-auto px-6 max-w-3xl">
        <h2 className="text-3xl font-semibold text-center text-white mb-16">Frequently asked questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-slate-700/50 rounded-xl bg-[#1E293B]/50 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex items-center justify-between w-full p-6 text-left hover:bg-[#1E293B] transition-colors"
              >
                <span className="text-white font-medium">{faq.q}</span>
                <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform duration-300", openIndex === i ? "rotate-180" : "")} />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-[#1E293B]/30"
                  >
                    <p className="p-6 pt-0 text-slate-400 leading-relaxed text-sm">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-32 bg-[#0B1120]">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="bg-indigo-600 rounded-3xl p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-indigo-500 rounded-full blur-[80px]" />
          <h2 className="text-4xl font-semibold text-white mb-6 relative z-10">Take control of your health</h2>
          <p className="text-lg text-indigo-100 mb-10 max-w-2xl mx-auto relative z-10">Join thousands of users who are already managing their health with clinical-grade AI insights.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto bg-white text-indigo-600 hover:bg-slate-50 px-8">Start Tracking for Free</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Main Page ---

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0B1120] selection:bg-indigo-500/30 font-sans">
      <nav className="fixed top-0 inset-x-0 h-16 border-b border-slate-800/50 bg-[#0B1120]/80 backdrop-blur-md z-50">
        <div className="container mx-auto px-6 max-w-7xl h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-white tracking-tight">SymptomSync</span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Sign Up</Button>
            </Link>
          </div>
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="sm" className="px-2">
              <Menu className="w-6 h-6 text-slate-400" />
            </Button>
          </div>
        </div>
      </nav>

      <main>
        <Hero />
        <Features />
        <AIIntelligence />
        <Security />
        <FAQ />
        <CTA />
      </main>

      <footer className="border-t border-slate-800/50 py-12 bg-[#0B1120]">
        <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-500" />
            <span className="text-base font-semibold text-white">SymptomSync</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <p className="text-slate-500 text-sm">© {new Date().getFullYear()} SymptomSync.</p>
        </div>
      </footer>
    </div>
  );
}
