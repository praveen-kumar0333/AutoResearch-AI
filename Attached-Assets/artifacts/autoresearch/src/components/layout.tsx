import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  LayoutDashboard,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/history", label: "History", icon: History },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <motion.aside
        animate={{ width: collapsed ? 64 : 220 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="relative flex flex-col border-r border-border bg-sidebar shrink-0 overflow-hidden"
      >
        <div className="flex items-center gap-2.5 px-4 py-5 border-b border-border h-16">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary shrink-0">
            <Brain className="w-4 h-4 text-primary-foreground" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="font-bold text-sm whitespace-nowrap text-foreground"
              >
                AutoResearch AI
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href || location.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-2.5 py-2 rounded-lg cursor-pointer transition-colors duration-150",
                    isActive
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                        className="text-sm font-medium whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="px-2 py-4 border-t border-border space-y-2">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center gap-3 px-2.5 py-2 w-full rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 shrink-0" /> : <Moon className="w-4 h-4 shrink-0" />}
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-medium whitespace-nowrap"
                >
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shadow-sm z-10"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </motion.aside>

      <main className="flex-1 overflow-auto">
        <motion.div
          key={location}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
