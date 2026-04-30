import type { Claim } from "@/types/claim";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClaimsTab } from "./tabs/ClaimsTab";
import { PolicyTab } from "./tabs/PolicyTab";
import { BeneficiaryTab } from "./tabs/BeneficiaryTab";
import { SettlementTab } from "./tabs/SettlementTab";
import { PayoutTab } from "./tabs/PayoutTab";

export function CenterColumn({ claim }: { claim: Claim }) {
  return (
    <div className="h-full flex flex-col bg-background min-w-0">
      <Tabs defaultValue="claims" className="flex-1 flex flex-col min-h-0">
        <TabsList className="mx-4 mt-3 self-start">
          <TabsTrigger value="claims">Claims</TabsTrigger>
          <TabsTrigger value="policy">Policy</TabsTrigger>
          <TabsTrigger value="beneficiary">Beneficiaries</TabsTrigger>
          <TabsTrigger value="settlement">Beneficiary Settlement</TabsTrigger>
          <TabsTrigger value="payout">Payout</TabsTrigger>
        </TabsList>
        <div className="flex-1 overflow-auto">
          <TabsContent value="claims" className="mt-0"><ClaimsTab claim={claim} /></TabsContent>
          <TabsContent value="policy" className="mt-0"><PolicyTab claim={claim} /></TabsContent>
          <TabsContent value="beneficiary" className="mt-0"><BeneficiaryTab claim={claim} /></TabsContent>
          <TabsContent value="settlement" className="mt-0"><SettlementTab claim={claim} /></TabsContent>
          <TabsContent value="payout" className="mt-0"><PayoutTab claim={claim} /></TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
