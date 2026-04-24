import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { MOCK_CLAIMS } from "@/data/mockClaims";
import type { Claim } from "@/types/claim";

export type TopTab = { kind: "home" } | { kind: "claim"; claimId: string };

interface AppCtx {
  // theme
  theme: "light" | "dark";
  toggleTheme: () => void;

  // sidebar
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // top tabs
  tabs: TopTab[];
  activeTabIndex: number;
  setActiveTabIndex: (i: number) => void;
  openClaimTab: (claimId: string) => void;
  closeClaimTab: (claimId: string) => void;

  // data
  claims: Claim[];
  getClaim: (id: string) => Claim | undefined;
  updateClaim: (id: string, updater: (c: Claim) => Claim) => void;

  // right column
  rightCollapsed: boolean;
  toggleRight: () => void;
}

const Ctx = createContext<AppCtx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const v = typeof window !== "undefined" ? localStorage.getItem("cc-theme") : null;
    return v === "dark" ? "dark" : "light";
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    const v = typeof window !== "undefined" ? localStorage.getItem("cc-sb") : null;
    return v === "1";
  });

  const [rightCollapsed, setRightCollapsed] = useState<boolean>(() => {
    const v = typeof window !== "undefined" ? localStorage.getItem("cc-right") : null;
    return v === "1";
  });

  const [tabs, setTabs] = useState<TopTab[]>([{ kind: "home" }]);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [claims, setClaims] = useState<Claim[]>(MOCK_CLAIMS);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("cc-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("cc-sb", sidebarCollapsed ? "1" : "0");
  }, [sidebarCollapsed]);

  useEffect(() => {
    localStorage.setItem("cc-right", rightCollapsed ? "1" : "0");
  }, [rightCollapsed]);

  const toggleTheme = useCallback(() => setTheme((t) => (t === "light" ? "dark" : "light")), []);
  const toggleSidebar = useCallback(() => setSidebarCollapsed((c) => !c), []);
  const toggleRight = useCallback(() => setRightCollapsed((c) => !c), []);

  const openClaimTab = useCallback((claimId: string) => {
    setTabs((prev) => {
      const idx = prev.findIndex((t) => t.kind === "claim" && t.claimId === claimId);
      if (idx >= 0) {
        setActiveTabIndex(idx);
        return prev;
      }
      const next = [...prev, { kind: "claim" as const, claimId }];
      setActiveTabIndex(next.length - 1);
      return next;
    });
  }, []);

  const closeClaimTab = useCallback((claimId: string) => {
    setTabs((prev) => {
      const idx = prev.findIndex((t) => t.kind === "claim" && t.claimId === claimId);
      if (idx < 0) return prev;
      const next = prev.filter((_, i) => i !== idx);
      setActiveTabIndex((cur) => {
        if (cur === idx) return Math.max(0, idx - 1);
        if (cur > idx) return cur - 1;
        return cur;
      });
      return next;
    });
  }, []);

  const getClaim = useCallback((id: string) => claims.find((c) => c.id === id), [claims]);
  const updateClaim = useCallback((id: string, updater: (c: Claim) => Claim) => {
    setClaims((prev) => prev.map((c) => (c.id === id ? updater(c) : c)));
  }, []);

  const value = useMemo<AppCtx>(
    () => ({
      theme, toggleTheme,
      sidebarCollapsed, toggleSidebar,
      tabs, activeTabIndex, setActiveTabIndex,
      openClaimTab, closeClaimTab,
      claims, getClaim, updateClaim,
      rightCollapsed, toggleRight,
    }),
    [theme, toggleTheme, sidebarCollapsed, toggleSidebar, tabs, activeTabIndex, openClaimTab, closeClaimTab, claims, getClaim, updateClaim, rightCollapsed, toggleRight],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be inside AppProvider");
  return v;
}
