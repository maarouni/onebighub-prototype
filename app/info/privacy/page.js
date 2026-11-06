import PolicyPage from "../../components/PolicyPage";
import { privacy } from "../../lib/policies";

export const metadata = { title: "Privacy Policy — onebigHUB" };

export default function Page() {
  return <PolicyPage title="Privacy Policy" href="/info/privacy" blocks={privacy} />;
}
