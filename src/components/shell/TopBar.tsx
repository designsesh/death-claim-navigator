import { useApp } from "@/state/AppContext";
import { Moon, Sun, Settings, User, X, Home, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HoverLabel } from "@/components/common/HoverLabel";
import { cn } from "@/lib/utils";

export function TopBar() {
  const { theme, toggleTheme, tabs, activeTabIndex, setActiveTabIndex, closeClaimTab, getClaim } = useApp();

  return (
    <header className="h-14 flex items-stretch border-b bg-card">
      {/* Logo */}
      <div className="w-60 shrink-0 flex items-center gap-2 px-4 border-r">
        <div className="h-8 w-8 bg-primary text-primary-foreground flex items-center justify-center">
          <Shield className="h-4 w-4" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold">Claims Console</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Death Claims</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-1 flex items-stretch overflow-x-auto">
        {tabs.map((t, i) => {
          const active = i === activeTabIndex;
          if (t.kind === "home") {
            return (
              <button
                key="home"
                onClick={() => setActiveTabIndex(i)}
                className={cn(
                  "flex items-center gap-2 px-4 text-sm border-r transition-colors",
                  active ? "bg-background text-foreground border-b-2 border-b-primary -mb-px" : "text-muted-foreground hover:bg-surface",
                )}
              >
                <Home className="h-4 w-4" />
                Home
              </button>
            );
          }
          const claim = getClaim(t.claimId);
          return (
            <div
              key={t.claimId}
              className={cn(
                "group flex items-center border-r text-sm transition-colors",
                active ? "bg-background text-foreground border-b-2 border-b-primary -mb-px" : "text-muted-foreground hover:bg-surface",
              )}
            >
              <button onClick={() => setActiveTabIndex(i)} className="flex items-center gap-2 pl-4 pr-2 h-full">
                <span className="font-mono text-xs">{t.claimId.replace("CLM-2024-", "…")}</span>
                <span className="hidden lg:inline">— {claim?.death.lastName}</span>
              </button>
              <button
                aria-label="Close tab"
                onClick={() => closeClaimTab(t.claimId)}
                className="px-2 h-full opacity-50 group-hover:opacity-100 hover:text-danger"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1 px-3 border-l">
        <HoverLabel label={theme === "dark" ? "Light mode" : "Dark mode"} side="bottom">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </HoverLabel>
        <HoverLabel label="Settings" side="bottom">
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </HoverLabel>
        <HoverLabel label="Sarah Mitchell — Senior Examiner" side="bottom">
          <Button variant="ghost" size="icon" className="rounded-full">
            <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">SM</div>
          </Button>
        </HoverLabel>
      </div>
    </header>
  );
}
