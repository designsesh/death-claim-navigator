import type { Claim } from "@/types/claim";
import { LeftColumn } from "./left/LeftColumn";
import { CenterColumn } from "./center/CenterColumn";
import { RightColumn } from "./right/RightColumn";
import { ClaimHeaderBar } from "./ClaimHeaderBar";

export function ClaimWorkspace({ claim }: { claim: Claim }) {
  return (
    <div className="h-full flex flex-col min-w-0">
      <ClaimHeaderBar claim={claim} />
      <div className="flex-1 flex min-w-0 min-h-0">
        <LeftColumn claim={claim} />
        <div className="flex-1 min-w-0">
          <CenterColumn claim={claim} />
        </div>
        <RightColumn claim={claim} />
      </div>
    </div>
  );
}
