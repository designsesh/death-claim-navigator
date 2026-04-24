import { AppProvider, useApp } from "@/state/AppContext";
import { TopBar } from "@/components/shell/TopBar";
import { Sidebar } from "@/components/shell/Sidebar";
import { HomeView } from "@/components/home/HomeView";
import { ClaimWorkspace } from "@/components/workspace/ClaimWorkspace";

function Shell() {
  const { tabs, activeTabIndex, getClaim } = useApp();
  const active = tabs[activeTabIndex];

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      <TopBar />
      <div className="flex-1 flex min-h-0">
        <Sidebar />
        <main className="flex-1 min-w-0 flex flex-col">
          {active?.kind === "home" && <HomeView />}
          {active?.kind === "claim" && (() => {
            const c = getClaim(active.claimId);
            return c ? <ClaimWorkspace claim={c} /> : <div className="p-6 text-muted-foreground">Claim not found.</div>;
          })()}
        </main>
      </div>
    </div>
  );
}

const Index = () => (
  <AppProvider>
    <Shell />
  </AppProvider>
);

export default Index;
