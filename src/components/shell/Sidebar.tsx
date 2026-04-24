import { useApp } from "@/state/AppContext";
import { Home, FileStack, Files, Mail, BookOpen, HelpCircle, Settings, ChevronsLeft, ChevronsRight } from "lucide-react";
import { HoverLabel } from "@/components/common/HoverLabel";
import { cn } from "@/lib/utils";

const top = [
  { id: "home", label: "Home", icon: Home },
  { id: "active", label: "Active Claims", icon: FileStack },
  { id: "all", label: "All Claims", icon: Files },
  { id: "email", label: "Email", icon: Mail },
];

const bottom = [
  { id: "kb", label: "Knowledge Base", icon: BookOpen },
  { id: "faq", label: "FAQ Database", icon: HelpCircle },
  { id: "settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, setActiveTabIndex } = useApp();
  const collapsed = sidebarCollapsed;

  const Item = ({ id, label, icon: Icon }: { id: string; label: string; icon: any }) => {
    const btn = (
      <button
        onClick={() => id === "home" && setActiveTabIndex(0)}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
          collapsed && "justify-center px-0",
        )}
      >
        <Icon className="h-4 w-4 shrink-0" />
        {!collapsed && <span>{label}</span>}
      </button>
    );
    return collapsed ? <HoverLabel label={label} side="right">{btn}</HoverLabel> : btn;
  };

  return (
    <aside
      className={cn(
        "shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col transition-[width] duration-200",
        collapsed ? "w-12" : "w-56",
      )}
    >
      <nav className="flex-1 py-3 flex flex-col gap-0.5">
        {top.map((it) => <Item key={it.id} {...it} />)}
      </nav>
      <div className="border-t border-sidebar-border py-3 flex flex-col gap-0.5">
        {bottom.map((it) => <Item key={it.id} {...it} />)}
      </div>
      <button
        onClick={toggleSidebar}
        className="border-t border-sidebar-border h-9 flex items-center justify-center text-muted-foreground hover:bg-sidebar-accent"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
      </button>
    </aside>
  );
}
