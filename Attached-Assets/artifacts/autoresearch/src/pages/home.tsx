import { useEffect, useRef } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Brain,
  Zap,
  Search,
  FileText,
  TrendingUp,
  Shield,
  Target,
  Users,
  CheckCircle,
  ArrowRight,
  Database,
  Cpu,
  BarChart3,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const agents = [
  { icon: Brain, name: "Manager Agent", desc: "Plans the workflow, delegates tasks, retries failed steps" },
  { icon: Search, name: "Research Agent", desc: "Searches multiple sources, extracts key facts and data" },
  { icon: FileText, name: "Summarizer Agent", desc: "Distills long findings into clear, concise insights" },
  { icon: TrendingUp, name: "Insight Agent", desc: "Detects trends, risks, opportunities, and patterns" },
  { icon: Shield, name: "Fact Check Agent", desc: "Validates data, assigns confidence scores to findings" },
  { icon: Target, name: "Report Agent", desc: "Generates the polished, executive-ready final report" },
];

const modes = [
  { icon: Users, title: "Student Mode", desc: "Career research, skill gaps, job market intelligence", color: "from-blue-500/20 to-blue-600/10" },
  { icon: Zap, title: "Startup Mode", desc: "Competitor analysis, market positioning, funding landscape", color: "from-purple-500/20 to-purple-600/10" },
  { icon: TrendingUp, title: "Investor Mode", desc: "Industry trends, market dynamics, investment signals", color: "from-green-500/20 to-green-600/10" },
  { icon: Brain, title: "Researcher Mode", desc: "Technical depth, academic rigor, emerging directions", color: "from-amber-500/20 to-amber-600/10" },
  { icon: BarChart3, title: "Marketing Mode", desc: "Audience insights, growth trends, campaign intelligence", color: "from-pink-500/20 to-pink-600/10" },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "CS Student, IIT Delhi",
    text: "I used to spend 3+ hours researching career paths. AutoResearch does it in 90 seconds and gives me better structured insights than I ever compiled manually.",
  },
  {
    name: "Marcus Chen",
    role: "Founder, Stealth Startup",
    text: "The competitor analysis mode is incredible. I ran 6 competitor reports in the time it would take me to open 6 browser tabs. This is what AI is supposed to feel like.",
  },
  {
    name: "Dr. Sarah Williams",
    role: "Research Scientist",
    text: "The source reliability scoring and fact-checking agent actually help me trust the output. The confidence meter is a genuinely useful signal I can act on.",
  },
];

const steps = [
  { icon: Globe, label: "Enter a topic" },
  { icon: Brain, label: "Agents activate" },
  { icon: Database, label: "Data gathered" },
  { icon: Cpu, label: "Insights generated" },
  { icon: FileText, label: "Report ready" },
];

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const particles: Array<{ x: number; y: number; vx: number; vy: number; opacity: number }> = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96, 165, 250, ${p.opacity})`;
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(96, 165, 250, ${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative z-10 text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium mb-6">
            <Zap className="w-3 h-3" />
            Agentathon 2026 — Multi-Agent Research Platform
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.05]">
            <span className="text-foreground">Your Autonomous</span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Multi-Agent
            </span>
            <br />
            <span className="text-foreground">Research Team</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Enter any topic. Watch 6 autonomous AI agents collaborate — searching the web, synthesizing findings, 
            validating facts, and generating a polished intelligence report in under 2 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2 px-8 py-3 text-base font-semibold">
                Start Research <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="gap-2 px-8 py-3 text-base">
              <BarChart3 className="w-4 h-4" /> View Example Report
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative z-10 flex items-center gap-3 mt-16"
        >
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="flex items-center gap-3">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center shadow-sm">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-xs text-muted-foreground text-center leading-tight hidden sm:block max-w-[70px]">
                    {step.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className="w-8 h-px bg-border mb-4" />
                )}
              </div>
            );
          })}
        </motion.div>
      </section>

      <section className="py-24 px-4 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">The 6-Agent Workflow</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Each agent specializes in a distinct phase of the research process. They collaborate sequentially, 
              each building on the last to produce a superior final output.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent, i) => {
              const Icon = agent.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="p-5 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">Agent {i + 1}</span>
                  </div>
                  <h3 className="font-semibold text-sm mb-1.5">{agent.name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{agent.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Specialized Research Modes</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Each mode tailors the agents' focus areas, source selection, and output format to your specific needs.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {modes.map((mode, i) => {
              const Icon = mode.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className={`p-5 rounded-xl bg-gradient-to-br ${mode.color} border border-white/5 hover:scale-[1.02] transition-transform cursor-default`}
                >
                  <Icon className="w-6 h-6 text-foreground mb-3 opacity-80" />
                  <h3 className="font-semibold text-sm mb-1.5">{mode.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{mode.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-card/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">What Users Are Saying</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="p-6 rounded-xl border border-border bg-card"
              >
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 italic">"{t.text}"</p>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to research at the speed of thought?
            </h2>
            <p className="text-muted-foreground mb-8">
              Enter any topic and watch your autonomous research team go to work.
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="gap-2 px-10 py-3 text-base font-semibold">
                Launch Dashboard <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center">
              <Brain className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold">AutoResearch AI</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Multi-Agent Research Platform — Agentathon 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
