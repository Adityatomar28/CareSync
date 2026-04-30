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
  Clock,
  Menu,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';

// --- Shared Components ---

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost', size?: 'sm' | 'md' | 'lg' }>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/25": variant === 'primary',
            "bg-white/10 text-white hover:bg-white/20 border border-white/10": variant === 'secondary',
            "border border-white/20 text-white hover:bg-white/10": variant === 'outline',
            "text-gray-300 hover:text-white hover:bg-white/5": variant === 'ghost',
            "h-9 px-4 text-sm": size === 'sm',
            "h-11 px-8 text-base": size === 'md',
            "h-14 px-10 text-lg": size === 'lg',
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
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-[#0f172a] to-[#0f172a] -z-10" />
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            <div className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-300 w-fit">
              <span className="flex h-2 w-2 rounded-full bg-indigo-500 mr-2 animate-pulse" />
              v2.0 is now live
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
              Clinical-grade health insights <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">powered by AI</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-xl">
              Track symptoms, manage medications, and get intelligent health recommendations — all in one secure platform designed for modern healthcare.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  Get Started <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  View Dashboard
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative lg:ml-auto w-full max-w-2xl"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20" />
            <div className="relative rounded-2xl border border-white/10 bg-[#1e1b4b]/80 backdrop-blur-xl shadow-2xl p-6 overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-white font-semibold text-lg">Health Overview</h3>
                  <p className="text-sm text-gray-400">Last 7 days</p>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Activity className="w-4 h-4" />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <p className="text-sm text-gray-400 mb-1">Heart Rate</p>
                  <p className="text-2xl font-bold text-white">72 <span className="text-sm font-normal text-gray-500">bpm</span></p>
                  <div className="mt-2 flex items-center text-xs text-emerald-400">
                    <ArrowRight className="w-3 h-3 -rotate-45 mr-1" /> Normal
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <p className="text-sm text-gray-400 mb-1">Symptoms</p>
                  <p className="text-2xl font-bold text-white">2 <span className="text-sm font-normal text-gray-500">logged</span></p>
                  <div className="mt-2 flex items-center text-xs text-indigo-400">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Mild severity
                  </div>
                </div>
              </div>

              <div className="h-32 w-full flex items-end justify-between gap-2 px-2">
                {[40, 70, 45, 90, 65, 85, 60].map((h, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                    className="w-full bg-gradient-to-t from-indigo-500/20 to-indigo-400 rounded-t-sm"
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
    { icon: MessageSquare, title: "AI Symptom Chat", desc: "Interact with our advanced AI to evaluate your symptoms in real-time." },
    { icon: Activity, title: "Medication Tracking", desc: "Never miss a dose with smart reminders and medication history." },
    { icon: FileText, title: "Health Logs", desc: "Keep a comprehensive daily log of your vitals, mood, and symptoms." },
    { icon: Calendar, title: "Smart Calendar", desc: "Schedule appointments and visualize your health timeline effortlessly." },
    { icon: LineChart, title: "Reports", desc: "Generate clinical-grade reports to share with your healthcare provider." },
    { icon: Shield, title: "Secure Document Vault", desc: "Store your medical records with military-grade encryption." },
  ];

  return (
    <section className="py-24 bg-[#0B1120] relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Comprehensive Care Platform</h2>
          <p className="text-lg text-gray-400">Everything you need to manage your health journey in one intuitive, beautifully designed interface.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="h-12 w-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AIIntelligence() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-3xl -z-10" />
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Multi-agent intelligence for healthcare</h2>
            <p className="text-lg text-gray-400 mb-8">Our proprietary AI models work in tandem to analyze your data, extract meaningful patterns, and provide actionable insights that help you and your doctor make better decisions.</p>
            
            <div className="space-y-6">
              {[
                { icon: Search, title: "Symptom Extraction", desc: "Automatically parses your chat history and notes to identify key medical terms." },
                { icon: Brain, title: "Knowledge Retrieval", desc: "Cross-references your symptoms with vast medical databases for context." },
                { icon: ActivitySquare, title: "Diagnostic Analysis", desc: "Generates preliminary hypotheses to discuss with your healthcare provider." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="shrink-0 mt-1 h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white">{item.title}</h4>
                    <p className="text-gray-400 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2 relative">
             <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-indigo-500/20 rounded-2xl blur-xl" />
             <div className="relative bg-[#1e1b4b]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                    <Brain className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">SymptomSync AI</h3>
                    <p className="text-xs text-indigo-400 flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-400 block" /> Online</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-2xl rounded-tl-sm p-4 w-[85%] text-gray-300 text-sm">
                    Based on your recent logs, I've noticed a pattern of mild headaches recurring every evening around 6 PM.
                  </div>
                  <div className="bg-indigo-500/20 border border-indigo-500/30 rounded-2xl rounded-tr-sm p-4 w-[85%] ml-auto text-white text-sm">
                    Yes, and I've been taking ibuprofen for it.
                  </div>
                  <div className="bg-white/5 rounded-2xl rounded-tl-sm p-4 w-[85%] text-gray-300 text-sm">
                    I've updated your medication log. Considering you've been taking it for 4 days, I recommend mentioning this pattern in your upcoming appointment with Dr. Smith. Would you like me to add this to your next report?
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Infrastructure() {
  const cards = [
    { title: "AWS Deployment", icon: Cloud },
    { title: "Terraform Infrastructure", icon: Server },
    { title: "Containerized Services", icon: Database },
    { title: "CI/CD Pipelines", icon: Activity },
    { title: "Observability", icon: Search },
    { title: "API Services", icon: Server }
  ];

  return (
    <section className="py-24 bg-[#0B1120] border-y border-white/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Cloud-native, secure, and scalable</h2>
          <p className="text-gray-400">Built on modern, enterprise-grade architecture to ensure 99.99% uptime and lightning-fast responses.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
          {cards.map((card, i) => (
            <div key={i} className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-xl text-center hover:bg-white/10 transition-colors">
              <card.icon className="w-8 h-8 text-indigo-400 mb-4" />
              <h4 className="text-white font-medium">{card.title}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Security() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-500/10 text-emerald-400 mb-8 border border-emerald-500/20">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Built to protect sensitive health data</h2>
        <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-5xl mx-auto text-left">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <Lock className="w-6 h-6 text-indigo-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Encryption by Default</h3>
            <p className="text-gray-400">All data is encrypted at rest using AES-256 and in transit via TLS 1.3 protocols.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <Shield className="w-6 h-6 text-indigo-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">HIPAA-Compliant</h3>
            <p className="text-gray-400">Our architecture follows strict guidelines to ensure full compliance with healthcare standards.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <Server className="w-6 h-6 text-indigo-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Operational Resilience</h3>
            <p className="text-gray-400">Automated backups and multi-region failover ensure your data is always available.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const testimonials = [
    { quote: "SymptomSync has completely transformed how my patients track their health between visits. The AI insights are genuinely helpful.", name: "Dr. Sarah Jenkins", role: "Primary Care Physician" },
    { quote: "Finally, an app that isn't clunky. I love how it looks and feels, and the medication reminders actually work.", name: "Michael T.", role: "Patient" }
  ];

  return (
    <section className="py-24 bg-[#0B1120] overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center text-white mb-16">Trusted by doctors and patients</h2>
        <div className="flex flex-col md:flex-row gap-8 justify-center">
          {testimonials.map((t, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-b from-white/10 to-white/5 border border-white/10 p-8 rounded-2xl max-w-md w-full relative"
            >
              <div className="absolute -top-4 -left-2 text-6xl text-indigo-500/20 font-serif">"</div>
              <p className="text-lg text-gray-300 relative z-10 mb-8 leading-relaxed">{t.quote}</p>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold text-xl">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-white font-medium">{t.name}</h4>
                  <p className="text-indigo-400 text-sm">{t.role}</p>
                </div>
              </div>
            </motion.div>
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
    { q: "Does the system support automation?", a: "Yes! Our AI agents automatically parse your chat logs to extract symptoms and suggest log entries, drastically reducing manual data entry." },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <h2 className="text-3xl font-bold text-center text-white mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-white/10 rounded-xl bg-white/5 overflow-hidden transition-colors hover:bg-white/10">
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex items-center justify-between w-full p-6 text-left"
              >
                <span className="text-white font-medium text-lg">{faq.q}</span>
                <ChevronDown className={cn("w-5 h-5 text-gray-400 transition-transform duration-300", openIndex === i ? "rotate-180" : "")} />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="p-6 pt-0 text-gray-400 leading-relaxed border-t border-white/5 mt-2">
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
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-4xl bg-gradient-to-br from-indigo-900 to-[#1e1b4b] border border-indigo-500/30 rounded-3xl p-12 text-center relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl" />
        
        <h2 className="text-4xl font-bold text-white mb-6 relative z-10">Ready to take control of your health?</h2>
        <p className="text-xl text-indigo-200 mb-10 max-w-2xl mx-auto relative z-10">Join thousands of users who are already managing their health with clinical-grade AI insights.</p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
          <Link to="/register">
             <Button size="lg" className="w-full sm:w-auto">Start Tracking for Free</Button>
          </Link>
          <Button variant="secondary" size="lg" className="w-full sm:w-auto bg-white/5">Book a Demo</Button>
        </div>
      </div>
    </section>
  );
}

// --- Main Page ---

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0f172a] selection:bg-indigo-500/30">
      <nav className="fixed top-0 inset-x-0 h-16 border-b border-white/10 bg-[#0f172a]/80 backdrop-blur-md z-50">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
               <Activity className="w-5 h-5 text-white" />
             </div>
             <span className="text-xl font-bold text-white tracking-tight">SymptomSync</span>
          </div>
          <div className="hidden md:flex items-center gap-4">
             <Link to="/login">
               <Button variant="ghost">Log in</Button>
             </Link>
             <Link to="/register">
               <Button>Sign Up</Button>
             </Link>
          </div>
          <div className="md:hidden flex items-center">
             <Button variant="ghost" size="sm" className="px-2">
               <Menu className="w-6 h-6 text-white" />
             </Button>
          </div>
        </div>
      </nav>

      <main>
        <Hero />
        <Features />
        <AIIntelligence />
        <Infrastructure />
        <Security />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>

      <footer className="border-t border-white/10 py-12 bg-[#0B1120]">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
             <Activity className="w-5 h-5 text-indigo-500" />
             <span className="text-lg font-semibold text-white tracking-tight">SymptomSync</span>
          </div>
          <p className="text-gray-500 text-sm mb-6">© {new Date().getFullYear()} SymptomSync Inc. All rights reserved.</p>
          <div className="flex justify-center gap-6 text-sm text-gray-400">
             <a href="#" className="hover:text-white transition-colors">Privacy</a>
             <a href="#" className="hover:text-white transition-colors">Terms</a>
             <a href="#" className="hover:text-white transition-colors">Security</a>
             <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
