"use client";

import { ReferralShell } from "../../components/ReferralShell";
import EvalForm from "../../components/EvalForm";

// Step 5 — Participants (B, C) Submit Final Evaluation(s) of Each Other.
export default function FinalEvaluations() {
  return (
    <ReferralShell>
      <EvalForm n="5" title="(B, C) - Submit Final Evaluation(s) of Each Other" pairs={[["C", "B"], ["B", "C"]]} />
    </ReferralShell>
  );
}
