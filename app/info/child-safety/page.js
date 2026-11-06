import PolicyPage from "../../components/PolicyPage";
import { childSafety } from "../../lib/policies";

export const metadata = { title: "Child Safety Policy — onebigHUB" };

export default function Page() {
  return <PolicyPage title="Child Safety Policy" href="/info/child-safety" blocks={childSafety} />;
}
