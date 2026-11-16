"use client";

import { ReferralShell } from "../../components/ReferralShell";
import EvalForm from "../../components/EvalForm";

// Step 3 — Connector (A) Submits Initial Evaluation(s) of Participants (B, C).
export default function FirstEvaluations() {
  return (
    <ReferralShell>
      <EvalForm n="3" title="Connector (A) Submit Initial Evaluation(s) of (B, C)" pairs={[["A", "B"], ["A", "C"]]} />
    </ReferralShell>
  );
}
