import PolicyPage from "../../components/PolicyPage";
import { terms } from "../../lib/policies";

export const metadata = { title: "Terms & Conditions — onebigHUB" };

export default function Page() {
  return <PolicyPage title="Terms & Conditions" href="/info/terms" blocks={terms} />;
}
