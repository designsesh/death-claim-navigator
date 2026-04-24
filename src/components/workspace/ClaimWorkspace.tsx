import type { Claim } from "@/types/claim";
import { LeftColumn } from "./left/LeftColumn";
import { CenterColumn } from "./center/CenterColumn";
import { RightColumn } from "./right/RightColumn";

export function ClaimWorkspace({ claim }: { claim: Claim }) {
  return (
    <div className="h-full flex min-w-0">
      <div className="w-[360px] shrink-0 h-full"><LeftColumn claim={claim} /></div>
      <div className="flex-1 min-w-0"><CenterColumn claim={claim} /></div>
      <RightColumn claim={claim} />
    </div>
  );
}
